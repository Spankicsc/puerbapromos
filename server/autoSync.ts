import { ObjectStorageService } from './objectStorage';
import type { Brand, Promotion, PromotionItem } from '../shared/schema';
import type { IStorage } from './storage';

interface DataSnapshot {
  version: string;
  timestamp: string;
  brands: Brand[];
  promotions: Promotion[];
  items: PromotionItem[];
}

export class AutoSyncManager {
  private static instance: AutoSyncManager;
  private objectStorage: ObjectStorageService;
  private storage: IStorage | null = null;
  private snapshotKey = 'data/snapshot.json';
  private localVersion = '';
  private pollInterval = 15000; // 15 seconds
  private isPolling = false;
  private isApplyingSnapshot = false; // Prevent loops during snapshot apply
  private role: 'writer' | 'reader';

  constructor() {
    this.objectStorage = new ObjectStorageService();
    // Preview environment is writer, deployment is reader
    this.role = process.env.REPLIT_ENV === 'prod' ? 'reader' : 'writer';
    console.log(`🔄 AutoSync: Initialized as ${this.role}`);
  }

  static getInstance(): AutoSyncManager {
    if (!AutoSyncManager.instance) {
      AutoSyncManager.instance = new AutoSyncManager();
    }
    return AutoSyncManager.instance;
  }

  setStorage(storage: IStorage): void {
    this.storage = storage;
  }

  async initialize(): Promise<void> {
    if (!this.storage) {
      console.error('❌ AutoSync: Storage not set. Call setStorage() first.');
      return;
    }

    try {
      console.log(`🔄 AutoSync: Initializing as ${this.role}...`);
      
      if (this.role === 'reader') {
        // Reader (deployment): Try to load and apply latest snapshot, then start polling
        const snapshot = await this.loadSnapshot();
        if (snapshot) {
          await this.applySnapshot(snapshot);
          this.localVersion = snapshot.version;
          console.log(`✅ AutoSync: Applied snapshot version ${snapshot.version}`);
        }
        this.startPolling();
      } else {
        // Writer (preview): Just start polling, don't auto-publish to avoid loops
        this.startPolling();
      }
      
      console.log('✅ AutoSync: Initialized and polling started');
    } catch (error) {
      console.error('❌ AutoSync: Error during initialization:', error);
    }
  }

  async publishSnapshot(): Promise<void> {
    if (!this.storage || this.role !== 'writer' || this.isApplyingSnapshot) {
      return; // Only writers can publish, and not during snapshot apply
    }

    try {
      console.log('🔄 AutoSync: Publishing snapshot...');
      
      const [brands, promotions] = await Promise.all([
        this.storage.getAllBrands(),
        this.storage.getAllPromotions()
      ]);

      // Get all promotion items
      const items: PromotionItem[] = [];
      for (const promotion of promotions) {
        const promotionItems = await this.storage.getPromotionItemsByPromotion(promotion.id);
        items.push(...promotionItems);
      }

      const snapshot: DataSnapshot = {
        version: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        brands,
        promotions,
        items
      };

      await this.saveSnapshot(snapshot);
      this.localVersion = snapshot.version;
      
      console.log(`✅ AutoSync: Published snapshot version ${snapshot.version} (${brands.length} brands, ${promotions.length} promotions, ${items.length} items)`);
    } catch (error) {
      console.error('❌ AutoSync: Error publishing snapshot:', error);
    }
  }

  private async loadSnapshot(): Promise<DataSnapshot | null> {
    try {
      const objectFile = await this.objectStorage.getObjectEntityFile(`/objects/${this.snapshotKey}`);
      const response = await fetch(objectFile.downloadUrl);
      
      if (!response.ok) {
        return null;
      }

      const snapshot = await response.json();
      return snapshot;
    } catch (error) {
      console.log('📄 AutoSync: No existing snapshot found');
      return null;
    }
  }

  private async saveSnapshot(snapshot: DataSnapshot): Promise<void> {
    try {
      const uploadUrl = await this.objectStorage.getObjectEntityUploadURL();
      const snapshotBlob = new Blob([JSON.stringify(snapshot, null, 2)], { 
        type: 'application/json' 
      });

      const formData = new FormData();
      formData.append('file', snapshotBlob, this.snapshotKey);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to upload snapshot: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ AutoSync: Error saving snapshot:', error);
      throw error;
    }
  }

  private async applySnapshot(snapshot: DataSnapshot): Promise<void> {
    if (!this.storage || this.role !== 'reader') return;

    try {
      this.isApplyingSnapshot = true; // Prevent publishing during apply
      console.log(`🔄 AutoSync: Applying snapshot version ${snapshot.version}...`);

      // Apply brands (upsert based on slug)
      for (const brand of snapshot.brands) {
        const existing = await this.storage.getBrandBySlug(brand.slug);
        if (existing) {
          await this.storage.updateBrand(existing.id, brand);
        } else {
          await this.storage.createBrand(brand);
        }
      }

      // Apply promotions (upsert based on slug)
      for (const promotion of snapshot.promotions) {
        const existing = await this.storage.getPromotionBySlug(promotion.slug);
        if (existing) {
          await this.storage.updatePromotion(existing.id, promotion);
        } else {
          await this.storage.createPromotion(promotion);
        }
      }

      // Apply promotion items (upsert based on ID)
      for (const item of snapshot.items) {
        const existing = await this.storage.getPromotionItemById(item.id);
        if (existing) {
          await this.storage.updatePromotionItem(item.id, item);
        } else {
          await this.storage.createPromotionItem(item);
        }
      }

      console.log(`✅ AutoSync: Applied snapshot with ${snapshot.brands.length} brands, ${snapshot.promotions.length} promotions, ${snapshot.items.length} items`);
    } catch (error) {
      console.error('❌ AutoSync: Error applying snapshot:', error);
    } finally {
      this.isApplyingSnapshot = false;
    }
  }

  private startPolling(): void {
    if (this.isPolling) return;
    
    this.isPolling = true;
    console.log(`🔄 AutoSync: Starting polling every ${this.pollInterval/1000}s as ${this.role}`);

    const poll = async () => {
      try {
        if (this.role === 'reader') {
          // Only readers poll for updates
          const snapshot = await this.loadSnapshot();
          if (snapshot && snapshot.version !== this.localVersion) {
            console.log(`🔄 AutoSync: New version detected: ${snapshot.version} (current: ${this.localVersion})`);
            await this.applySnapshot(snapshot);
            this.localVersion = snapshot.version;
          }
        }
        // Writers don't need to poll, they just publish when data changes
      } catch (error) {
        console.error('❌ AutoSync: Error during polling:', error);
      }

      if (this.isPolling) {
        setTimeout(poll, this.pollInterval);
      }
    };

    setTimeout(poll, this.pollInterval);
  }

  stopPolling(): void {
    this.isPolling = false;
    console.log('⏹️ AutoSync: Stopped polling');
  }

  // Legacy methods for backward compatibility (now trigger publishSnapshot)
  async syncPromotionToSource(promotion: Promotion): Promise<void> {
    await this.publishSnapshot();
  }

  async syncItemToSource(item: PromotionItem, promotionSlug: string): Promise<void> {
    await this.publishSnapshot();
  }

  async syncItemDeletionToSource(itemId: string, promotionSlug: string): Promise<void> {
    await this.publishSnapshot();
  }
}

export const autoSync = AutoSyncManager.getInstance();
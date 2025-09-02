import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Promotion, PromotionItem } from '../shared/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AutoSyncManager {
  private static instance: AutoSyncManager;
  private storagePath = path.join(__dirname, 'storage.ts');

  static getInstance(): AutoSyncManager {
    if (!AutoSyncManager.instance) {
      AutoSyncManager.instance = new AutoSyncManager();
    }
    return AutoSyncManager.instance;
  }

  async syncPromotionToSource(promotion: Promotion): Promise<void> {
    try {
      console.log(`🔄 Sincronizando cambios de ${promotion.name} al código fuente...`);
      
      const content = fs.readFileSync(this.storagePath, 'utf8');
      const updatedContent = this.updatePromotionInSource(content, promotion);
      
      fs.writeFileSync(this.storagePath, updatedContent);
      console.log(`✅ Sincronizado: ${promotion.name}`);
    } catch (error) {
      console.error('❌ Error sincronizando al código:', error);
    }
  }

  async syncItemToSource(item: PromotionItem, promotionSlug: string): Promise<void> {
    try {
      console.log(`🔄 Sincronizando pieza "${item.name}" al código fuente...`);
      
      const content = fs.readFileSync(this.storagePath, 'utf8');
      const updatedContent = this.addOrUpdateItemInSource(content, item, promotionSlug);
      
      fs.writeFileSync(this.storagePath, updatedContent);
      console.log(`✅ Sincronizada pieza: ${item.name}`);
    } catch (error) {
      console.error('❌ Error sincronizando pieza al código:', error);
    }
  }

  async syncItemDeletionToSource(itemId: string, promotionSlug: string): Promise<void> {
    try {
      console.log(`🔄 Eliminando pieza del código fuente...`);
      
      const content = fs.readFileSync(this.storagePath, 'utf8');
      const updatedContent = this.removeItemFromSource(content, itemId, promotionSlug);
      
      fs.writeFileSync(this.storagePath, updatedContent);
      console.log(`✅ Pieza eliminada del código fuente`);
    } catch (error) {
      console.error('❌ Error eliminando pieza del código:', error);
    }
  }

  private updatePromotionInSource(content: string, promotion: Promotion): string {
    // Find the promotion block by slug
    const slugPattern = new RegExp(`(const \\w+: Promotion = {[\\s\\S]*?slug: "${promotion.slug}"[\\s\\S]*?);\\s*this\\.promotions\\.set`, 'g');
    
    return content.replace(slugPattern, (match) => {
      // Extract the promotion object part
      const objMatch = match.match(/(const \w+: Promotion = {[\s\S]*?});/);
      if (!objMatch) return match;

      let promotionObj = objMatch[1];

      // Update key fields that users commonly change
      promotionObj = this.updateField(promotionObj, 'youtubeCommercialUrl', promotion.youtubeCommercialUrl);
      promotionObj = this.updateField(promotionObj, 'buffetGamesVideoUrl', promotion.buffetGamesVideoUrl);
      promotionObj = this.updateField(promotionObj, 'wrapperRotation', promotion.wrapperRotation);
      promotionObj = this.updateField(promotionObj, 'tags', promotion.tags);
      promotionObj = this.updateField(promotionObj, 'imageUrl', promotion.imageUrl);
      promotionObj = this.updateField(promotionObj, 'promotionImagesUrls', promotion.promotionImagesUrls);
      promotionObj = this.updateField(promotionObj, 'wrapperPhotosUrls', promotion.wrapperPhotosUrls);

      return match.replace(objMatch[1], promotionObj);
    });
  }

  private updateField(content: string, fieldName: string, value: any): string {
    const fieldPattern = new RegExp(`(${fieldName}:)([^,\\n]+)`, 'g');
    
    let newValue: string;
    if (value === null) {
      newValue = ' null';
    } else if (typeof value === 'string') {
      newValue = ` "${value}"`;
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        newValue = ' []';
      } else {
        const formattedArray = value.map(item => `"${item}"`).join(',\n        ');
        newValue = ` [\n        ${formattedArray}\n      ]`;
      }
    } else if (typeof value === 'number') {
      newValue = ` ${value}`;
    } else {
      newValue = ` ${JSON.stringify(value)}`;
    }

    return content.replace(fieldPattern, `$1${newValue}`);
  }

  private addOrUpdateItemInSource(content: string, item: PromotionItem, promotionSlug: string): string {
    // For DatabaseStorage, we don't need to maintain items in source code
    // The database is the source of truth for items
    // This method exists to maintain consistency but does nothing
    return content;
  }

  private removeItemFromSource(content: string, itemId: string, promotionSlug: string): string {
    // For DatabaseStorage, we don't need to maintain items in source code
    // The database is the source of truth for items
    // This method exists to maintain consistency but does nothing
    return content;
  }
}

export const autoSync = AutoSyncManager.getInstance();
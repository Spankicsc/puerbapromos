import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import { autoSync } from "./autoSync";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all brands
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getAllBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  // Get brand by slug
  app.get("/api/brands/:slug", async (req, res) => {
    try {
      const brand = await storage.getBrandBySlug(req.params.slug);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brand" });
    }
  });

  // Get promotions by brand slug
  app.get("/api/brands/:slug/promotions", async (req, res) => {
    try {
      const brand = await storage.getBrandBySlug(req.params.slug);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      const promotions = await storage.getPromotionsByBrand(brand.id);
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promotions" });
    }
  });

  // Get all promotions
  app.get("/api/promotions", async (req, res) => {
    try {
      const promotions = await storage.getAllPromotions();
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promotions" });
    }
  });

  // Get promotion by slug
  app.get("/api/promotions/:slug", async (req, res) => {
    try {
      const promotion = await storage.getPromotionBySlug(req.params.slug);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.json(promotion);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promotion" });
    }
  });

  // Get promotion items by promotion slug
  app.get("/api/promotions/:slug/items", async (req, res) => {
    try {
      const promotion = await storage.getPromotionBySlug(req.params.slug);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      const items = await storage.getPromotionItemsByPromotion(promotion.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promotion items" });
    }
  });

  // Create promotion item by promotion ID
  app.post("/api/promotions/:id/items", async (req, res) => {
    try {
      const promotionId = req.params.id;
      const { name, description, imageUrl, rarity, itemNumber } = req.body;
      
      const newItem = await storage.createPromotionItem({
        promotionId,
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        imageUrls: null,
        rarity: rarity || null,
        itemNumber: itemNumber || null,
        metadata: null
      });

      // 🔄 Auto-sync: Sincronizar nueva pieza rara al código fuente
      const promotions = await storage.getAllPromotions();
      const promotion = promotions.find(p => p.id === promotionId);
      if (promotion) {
        autoSync.syncItemToSource(newItem, promotion.slug).catch(error => {
          console.error('Error en auto-sync de pieza rara:', error);
        });
      }
      
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error creating promotion item:", error);
      res.status(500).json({ message: "Failed to create promotion item" });
    }
  });

  // Update promotion item
  app.put("/api/promotion-items/:id", async (req, res) => {
    try {
      const itemId = req.params.id;
      const updateData = req.body;
      
      const updatedItem = await storage.updatePromotionItem(itemId, updateData);
      if (!updatedItem) {
        return res.status(404).json({ message: "Promotion item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating promotion item:", error);
      res.status(500).json({ message: "Failed to update promotion item" });
    }
  });

  // Search promotions
  app.get("/api/search/promotions", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      const promotions = await storage.searchPromotions(query);
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: "Failed to search promotions" });
    }
  });

  // Search items
  app.get("/api/search/items", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      const items = await storage.searchItems(query);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to search items" });
    }
  });

  // Serve public objects from object storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve private objects from object storage  
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Get upload URL for an object entity
  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });


  // CRUD routes for Brands
  app.post("/api/brands", async (req, res) => {
    try {
      const brandData = req.body;
      const brand = await storage.createBrand(brandData);
      res.status(201).json(brand);
    } catch (error) {
      res.status(500).json({ message: "Failed to create brand" });
    }
  });

  app.put("/api/brands/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const brand = await storage.updateBrand(id, updateData);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: "Failed to update brand" });
    }
  });

  app.delete("/api/brands/:id", async (req, res) => {
    try {
      const { id } = req.params;
      // Delete method not implemented for brands
      res.status(405).json({ message: "Delete operation not supported for brands" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });

  // Endpoint para actualizar el orden de promociones (drag and drop)
  // IMPORTANTE: Esta ruta debe ir ANTES de la ruta genérica /api/promotions/:id
  app.put("/api/promotions/reorder", async (req, res) => {
    console.log('🔄 PUT /api/promotions/reorder endpoint hit');
    console.log('🔄 Starting reorder request, body:', req.body);
    try {
      console.log('🔄 Reorder request received:', req.body);
      const { promotions: promotionOrders } = req.body; // Array de {id, sortOrder}
      
      if (!Array.isArray(promotionOrders)) {
        console.error('❌ Invalid promotions array:', promotionOrders);
        return res.status(400).json({ message: "promotions debe ser un array" });
      }

      console.log('✅ Processing', promotionOrders.length, 'promotion updates');

      // Actualizar cada promoción con su nuevo orden
      const updatePromises = promotionOrders.map(async ({ id, sortOrder }) => {
        console.log(`📦 Updating promotion ${id} to sortOrder ${sortOrder}`);
        const result = await storage.updatePromotion(id, { sortOrder });
        console.log(`${result ? '✅' : '❌'} Updated promotion ${id}:`, result?.name || 'not found');
        return result;
      });
      
      const results = await Promise.all(updatePromises);
      console.log('🎉 All updates completed successfully');
      
      res.json({ message: "Orden actualizado correctamente", updated: results.length });
    } catch (error) {
      console.error('❌ Error updating promotion order:', error);
      res.status(500).json({ message: "Failed to update promotion order", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // CRUD routes for Promotions
  app.post("/api/promotions", async (req, res) => {
    try {
      const promotionData = req.body;
      const promotion = await storage.createPromotion(promotionData);
      res.status(201).json(promotion);
    } catch (error) {
      res.status(500).json({ message: "Failed to create promotion" });
    }
  });

  app.put("/api/promotions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log(`🔄 Updating promotion ${id} with data:`, JSON.stringify(updateData, null, 2));
      
      const promotion = await storage.updatePromotion(id, updateData);
      if (!promotion) {
        console.error(`❌ Promotion ${id} not found`);
        return res.status(404).json({ message: "Promotion not found" });
      }
      
      console.log(`✅ Successfully updated promotion ${id}:`, promotion.name);
      
      // 🔄 Auto-sync: Actualizar automáticamente el código fuente
      autoSync.syncPromotionToSource(promotion).catch(error => {
        console.error('Error en auto-sync:', error);
      });
      
      res.json(promotion);
    } catch (error) {
      console.error('❌ Error updating promotion:', error);
      res.status(500).json({ 
        message: "Failed to update promotion", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.delete("/api/promotions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deletePromotion(id);
      if (!deleted) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete promotion" });
    }
  });


  // CRUD routes for Promotion Items
  app.post("/api/promotion-items", async (req, res) => {
    try {
      const itemData = req.body;
      const item = await storage.createPromotionItem(itemData);
      
      // 🔄 Auto-sync: Sincronizar nueva pieza al código fuente
      const promotion = await storage.getPromotionBySlug(itemData.promotionSlug || '');
      if (promotion) {
        autoSync.syncItemToSource(item, promotion.slug).catch(error => {
          console.error('Error en auto-sync de item:', error);
        });
      }
      
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to create promotion item" });
    }
  });

  app.put("/api/promotion-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const item = await storage.updatePromotionItem(id, updateData);
      if (!item) {
        return res.status(404).json({ message: "Promotion item not found" });
      }
      
      // 🔄 Auto-sync: Sincronizar cambios en la pieza al código fuente
      const promotion = await storage.getPromotionBySlug(updateData.promotionSlug || '');
      if (promotion) {
        autoSync.syncItemToSource(item, promotion.slug).catch(error => {
          console.error('Error en auto-sync de item:', error);
        });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update promotion item" });
    }
  });

  app.delete("/api/promotion-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // 🔄 Auto-sync: Sincronizar eliminación de pieza del código fuente
      autoSync.syncItemDeletionToSource(id, '').catch(error => {
        console.error('Error en auto-sync de eliminación:', error);
      });
      
      const deleted = await storage.deletePromotionItem(id);
      if (!deleted) {
        return res.status(404).json({ message: "Promotion item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete promotion item" });
    }
  });

  // Object Storage Routes
  
  // Serve public assets
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve private objects (for uploaded files)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Get upload URL for an object
  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Update promotion with uploaded images
  app.put("/api/promotions/:id/images", async (req, res) => {
    console.log('🔍 PUT /api/promotions/:id/images - ID:', req.params.id);
    console.log('🔍 Request body:', req.body);
    
    try {
      const { id } = req.params;
      const { imageUrls, imageType } = req.body; // imageType: 'wrapper' | 'promotion' | 'items'
      
      if (!imageUrls || !Array.isArray(imageUrls)) {
        console.error('❌ Invalid imageUrls:', imageUrls);
        return res.status(400).json({ error: "imageUrls must be an array" });
      }
      
      if (!imageType) {
        console.error('❌ Missing imageType:', imageType);
        return res.status(400).json({ error: "imageType is required" });
      }
      
      const objectStorageService = new ObjectStorageService();
      const normalizedUrls = imageUrls.map((url: string) => 
        objectStorageService.normalizeObjectEntityPath(url)
      );
      
      // Get current promotion to append to existing images
      const currentPromotion = await storage.getPromotionById(id);
      if (!currentPromotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      
      let updateData: any = {};
      
      if (imageType === 'wrapper') {
        const existingUrls = Array.isArray(currentPromotion.wrapperPhotosUrls) ? currentPromotion.wrapperPhotosUrls : [];
        updateData.wrapperPhotosUrls = [...existingUrls, ...normalizedUrls];
      } else if (imageType === 'promotion') {
        const existingUrls = Array.isArray(currentPromotion.promotionImagesUrls) ? currentPromotion.promotionImagesUrls : [];
        updateData.promotionImagesUrls = [...existingUrls, ...normalizedUrls];
      }
      
      const promotion = await storage.updatePromotion(id, updateData);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      
      res.json({ success: true, urls: normalizedUrls });
    } catch (error) {
      console.error("Error updating promotion images:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update promotion item with uploaded images
  app.put("/api/promotion-items/:id/images", async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrls } = req.body;
      
      const objectStorageService = new ObjectStorageService();
      const normalizedUrls = imageUrls.map((url: string) => 
        objectStorageService.normalizeObjectEntityPath(url)
      );
      
      // Get current item to append to existing images
      const currentItem = await storage.getPromotionItemById(id);
      if (!currentItem) {
        return res.status(404).json({ message: "Promotion item not found" });
      }
      
      const existingUrls = currentItem.imageUrls || [];
      const updatedUrls = [...existingUrls, ...normalizedUrls];
      
      const item = await storage.updatePromotionItem(id, { 
        imageUrls: updatedUrls
      });
      
      if (!item) {
        return res.status(404).json({ message: "Promotion item not found" });
      }
      
      res.json({ success: true, urls: updatedUrls });
    } catch (error) {
      console.error("Error updating item images:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Export all data endpoint (preview environment)
  app.get("/api/sync/export", async (req, res) => {
    try {
      console.log("📤 Exporting all data...");
      
      const [brands, allPromotions] = await Promise.all([
        storage.getAllBrands(),
        storage.getAllPromotions()
      ]);
      
      // Get all promotion items
      const allItems = [];
      for (const promotion of allPromotions) {
        const items = await storage.getPromotionItemsByPromotion(promotion.id);
        allItems.push(...items);
      }
      
      const exportData = {
        version: new Date().toISOString(),
        environment: process.env.REPLIT_ENV || 'development',
        brands,
        promotions: allPromotions,
        items: allItems,
        counts: {
          brands: brands.length,
          promotions: allPromotions.length, 
          items: allItems.length
        }
      };
      
      console.log(`✅ Export complete: ${exportData.counts.brands} brands, ${exportData.counts.promotions} promotions, ${exportData.counts.items} items`);
      res.json(exportData);
    } catch (error) {
      console.error("❌ Export error:", error);
      res.status(500).json({ error: "Export failed" });
    }
  });

  // Import data endpoint (deployment environment)  
  app.post("/api/sync/import", async (req, res) => {
    try {
      console.log("📥 Importing data...");
      
      const { brands, promotions, items } = req.body;
      
      if (!brands || !promotions || !items) {
        return res.status(400).json({ error: "Missing required data: brands, promotions, items" });
      }

      let stats = { brands: 0, promotions: 0, items: 0, updated: 0, created: 0 };

      // Import brands (upsert by slug)
      for (const brandData of brands) {
        const existing = await storage.getBrandBySlug(brandData.slug);
        if (existing) {
          await storage.updateBrand(existing.id, brandData);
          stats.updated++;
        } else {
          await storage.createBrand(brandData);
          stats.created++;
        }
        stats.brands++;
      }

      // Import promotions (upsert by slug)
      for (const promotionData of promotions) {
        const existing = await storage.getPromotionBySlug(promotionData.slug);
        if (existing) {
          await storage.updatePromotion(existing.id, promotionData);
          stats.updated++;
        } else {
          await storage.createPromotion(promotionData);
          stats.created++;
        }
        stats.promotions++;
      }

      // Import promotion items (upsert by id)
      for (const itemData of items) {
        const existing = await storage.getPromotionItemById(itemData.id);
        if (existing) {
          await storage.updatePromotionItem(itemData.id, itemData);
          stats.updated++;
        } else {
          await storage.createPromotionItem(itemData);
          stats.created++;
        }
        stats.items++;
      }

      console.log(`✅ Import complete: ${stats.brands} brands, ${stats.promotions} promotions, ${stats.items} items (${stats.created} created, ${stats.updated} updated)`);
      res.json({ success: true, stats });
    } catch (error) {
      console.error("❌ Import error:", error);
      res.status(500).json({ error: "Import failed" });
    }
  });

  // Full sync endpoint: Export from preview and import to deployment
  app.post("/api/sync/full", async (req, res) => {
    try {
      console.log("🔄 Starting full synchronization...");
      
      const { sourceUrl } = req.body;
      if (!sourceUrl) {
        return res.status(400).json({ error: "sourceUrl is required" });
      }
      
      // Fetch data from preview environment
      const response = await fetch(`${sourceUrl}/api/sync/export`);
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      const exportData = await response.json();
      
      // Import the data
      const importResponse = await fetch(`${req.protocol}://${req.get('host')}/api/sync/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportData)
      });
      
      if (!importResponse.ok) {
        throw new Error(`Import failed: ${importResponse.statusText}`);
      }
      
      const importResult = await importResponse.json();
      
      console.log("✅ Full synchronization completed");
      res.json({ 
        success: true, 
        source: exportData.environment,
        version: exportData.version,
        stats: importResult.stats
      });
      
    } catch (error: any) {
      console.error("❌ Full sync error:", error);
      res.status(500).json({ error: `Sync failed: ${error.message}` });
    }
  });

  // Migration endpoint: Move Vualá promotions before 2017 to Gamesa
  app.post("/api/migrate/vuala-to-gamesa", async (req, res) => {
    try {
      console.log("🚀 Starting Vualá to Gamesa migration...");
      
      // Get all brands to get their IDs
      const brands = await storage.getAllBrands();
      const gamesaBrand = brands.find(b => b.slug === 'gamesa');
      const vualaBrand = brands.find(b => b.slug === 'vuala');
      
      if (!gamesaBrand || !vualaBrand) {
        return res.status(404).json({ error: "Required brands not found" });
      }
      
      // Get all Vualá promotions
      const vualaPromotions = await storage.getPromotionsByBrand(vualaBrand.id);
      
      // Filter promotions before 2017
      const promotionsToMigrate = vualaPromotions.filter(p => p.startYear < 2017);
      
      console.log(`📋 Found ${promotionsToMigrate.length} Vualá promotions before 2017 to migrate to Gamesa`);
      
      let migratedCount = 0;
      for (const promotion of promotionsToMigrate) {
        await storage.updatePromotion(promotion.id, { brandId: gamesaBrand.id });
        migratedCount++;
        console.log(`✅ Migrated: ${promotion.name} (${promotion.startYear})`);
      }
      
      console.log(`🎉 Migration completed! Moved ${migratedCount} promotions from Vualá to Gamesa`);
      
      res.json({ 
        success: true, 
        migratedCount,
        promotions: promotionsToMigrate.map(p => ({ name: p.name, year: p.startYear }))
      });
    } catch (error) {
      console.error("❌ Migration error:", error);
      res.status(500).json({ error: "Migration failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

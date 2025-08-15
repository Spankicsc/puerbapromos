import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";

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
      const promotions = await storage.getPromotionsByBrandId(brand.id);
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
      const items = await storage.getPromotionItemsByPromotionId(promotion.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promotion items" });
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

  // Update promotion with uploaded images
  app.put("/api/promotions/:slug/images", async (req, res) => {
    if (!req.body.imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(
        req.body.imageUrl,
      );

      // Here you would update the promotion with the new image URL
      // For now, just return success
      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting promotion image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
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
      const deleted = await storage.deleteBrand(id);
      if (!deleted) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete brand" });
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
      const promotion = await storage.updatePromotion(id, updateData);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.json(promotion);
    } catch (error) {
      res.status(500).json({ message: "Failed to update promotion" });
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
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update promotion item" });
    }
  });

  app.delete("/api/promotion-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePromotionItem(id);
      if (!deleted) {
        return res.status(404).json({ message: "Promotion item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete promotion item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

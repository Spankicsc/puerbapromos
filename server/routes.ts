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

  const httpServer = createServer(app);
  return httpServer;
}

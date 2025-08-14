import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}

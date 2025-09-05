import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").notNull(),
  founded: integer("founded"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const promotions = pgTable("promotions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandId: varchar("brand_id").notNull().references(() => brands.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  wrapperPhotoUrl: text("wrapper_photo_url"),
  wrapperPhotosUrls: jsonb("wrapper_photos_urls").$type<string[] | null>(), // Multiple wrapper photos
  wrapperRotation: integer("wrapper_rotation").default(0), // Rotation in degrees
  wrapperScale: integer("wrapper_scale").default(100), // Scale percentage (100 = normal size)
  wrapperOffsetX: integer("wrapper_offset_x").default(0), // X position offset in pixels
  wrapperOffsetY: integer("wrapper_offset_y").default(0), // Y position offset in pixels
  promotionImagesUrls: jsonb("promotion_images_urls"),
  youtubeCommercialUrl: text("youtube_commercial_url"),
  buffetGamesVideoUrl: text("buffet_games_video_url"),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  category: text("category").notNull(), // main category: tazos, stickers, spinners, toys, etc.
  tags: jsonb("tags").$type<string[] | null>(), // additional tags/categories
  sortOrder: integer("sort_order").default(0), // Custom sort order for drag and drop
  createdAt: timestamp("created_at").defaultNow(),
});

export const promotionItems = pgTable("promotion_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  promotionId: varchar("promotion_id").notNull().references(() => promotions.id),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  imageUrls: jsonb("image_urls").$type<string[] | null>(), // Multiple images for items
  rarity: text("rarity"), // common, rare, super_rare, ultra_rare
  itemNumber: integer("item_number"),
  metadata: jsonb("metadata"), // additional properties specific to item type
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
  createdAt: true,
});

export const insertPromotionItemSchema = createInsertSchema(promotionItems).omit({
  id: true,
  createdAt: true,
});

export const updatePromotionItemSchema = createInsertSchema(promotionItems).omit({
  id: true,
  promotionId: true,
  createdAt: true,
}).partial();

export type Brand = typeof brands.$inferSelect;
export type Promotion = typeof promotions.$inferSelect;
export type PromotionItem = typeof promotionItems.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type InsertPromotionItem = z.infer<typeof insertPromotionItemSchema>;
export type UpdatePromotionItem = z.infer<typeof updatePromotionItemSchema>;

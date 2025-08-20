import type { Brand, Promotion, PromotionItem, InsertBrand, InsertPromotion, InsertPromotionItem } from "../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getBrand(id: string): Promise<Brand | null>;
  getBrandBySlug(slug: string): Promise<Brand | null>;
  getAllBrands(): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand | null>;
  deleteBrand(id: string): Promise<boolean>;

  getPromotion(id: string): Promise<Promotion | null>;
  getPromotionBySlug(slug: string): Promise<Promotion | null>;
  getAllPromotions(): Promise<Promotion[]>;
  getPromotionsByBrandId(brandId: string): Promise<Promotion[]>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  updatePromotion(id: string, updates: Partial<InsertPromotion>): Promise<Promotion | null>;
  deletePromotion(id: string): Promise<boolean>;

  getPromotionItem(id: string): Promise<PromotionItem | null>;
  getPromotionItemsByPromotionId(promotionId: string): Promise<PromotionItem[]>;
  createPromotionItem(item: InsertPromotionItem): Promise<PromotionItem>;
  updatePromotionItem(id: string, updates: Partial<InsertPromotionItem>): Promise<PromotionItem | null>;
  deletePromotionItem(id: string): Promise<boolean>;

  searchPromotions(query: string): Promise<Promotion[]>;
  searchItems(query: string): Promise<PromotionItem[]>;
}

export class MemStorage implements IStorage {
  private brands: Map<string, Brand> = new Map();
  private promotions: Map<string, Promotion> = new Map();
  private promotionItems: Map<string, PromotionItem> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed authentic Mexican promotional data
    const sabritas: Brand = {
      id: randomUUID(),
      name: "Sabritas",
      slug: "sabritas",
      description: "La marca líder en botanas saladas de México, conocida por sus icónicas promociones de Tazos y coleccionables.",
      logoUrl: "/attached_assets/sabritas-37258_1755143611549.png",
      primaryColor: "#E31E24",
      founded: 1943,
      createdAt: new Date(),
    };
    this.brands.set(sabritas.id, sabritas);

    const gamesa: Brand = {
      id: randomUUID(),
      name: "Gamesa",
      slug: "gamesa",
      description: "Empresa mexicana de galletas y productos de panadería con una rica tradición en promocionales.",
      logoUrl: "/attached_assets/Gamesa2008_1755143611550.webp",
      primaryColor: "#2E5C9A",
      founded: 1921,
      createdAt: new Date(),
    };
    this.brands.set(gamesa.id, gamesa);

    const barcel: Brand = {
      id: randomUUID(),
      name: "Barcel",
      slug: "barcel",
      description: "Marca mexicana famosa por sus dulces, chicles y los legendarios Funki Punky stickers.",
      logoUrl: "/attached_assets/Barcel_1755143611550.png",
      primaryColor: "#00B04F",
      founded: 1950,
      createdAt: new Date(),
    };
    this.brands.set(barcel.id, barcel);

    const bimbo: Brand = {
      id: randomUUID(),
      name: "Bimbo",
      slug: "bimbo",
      description: "La panificadora más grande de México, reconocida por sus promocionales de figuras y juguetes.",
      logoUrl: "/attached_assets/bimbo_1755143611551.png",
      primaryColor: "#FFD700",
      founded: 1945,
      createdAt: new Date(),
    };
    this.brands.set(bimbo.id, bimbo);

    // Sample promotions
    const spiderman3: Promotion = {
      id: "a98e7021-f55f-4af2-81c6-92f9e990d308",
      brandId: sabritas.id,
      name: "Spiderman 3",
      slug: "spiderman-3-2007",
      description: "Promoción épica de Sabritas con tazos coleccionables de Spider-Man 3. Incluye tazos dorados especiales y figuras exclusivas del hombre araña.",
      imageUrl: "/attached_assets/spiderman3_hero_1755143611552.jpg",
      startYear: 2007,
      endYear: 2007,
      category: "tazos",
      tags: ["superhéroes", "marvel", "cine", "coleccionables"],
      wrapperPhotoUrl: "/attached_assets/spiderman3_wrapper_1755143611553.jpg",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Vainilla frontal spiderman 3_1755152265577_rotated.png",
        "/attached_assets/rotated/Chocolate frontal spiderman 3_1755196507572_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      buffetGamesVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(spiderman3.id, spiderman3);

    const chocoshok_punki_punky: Promotion = {
      id: randomUUID(),
      brandId: gamesa.id,
      name: "ChocoShok Punki Punky",
      slug: "chocoshok-punki-punky",
      description: "Promoción especial de ChocoShok con elementos de Punki Punky incluidos.",
      imageUrl: null,
      startYear: 2010,
      endYear: 2011,
      category: "stickers",
      tags: null,
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/vainilla funki punky extremo_1755152265578_rotated.png",
        "/attached_assets/rotated/Cajeta funki punky extremo_1755150784762_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: "https://www.youtube.com/watch?v=7whH2AUpW0I&t=3726s",
      buffetGamesVideoUrl: "https://www.youtube.com/watch?v=7whH2AUpW0I&t=3726s",
      wrapperRotation: 270,
      createdAt: new Date(),
    };
    this.promotions.set(chocoshok_punki_punky.id, chocoshok_punki_punky);

    const chocoshok_gormiti: Promotion = {
      id: randomUUID(),
      brandId: gamesa.id,
      name: "ChocoShok Gormiti",
      slug: "chocoshok-gormiti",
      description: "Promoción de ChocoShok with figuras coleccionables de Gormiti, los guardianes de los elementos.",
      imageUrl: null,
      startYear: 2010,
      endYear: 2012,
      category: "figuras",
      tags: null,
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/IMG_4298-removebg-preview_1755219298608_rotated.png",
        "/attached_assets/rotated/IMG_4299-removebg-preview_1755219298608_rotated.png",
        "/attached_assets/rotated/IMG_4300-removebg-preview_1755219298608_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: "https://www.youtube.com/watch?v=7whH2AUpW0I&t=3726s",
      buffetGamesVideoUrl: "https://www.youtube.com/watch?v=7whH2AUpW0I&t=3726s",
      wrapperRotation: 270,
      createdAt: new Date(),
    };
    this.promotions.set(chocoshok_gormiti.id, chocoshok_gormiti);
  }

  // Brand methods
  async getBrand(id: string): Promise<Brand | null> {
    return this.brands.get(id) || null;
  }

  async getBrandBySlug(slug: string): Promise<Brand | null> {
    for (const brand of this.brands.values()) {
      if (brand.slug === slug) {
        return brand;
      }
    }
    return null;
  }

  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const newBrand: Brand = {
      id: randomUUID(),
      ...brand,
      createdAt: new Date(),
    };
    this.brands.set(newBrand.id, newBrand);
    return newBrand;
  }

  async updateBrand(id: string, updates: Partial<InsertBrand>): Promise<Brand | null> {
    const brand = this.brands.get(id);
    if (!brand) return null;

    const updatedBrand = { ...brand, ...updates };
    this.brands.set(id, updatedBrand);
    return updatedBrand;
  }

  async deleteBrand(id: string): Promise<boolean> {
    return this.brands.delete(id);
  }

  // Promotion methods
  async getPromotion(id: string): Promise<Promotion | null> {
    return this.promotions.get(id) || null;
  }

  async getPromotionBySlug(slug: string): Promise<Promotion | null> {
    for (const promotion of this.promotions.values()) {
      if (promotion.slug === slug) {
        return promotion;
      }
    }
    return null;
  }

  async getAllPromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values());
  }

  async getPromotionsByBrandId(brandId: string): Promise<Promotion[]> {
    return Array.from(this.promotions.values()).filter(p => p.brandId === brandId);
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const newPromotion: Promotion = {
      id: randomUUID(),
      ...promotion,
      createdAt: new Date(),
    };
    this.promotions.set(newPromotion.id, newPromotion);
    return newPromotion;
  }

  async updatePromotion(id: string, updates: Partial<InsertPromotion>): Promise<Promotion | null> {
    const promotion = this.promotions.get(id);
    if (!promotion) return null;

    const updatedPromotion = { ...promotion, ...updates };
    this.promotions.set(id, updatedPromotion);
    return updatedPromotion;
  }

  async deletePromotion(id: string): Promise<boolean> {
    // Also delete associated items
    for (const [itemId, item] of this.promotionItems.entries()) {
      if (item.promotionId === id) {
        this.promotionItems.delete(itemId);
      }
    }
    return this.promotions.delete(id);
  }

  // Promotion Item methods
  async getPromotionItem(id: string): Promise<PromotionItem | null> {
    return this.promotionItems.get(id) || null;
  }

  async getPromotionItemsByPromotionId(promotionId: string): Promise<PromotionItem[]> {
    return Array.from(this.promotionItems.values()).filter(item => item.promotionId === promotionId);
  }

  async createPromotionItem(item: InsertPromotionItem): Promise<PromotionItem> {
    const newItem: PromotionItem = {
      id: randomUUID(),
      ...item,
      createdAt: new Date(),
    };
    this.promotionItems.set(newItem.id, newItem);
    return newItem;
  }

  async updatePromotionItem(id: string, updates: Partial<InsertPromotionItem>): Promise<PromotionItem | null> {
    const item = this.promotionItems.get(id);
    if (!item) return null;

    const updatedItem = { ...item, ...updates };
    this.promotionItems.set(id, updatedItem);
    return updatedItem;
  }

  async deletePromotionItem(id: string): Promise<boolean> {
    return this.promotionItems.delete(id);
  }

  // Search methods
  async searchPromotions(query: string): Promise<Promotion[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.promotions.values()).filter(promotion =>
      promotion.name.toLowerCase().includes(lowerQuery) ||
      promotion.description.toLowerCase().includes(lowerQuery) ||
      promotion.category.toLowerCase().includes(lowerQuery) ||
      (promotion.tags && promotion.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }

  async searchItems(query: string): Promise<PromotionItem[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.promotionItems.values()).filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
  }
}

export const storage = new MemStorage();
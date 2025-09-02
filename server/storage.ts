import { randomUUID } from "crypto";
import { Brand, Promotion, PromotionItem } from "../shared/schema.js";

export interface IStorage {
  // Brand methods
  getAllBrands(): Promise<Brand[]>;
  getBrandBySlug(slug: string): Promise<Brand | null>;
  createBrand(data: Omit<Brand, 'id' | 'createdAt'>): Promise<Brand>;
  updateBrand(id: string, data: Partial<Brand>): Promise<Brand | null>;

  // Promotion methods
  getAllPromotions(): Promise<Promotion[]>;
  getPromotionBySlug(slug: string): Promise<Promotion | null>;
  getPromotionsByBrand(brandId: string): Promise<Promotion[]>;
  createPromotion(data: Omit<Promotion, 'id' | 'createdAt'>): Promise<Promotion>;
  updatePromotion(id: string, data: Partial<Promotion>): Promise<Promotion | null>;

  // Promotion Item methods
  getPromotionItemsByPromotion(promotionId: string): Promise<PromotionItem[]>;
  createPromotionItem(data: Omit<PromotionItem, 'id' | 'createdAt'>): Promise<PromotionItem>;
  updatePromotionItem(id: string, data: Partial<PromotionItem>): Promise<PromotionItem | null>;
  deletePromotionItem(id: string): Promise<boolean>;

  // Search methods
  searchPromotions(query: string): Promise<Promotion[]>;
  searchItems(query: string): Promise<PromotionItem[]>;
}

export class MemStorage implements IStorage {
  private brands = new Map<string, Brand>();
  private promotions = new Map<string, Promotion>();
  private promotionItems = new Map<string, PromotionItem[]>();

  constructor() {
    this.seed();
  }

  private seed() {
    // Create brands
    const sabritas: Brand = {
      id: randomUUID(),
      name: "Sabritas",
      slug: "sabritas", 
      description: "La marca líder de frituras y botanas en México, famosa por sus promociones de tazos coleccionables.",
      logoUrl: "/attached_assets/Sabritas-Logo-Vector.svg-_1755143611550.png",
      primaryColor: "#FFD700",
      founded: 1943,
      createdAt: new Date(),
    };
    this.brands.set(sabritas.id, sabritas);

    const gamesa: Brand = {
      id: randomUUID(),
      name: "Gamesa",
      slug: "gamesa",
      description: "Reconocida marca mexicana de galletas y productos horneados, con más de 100 años de tradición.",
      logoUrl: "/attached_assets/Gamesa-Logo-Vector.svg-_1755143611550.png",
      primaryColor: "#D2691E",
      founded: 1921,
      createdAt: new Date(),
    };
    this.brands.set(gamesa.id, gamesa);

    const marinela: Brand = {
      id: randomUUID(),
      name: "Marinela",
      slug: "marinela",
      description: "Reconocida marca mexicana de panecillos y repostería, parte del Grupo Bimbo.",
      logoUrl: "/attached_assets/Marinela-Logo-Vector.svg-_1755143611550.png",
      primaryColor: "#FF1744",
      founded: 1954,
      createdAt: new Date(),
    };
    this.brands.set(marinela.id, marinela);

    // Create sample promotions
    const spiderman3: Promotion = {
      id: randomUUID(),
      brandId: sabritas.id,
      name: "Spiderman 3",
      slug: "spiderman-3-2007",
      description: "Promoción épica de Sabritas con tazos coleccionables de Spider-Man 3. Incluye tazos dorados especiales y figuras exclusivas del hombre araña.",
      imageUrl: null,
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: null,
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2007,
      endYear: 2007,
      category: "tazos",
      tags: ["spiderman", "marvel", "tazos", "coleccionables"],
      createdAt: new Date(),
    };
    this.promotions.set(spiderman3.id, spiderman3);

    const chocoshokGormiti: Promotion = {
      id: randomUUID(),
      brandId: sabritas.id,
      name: "Chocoshok Gormiti",
      slug: "chocoshok-gormiti-2009",
      description: "Espectacular promoción de Chocoshok con figuras de Gormiti. Los Señores de la Naturaleza llegan con increíbles personajes coleccionables.",
      imageUrl: null,
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: null,
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2009,
      endYear: 2009,
      category: "figuras",
      tags: ["gormiti", "figuras", "naturaleza", "coleccionables"],
      createdAt: new Date(),
    };
    this.promotions.set(chocoshokGormiti.id, chocoshokGormiti);
  }

  // Brand methods
  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrandBySlug(slug: string): Promise<Brand | null> {
    const brands = Array.from(this.brands.values());
    return brands.find(brand => brand.slug === slug) || null;
  }

  async createBrand(data: Omit<Brand, 'id' | 'createdAt'>): Promise<Brand> {
    const brand: Brand = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.brands.set(brand.id, brand);
    return brand;
  }

  async updateBrand(id: string, data: Partial<Brand>): Promise<Brand | null> {
    const brand = this.brands.get(id);
    if (!brand) return null;
    
    const updatedBrand = { ...brand, ...data };
    this.brands.set(id, updatedBrand);
    return updatedBrand;
  }

  // Promotion methods
  async getAllPromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values());
  }

  async getPromotionBySlug(slug: string): Promise<Promotion | null> {
    const promotions = Array.from(this.promotions.values());
    return promotions.find(promotion => promotion.slug === slug) || null;
  }

  async getPromotionsByBrand(brandId: string): Promise<Promotion[]> {
    return Array.from(this.promotions.values()).filter(p => p.brandId === brandId);
  }

  async createPromotion(data: Omit<Promotion, 'id' | 'createdAt'>): Promise<Promotion> {
    const promotion: Promotion = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.promotions.set(promotion.id, promotion);
    return promotion;
  }

  async updatePromotion(id: string, data: Partial<Promotion>): Promise<Promotion | null> {
    const promotion = this.promotions.get(id);
    if (!promotion) return null;
    
    const updatedPromotion = { ...promotion, ...data };
    this.promotions.set(id, updatedPromotion);
    return updatedPromotion;
  }

  // Promotion Item methods
  async getPromotionItemsByPromotion(promotionId: string): Promise<PromotionItem[]> {
    return this.promotionItems.get(promotionId) || [];
  }

  async createPromotionItem(data: Omit<PromotionItem, 'id' | 'createdAt'>): Promise<PromotionItem> {
    const item: PromotionItem = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    
    const items = this.promotionItems.get(data.promotionId) || [];
    items.push(item);
    this.promotionItems.set(data.promotionId, items);
    
    return item;
  }

  async updatePromotionItem(id: string, data: Partial<PromotionItem>): Promise<PromotionItem | null> {
    for (const [promotionId, items] of this.promotionItems.entries()) {
      const itemIndex = items.findIndex((item: PromotionItem) => item.id === id);
      if (itemIndex !== -1) {
        const updatedItem = { ...items[itemIndex], ...data };
        items[itemIndex] = updatedItem;
        this.promotionItems.set(promotionId, items);
        return updatedItem;
      }
    }
    return null;
  }

  async deletePromotionItem(id: string): Promise<boolean> {
    for (const [promotionId, items] of Array.from(this.promotionItems.entries())) {
      const itemIndex = items.findIndex((item: PromotionItem) => item.id === id);
      if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
        this.promotionItems.set(promotionId, items);
        return true;
      }
    }
    return false;
  }

  // Search methods
  async searchPromotions(query: string): Promise<Promotion[]> {
    const promotions = Array.from(this.promotions.values());
    const lowercaseQuery = query.toLowerCase();
    
    return promotions.filter(promotion => 
      promotion.name.toLowerCase().includes(lowercaseQuery) ||
      promotion.description.toLowerCase().includes(lowercaseQuery) ||
      promotion.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async searchItems(query: string): Promise<PromotionItem[]> {
    const allItems: PromotionItem[] = [];
    for (const items of Array.from(this.promotionItems.values())) {
      allItems.push(...items);
    }
    
    const lowercaseQuery = query.toLowerCase();
    return allItems.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      (item.description && item.description.toLowerCase().includes(lowercaseQuery))
    );
  }
}

// Export a singleton instance
export const storage = new MemStorage();
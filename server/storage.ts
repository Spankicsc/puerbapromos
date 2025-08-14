import { type Brand, type Promotion, type PromotionItem, type InsertBrand, type InsertPromotion, type InsertPromotionItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Brands
  getBrand(id: string): Promise<Brand | undefined>;
  getBrandBySlug(slug: string): Promise<Brand | undefined>;
  getAllBrands(): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  
  // Promotions
  getPromotion(id: string): Promise<Promotion | undefined>;
  getPromotionBySlug(slug: string): Promise<Promotion | undefined>;
  getPromotionsByBrandId(brandId: string): Promise<Promotion[]>;
  getAllPromotions(): Promise<Promotion[]>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  
  // Promotion Items
  getPromotionItem(id: string): Promise<PromotionItem | undefined>;
  getPromotionItemsByPromotionId(promotionId: string): Promise<PromotionItem[]>;
  createPromotionItem(item: InsertPromotionItem): Promise<PromotionItem>;
  
  // Search
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
      logoUrl: null,
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
      logoUrl: null,
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
      logoUrl: null,
      primaryColor: "#00B04F",
      founded: 1950,
      createdAt: new Date(),
    };
    this.brands.set(barcel.id, barcel);

    const bimbo: Brand = {
      id: randomUUID(),
      name: "Bimbo",
      slug: "bimbo",
      description: "La panificadora más grande de México, conocida por sus promociones familiares y coleccionables.",
      logoUrl: null,
      primaryColor: "#FFD700",
      founded: 1945,
      createdAt: new Date(),
    };
    this.brands.set(bimbo.id, bimbo);

    const marinela: Brand = {
      id: randomUUID(),
      name: "Marinela",
      slug: "marinela",
      description: "Marca de productos de repostería del Grupo Bimbo, famosa por sus promociones con juguetes.",
      logoUrl: null,
      primaryColor: "#FF6B9D",
      founded: 1956,
      createdAt: new Date(),
    };
    this.brands.set(marinela.id, marinela);

    const vuala: Brand = {
      id: randomUUID(),
      name: "Vualá",
      slug: "vuala",
      description: "Marca de helados mexicana conocida por sus promociones con figuras y coleccionables.",
      logoUrl: null,
      primaryColor: "#8B5CF6",
      founded: 1990,
      createdAt: new Date(),
    };
    this.brands.set(vuala.id, vuala);

    // Seed promotions
    const tazos: Promotion = {
      id: randomUUID(),
      brandId: sabritas.id,
      name: "Tazos",
      slug: "tazos",
      description: "Los coleccionables más icónicos de México. Discos de cartón con personajes de Dragon Ball Z, Pokémon, Looney Tunes y más series populares.",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      startYear: 1994,
      endYear: 2010,
      category: "tazos",
      createdAt: new Date(),
    };
    this.promotions.set(tazos.id, tazos);

    const spinners: Promotion = {
      id: randomUUID(),
      brandId: sabritas.id,
      name: "Spinners Chokas",
      slug: "spinners-chokas",
      description: "La fiebre mundial de los fidget spinners llegó a México con estos increíbles spinners promocionales que causaron furor.",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      startYear: 2017,
      endYear: 2018,
      category: "spinners",
      createdAt: new Date(),
    };
    this.promotions.set(spinners.id, spinners);

    const funkiPunky: Promotion = {
      id: randomUUID(),
      brandId: barcel.id,
      name: "Funki Punky",
      slug: "funki-punky",
      description: "Stickers con personajes rebeldes y actitud punk que se convirtieron en objetos de culto entre los coleccionistas mexicanos.",
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      startYear: 1998,
      endYear: 2005,
      category: "stickers",
      createdAt: new Date(),
    };
    this.promotions.set(funkiPunky.id, funkiPunky);

    const bubulubu: Promotion = {
      id: randomUUID(),
      brandId: barcel.id,
      name: "Bubulubu Stickers",
      slug: "bubulubu-stickers",
      description: "Colección de stickers que venían con los chocolates Bubulubu, featuring personajes originales y diseños únicos.",
      imageUrl: "https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      startYear: 2000,
      endYear: 2008,
      category: "stickers",
      createdAt: new Date(),
    };
    this.promotions.set(bubulubu.id, bubulubu);

    // Seed some promotion items
    const tazoItem1: PromotionItem = {
      id: randomUUID(),
      promotionId: tazos.id,
      name: "Goku Super Saiyan",
      description: "Tazo holográfico de Goku en su transformación Super Saiyan de Dragon Ball Z",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      rarity: "super_rare",
      itemNumber: 1,
      metadata: { series: "Dragon Ball Z", character: "Goku", holographic: true },
      createdAt: new Date(),
    };
    this.promotionItems.set(tazoItem1.id, tazoItem1);

    const spinnerItem1: PromotionItem = {
      id: randomUUID(),
      promotionId: spinners.id,
      name: "Spinner Dorado",
      description: "Spinner metálico dorado con diseño exclusivo de Sabritas",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      rarity: "rare",
      itemNumber: 1,
      metadata: { material: "metal", color: "gold", weight: "50g" },
      createdAt: new Date(),
    };
    this.promotionItems.set(spinnerItem1.id, spinnerItem1);
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    return Array.from(this.brands.values()).find(brand => brand.slug === slug);
  }

  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    const brand: Brand = { 
      ...insertBrand, 
      id, 
      logoUrl: insertBrand.logoUrl ?? null,
      founded: insertBrand.founded ?? null,
      createdAt: new Date() 
    };
    this.brands.set(id, brand);
    return brand;
  }

  async getPromotion(id: string): Promise<Promotion | undefined> {
    return this.promotions.get(id);
  }

  async getPromotionBySlug(slug: string): Promise<Promotion | undefined> {
    return Array.from(this.promotions.values()).find(promotion => promotion.slug === slug);
  }

  async getPromotionsByBrandId(brandId: string): Promise<Promotion[]> {
    return Array.from(this.promotions.values()).filter(promotion => promotion.brandId === brandId);
  }

  async getAllPromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values());
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const id = randomUUID();
    const promotion: Promotion = { 
      ...insertPromotion, 
      id, 
      imageUrl: insertPromotion.imageUrl ?? null,
      endYear: insertPromotion.endYear ?? null,
      createdAt: new Date() 
    };
    this.promotions.set(id, promotion);
    return promotion;
  }

  async getPromotionItem(id: string): Promise<PromotionItem | undefined> {
    return this.promotionItems.get(id);
  }

  async getPromotionItemsByPromotionId(promotionId: string): Promise<PromotionItem[]> {
    return Array.from(this.promotionItems.values()).filter(item => item.promotionId === promotionId);
  }

  async createPromotionItem(insertItem: InsertPromotionItem): Promise<PromotionItem> {
    const id = randomUUID();
    const item: PromotionItem = { 
      ...insertItem, 
      id, 
      description: insertItem.description ?? null,
      imageUrl: insertItem.imageUrl ?? null,
      rarity: insertItem.rarity ?? null,
      itemNumber: insertItem.itemNumber ?? null,
      metadata: insertItem.metadata ?? null,
      createdAt: new Date() 
    };
    this.promotionItems.set(id, item);
    return item;
  }

  async searchPromotions(query: string): Promise<Promotion[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.promotions.values()).filter(promotion =>
      promotion.name.toLowerCase().includes(lowercaseQuery) ||
      promotion.description.toLowerCase().includes(lowercaseQuery) ||
      promotion.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  async searchItems(query: string): Promise<PromotionItem[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.promotionItems.values()).filter(item =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      (item.description?.toLowerCase().includes(lowercaseQuery) ?? false)
    );
  }
}

export const storage = new MemStorage();

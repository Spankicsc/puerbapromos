import { randomUUID } from "crypto";
import { Brand, Promotion, PromotionItem, brands, promotions, promotionItems } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, like, or, sql } from "drizzle-orm";

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
  deletePromotion(id: string): Promise<boolean>;

  // Promotion Item methods
  getPromotionItemsByPromotion(promotionId: string): Promise<PromotionItem[]>;
  createPromotionItem(data: Omit<PromotionItem, 'id' | 'createdAt'>): Promise<PromotionItem>;
  updatePromotionItem(id: string, data: Partial<PromotionItem>): Promise<PromotionItem | null>;
  deletePromotionItem(id: string): Promise<boolean>;

  // Search methods
  searchPromotions(query: string): Promise<Promotion[]>;
  searchItems(query: string): Promise<PromotionItem[]>;
}

export class DatabaseStorage implements IStorage {
  private isSeeded = false;

  private async ensureSeeded() {
    if (this.isSeeded) return;
    
    try {
      // Directly query brands without calling ensureSeeded
      const existingBrands = await db.select().from(brands);
      console.log(`🔍 Revisando base de datos: ${existingBrands.length} marcas encontradas`);
      
      if (existingBrands.length === 0) {
        console.log('📦 Base de datos vacía, FORZANDO seeding en producción...');
        await this.seedDatabase();
        
        // Verificar que el seeding fue exitoso
        const newBrands = await db.select().from(brands);
        const newPromotions = await db.select().from(promotions);
        console.log(`✅ Seeding completado: ${newBrands.length} marcas, ${newPromotions.length} promociones`);
      } else {
        console.log(`✅ Base de datos ya tiene ${existingBrands.length} marcas`);
      }
      this.isSeeded = true;
    } catch (error) {
      console.error('❌ Error en seeding:', error);
      // En caso de error, intentar de nuevo en la próxima llamada
      this.isSeeded = false;
      throw error;
    }
  }

  // Brand methods
  async getAllBrands(): Promise<Brand[]> {
    await this.ensureSeeded();
    return await db.select().from(brands);
  }

  async getBrandBySlug(slug: string): Promise<Brand | null> {
    const [brand] = await db.select().from(brands).where(eq(brands.slug, slug));
    return brand || null;
  }

  async createBrand(data: Omit<Brand, 'id' | 'createdAt'>): Promise<Brand> {
    const [brand] = await db.insert(brands).values(data).returning();
    return brand;
  }

  async updateBrand(id: string, data: Partial<Brand>): Promise<Brand | null> {
    const [brand] = await db.update(brands).set(data).where(eq(brands.id, id)).returning();
    return brand || null;
  }

  // Promotion methods
  async getAllPromotions(): Promise<Promotion[]> {
    await this.ensureSeeded();
    return await db.select().from(promotions);
  }

  async getPromotionBySlug(slug: string): Promise<Promotion | null> {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.slug, slug));
    return promotion || null;
  }

  async getPromotionsByBrand(brandId: string): Promise<Promotion[]> {
    return await db.select().from(promotions).where(eq(promotions.brandId, brandId));
  }

  async createPromotion(data: Omit<Promotion, 'id' | 'createdAt'>): Promise<Promotion> {
    const [promotion] = await db.insert(promotions).values(data).returning();
    return promotion;
  }

  async updatePromotion(id: string, data: Partial<Promotion>): Promise<Promotion | null> {
    try {
      console.log(`📝 Storage: Updating promotion ${id} with data:`, data);
      const [promotion] = await db.update(promotions).set(data).where(eq(promotions.id, id)).returning();
      if (promotion) {
        console.log(`✅ Storage: Successfully updated promotion ${id}:`, promotion.name);
      } else {
        console.log(`⚠️ Storage: No promotion found with id ${id}`);
      }
      return promotion || null;
    } catch (error) {
      console.error(`❌ Storage: Error updating promotion ${id}:`, error);
      throw error;
    }
  }

  async deletePromotion(id: string): Promise<boolean> {
    const result = await db.delete(promotions).where(eq(promotions.id, id));
    return (result as any).rowCount > 0;
  }

  // Promotion Item methods
  async getPromotionItemsByPromotion(promotionId: string): Promise<PromotionItem[]> {
    return await db.select().from(promotionItems).where(eq(promotionItems.promotionId, promotionId));
  }

  async createPromotionItem(data: Omit<PromotionItem, 'id' | 'createdAt'>): Promise<PromotionItem> {
    const [item] = await db.insert(promotionItems).values(data).returning();
    return item;
  }

  async updatePromotionItem(id: string, data: Partial<PromotionItem>): Promise<PromotionItem | null> {
    const [item] = await db.update(promotionItems).set(data).where(eq(promotionItems.id, id)).returning();
    return item || null;
  }

  async deletePromotionItem(id: string): Promise<boolean> {
    const result = await db.delete(promotionItems).where(eq(promotionItems.id, id));
    return (result as any).rowCount > 0;
  }

  // Search methods
  async searchPromotions(query: string): Promise<Promotion[]> {
    const lowercaseQuery = `%${query.toLowerCase()}%`;
    return await db.select().from(promotions).where(
      or(
        like(sql`lower(${promotions.name})`, lowercaseQuery),
        like(sql`lower(${promotions.description})`, lowercaseQuery)
      )
    );
  }

  async searchItems(query: string): Promise<PromotionItem[]> {
    const lowercaseQuery = `%${query.toLowerCase()}%`;
    return await db.select().from(promotionItems).where(
      or(
        like(sql`lower(${promotionItems.name})`, lowercaseQuery),
        like(sql`lower(${promotionItems.description})`, lowercaseQuery)
      )
    );
  }

  private async seedDatabase() {
    // Create brands
    const sabritas = await this.createBrand({
      name: "Sabritas",
      slug: "sabritas", 
      description: "La marca líder de frituras y botanas en México, famosa por sus promociones de tazos coleccionables.",
      logoUrl: "/attached_assets/sabritas-37258_1755143611549.png",
      primaryColor: "#FFD700",
      founded: 1943,
    });

    const gamesa = await this.createBrand({
      name: "Gamesa",
      slug: "gamesa",
      description: "Reconocida marca mexicana de galletas y productos horneados, con más de 100 años de tradición.",
      logoUrl: "/attached_assets/Gamesa2008_1755143611550.webp",
      primaryColor: "#D2691E",
      founded: 1921,
    });

    const marinela = await this.createBrand({
      name: "Marinela",
      slug: "marinela",
      description: "Reconocida marca mexicana de panecillos y repostería, parte del Grupo Bimbo.",
      logoUrl: "/attached_assets/Marinela-Logo-Vector.svg-_1755143611550.png",
      primaryColor: "#FF1744",
      founded: 1954,
    });

    const bimbo = await this.createBrand({
      name: "Bimbo",
      slug: "bimbo",
      description: "Grupo Bimbo, la empresa de panificación más grande del mundo.",
      logoUrl: "/attached_assets/Logo_Bimbo_2000_1755143611549.png",
      primaryColor: "#F57C00",
      founded: 1945,
    });

    const barcel = await this.createBrand({
      name: "Barcel",
      slug: "barcel",
      description: "Marca mexicana de dulces y confitería, conocida por productos como Lunetas y Takis.",
      logoUrl: "/attached_assets/Barcel_1755143611550.png",
      primaryColor: "#4CAF50",
      founded: 1978,
    });

    const ricolino = await this.createBrand({
      name: "Ricolino",
      slug: "ricolino",
      description: "Reconocida marca mexicana de dulces y chocolates, famosa por Kranky, Bubulubu y Duvalin.",
      logoUrl: null,
      primaryColor: "#8B5CF6",
      founded: 1950,
    });

    const vuala = await this.createBrand({
      name: "Vualá",
      slug: "vuala",
      description: "Marca mexicana de croissants y panecillos dulces, conocida por sus sabores únicos y promociones coleccionables.",
      logoUrl: "/attached_assets/Vuala_1755143611550.png",
      primaryColor: "#F59E0B",
      founded: 2002,
    });

    // Create some sample promotions
    await this.createPromotion({
      brandId: sabritas.id,
      name: "Spiderman 3",
      slug: "spiderman-3-2007",
      description: "Promoción épica de Sabritas con tazos coleccionables de Spider-Man 3. Incluye tazos dorados especiales y figuras exclusivas del hombre araña.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/rotated/Vainilla  frontal spiderman 3_1755219753445_rotated.png",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Vainilla  frontal spiderman 3_1755219753445_rotated.png",
        "/attached_assets/rotated/Chocolate frontal spiderman 3_1755196507572_rotated.png"
      ],
      wrapperRotation: 90,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2007,
      endYear: 2007,
      category: "tazos",
      tags: ["spiderman", "marvel", "tazos", "coleccionables"],
      sortOrder: 0,
      wrapperScale: 100,
      wrapperOffsetX: 0,
      wrapperOffsetY: 0,
    });

    await this.createPromotion({
      brandId: vuala.id,
      name: "The Dog 2004",
      slug: "the-dog-2004",
      description: "Promoción kawaii con lindos perritos de diferentes razas. Colecciona todos los cachorros de The Dog.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/rotated/The dog 2004 vainilla frontal_1755219753444_rotated.png",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/The dog 2004 vainilla frontal_1755219753444_rotated.png",
        "/attached_assets/rotated/IMG_4257-removebg-preview_1755219298607_rotated.png",
        "/attached_assets/rotated/IMG_4269-removebg-preview_1755219298608_rotated.png"
      ],
      wrapperRotation: 90,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2004,
      endYear: 2004,
      category: "Mini Colgantes",
      tags: ["the-dog", "kawaii", "perritos", "razas", "mini-colgantes"],
      sortOrder: 0,
      wrapperScale: 100,
      wrapperOffsetX: 0,
      wrapperOffsetY: 0,
    });

    await this.createPromotion({
      brandId: vuala.id,
      name: "Angry Birds Go",
      slug: "angry-birds-go",
      description: "Emocionante promoción de Vualá con personajes de Angry Birds Go. Colecciona todos los pájaros y cerditos en carreras.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/rotated/vainilla angry birds GO_1755219753445_rotated.png",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/vainilla angry birds GO_1755219753445_rotated.png",
        "/attached_assets/rotated/Cajeta angry birds Go_1755196507570_rotated.png",
        "/attached_assets/rotated/Chocolate angry birds Go_1755196507571_rotated.png"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2014,
      endYear: 2014,
      category: "figuras",
      tags: ["angry-birds", "videojuegos", "figuras", "coleccionables"],
      sortOrder: 0,
      wrapperScale: 100,
      wrapperOffsetX: 0,
      wrapperOffsetY: 0,
    });
  }
}

// Export a singleton instance - using DatabaseStorage to persist data
export const storage = new DatabaseStorage();
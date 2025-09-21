import { randomUUID } from "crypto";
import { Brand, Promotion, PromotionItem, brands, promotions, promotionItems } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, like, or, sql } from "drizzle-orm";
import { createAllPromotions } from "./promotions-seeding.js";
import { autoSync } from "./autoSync.js";

export interface IStorage {
  // Brand methods
  getAllBrands(): Promise<Brand[]>;
  getBrandBySlug(slug: string): Promise<Brand | null>;
  createBrand(data: Omit<Brand, 'id' | 'createdAt'>): Promise<Brand>;
  updateBrand(id: string, data: Partial<Brand>): Promise<Brand | null>;

  // Promotion methods
  getAllPromotions(): Promise<Promotion[]>;
  getPromotionById(id: string): Promise<Promotion | null>;
  getPromotionBySlug(slug: string): Promise<Promotion | null>;
  getPromotionsByBrand(brandId: string): Promise<Promotion[]>;
  createPromotion(data: Omit<Promotion, 'id' | 'createdAt'>): Promise<Promotion>;
  updatePromotion(id: string, data: Partial<Promotion>): Promise<Promotion | null>;
  deletePromotion(id: string): Promise<boolean>;

  // Promotion Item methods
  getPromotionItemById(id: string): Promise<PromotionItem | null>;
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
  private autoSyncInitialized = false;

  private async ensureAutoSyncInitialized() {
    if (this.autoSyncInitialized) return;
    
    try {
      // Execute Vualá to Gamesa migration only in production/deployment
      if (process.env.REPLIT_ENV === 'prod') {
        await this.performVualaToGamesaMigration();
      }
      
      this.autoSyncInitialized = true;
      console.log('✅ Database storage initialized - using shared DATABASE_URL for both preview and deployment');
    } catch (error) {
      console.error('❌ Error inicializando storage:', error);
    }
  }

  private async performVualaToGamesaMigration() {
    try {
      console.log("🔄 Deployment: Checking if Vualá to Gamesa migration is needed...");
      
      // Get all brands
      const brands = await this.getAllBrands();
      const gamesaBrand = brands.find(b => b.slug === 'gamesa');
      const vualaBrand = brands.find(b => b.slug === 'vuala');
      
      if (!gamesaBrand || !vualaBrand) {
        console.log("⚠️ Required brands not found for migration");
        return;
      }
      
      // Get Vualá promotions before 2017
      const vualaPromotions = await this.getPromotionsByBrand(vualaBrand.id);
      const promotionsToMigrate = vualaPromotions.filter(p => p.startYear < 2017);
      
      if (promotionsToMigrate.length === 0) {
        console.log("✅ No Vualá promotions before 2017 to migrate - already done");
        return;
      }
      
      console.log(`📋 Found ${promotionsToMigrate.length} Vualá promotions before 2017 to migrate to Gamesa`);
      
      let migratedCount = 0;
      for (const promotion of promotionsToMigrate) {
        await this.updatePromotion(promotion.id, { brandId: gamesaBrand.id });
        migratedCount++;
        console.log(`✅ Migrated: ${promotion.name} (${promotion.startYear})`);
      }
      
      console.log(`🎉 Deployment Migration completed! Moved ${migratedCount} promotions from Vualá to Gamesa`);
    } catch (error) {
      console.error("❌ Migration error:", error);
    }
  }

  private async ensureSeeded() {
    if (this.isSeeded) return;
    
    try {
      // Check both brands and promotions for smart seeding
      const existingBrands = await db.select().from(brands);
      const existingPromotions = await db.select().from(promotions);
      
      console.log(`🔍 Revisando base de datos: ${existingBrands.length} marcas, ${existingPromotions.length} promociones encontradas`);
      
      // Only seed if database is completely empty (preserves user changes)
      if (existingBrands.length === 0 && existingPromotions.length === 0) {
        console.log('📦 Base de datos vacía, iniciando seeding inicial...');
        await this.seedDatabase();
        
        // Verify seeding was successful
        const newBrands = await db.select().from(brands);
        const newPromotions = await db.select().from(promotions);
        console.log(`✅ Seeding completado: ${newBrands.length} marcas, ${newPromotions.length} promociones`);
      } else {
        console.log(`✅ Base de datos en uso: ${existingBrands.length} marcas, ${existingPromotions.length} promociones (preservando cambios del usuario)`);
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
    await this.ensureAutoSyncInitialized();
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
    return await db.select().from(promotions).orderBy(promotions.sortOrder, promotions.startYear);
  }

  async getPromotionById(id: string): Promise<Promotion | null> {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.id, id));
    return promotion || null;
  }

  async getPromotionBySlug(slug: string): Promise<Promotion | null> {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.slug, slug));
    return promotion || null;
  }

  async getPromotionsByBrand(brandId: string): Promise<Promotion[]> {
    return await db.select().from(promotions).where(eq(promotions.brandId, brandId)).orderBy(promotions.sortOrder, promotions.startYear);
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
  async getPromotionItemById(id: string): Promise<PromotionItem | null> {
    const [item] = await db.select().from(promotionItems).where(eq(promotionItems.id, id));
    return item || null;
  }

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

    // Create all promotions using the complete seeding data
    await createAllPromotions(this.createPromotion.bind(this), {
      sabritas,
      gamesa,
      marinela,
      bimbo,
      barcel,
      ricolino,
      vuala
    });
  }
}

// Export a singleton instance - using DatabaseStorage to persist data
export const storage = new DatabaseStorage();
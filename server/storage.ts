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
      logoUrl: "/attached_assets/sabritas-37258_1755143611549.png",
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
      logoUrl: "/attached_assets/Gamesa2008_1755143611550.webp",
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

    const bimbo: Brand = {
      id: randomUUID(),
      name: "Bimbo",
      slug: "bimbo",
      description: "La panificadora más grande de México y América Latina, líder en productos de panificación.",
      logoUrl: "/attached_assets/Logo_Bimbo_2000_1755143611549.png",
      primaryColor: "#FFB300",
      founded: 1945,
      createdAt: new Date(),
    };
    this.brands.set(bimbo.id, bimbo);

    const barcel: Brand = {
      id: randomUUID(),
      name: "Barcel",
      slug: "barcel",
      description: "Marca mexicana especializada en confitería y dulces, famosa por sus Churrumais y Hot Nuts.",
      logoUrl: "/attached_assets/Barcel_1755143611550.png",
      primaryColor: "#E53E3E",
      founded: 1978,
      createdAt: new Date(),
    };
    this.brands.set(barcel.id, barcel);

    const ricolino: Brand = {
      id: randomUUID(),
      name: "Ricolino",
      slug: "ricolino",
      description: "Reconocida marca mexicana de dulces y chocolates, famosa por Kranky, Bubulubu y Duvalin.",
      logoUrl: null,
      primaryColor: "#8B5CF6",
      founded: 1950,
      createdAt: new Date(),
    };
    this.brands.set(ricolino.id, ricolino);

    const vuala: Brand = {
      id: randomUUID(),
      name: "Vualá",
      slug: "vuala",
      description: "Marca mexicana de croissants y panecillos dulces, conocida por sus sabores únicos y promociones coleccionables.",
      logoUrl: "/attached_assets/Vuala_1755143611550.png",
      primaryColor: "#F59E0B",
      founded: 2002,
      createdAt: new Date(),
    };
    this.brands.set(vuala.id, vuala);

    // Sabritas Promotions
    const spiderman3: Promotion = {
      id: randomUUID(),
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
      createdAt: new Date(),
    };
    this.promotions.set(spiderman3.id, spiderman3);

    // Gamesa Promotions
    const chocoshokGormiti: Promotion = {
      id: randomUUID(),
      brandId: gamesa.id,
      name: "ChocoShok Gormiti",
      slug: "chocoshok-gormiti",
      description: "Promoción de ChocoShok con figuras coleccionables de Gormiti, los guardianes de los elementos.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/rotated/Chocoshok gormiti frontal_1755219298606_rotated.png",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Chocoshok gormiti frontal_1755219298606_rotated.png",
        "/attached_assets/rotated/Chocoshok gormiti lateral_1755219298606_rotated.png",
        "/attached_assets/rotated/Chocoshok gormiti trasera_1755219298606_rotated.png"
      ],
      wrapperRotation: 90,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2010,
      endYear: 2012,
      category: "figuras",
      tags: ["gormiti", "figuras", "naturaleza", "coleccionables"],
      createdAt: new Date(),
    };
    this.promotions.set(chocoshokGormiti.id, chocoshokGormiti);

    const chocoshokPunkiPunky: Promotion = {
      id: randomUUID(),
      brandId: gamesa.id,
      name: "ChocoShok Punki Punky",
      slug: "chocoshok-punki-punky",
      description: "Promoción especial de ChocoShok con elementos de Punki Punky incluidos.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/rotated/Chocoshok punky punki frontal_1755219298606_rotated.png",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Chocoshok punky punki frontal_1755219298606_rotated.png",
        "/attached_assets/rotated/Chocoshok punky punki lateral_1755219298606_rotated.png",
        "/attached_assets/rotated/Chocoshok punky punki trasera_1755219298606_rotated.png"
      ],
      wrapperRotation: 90,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2010,
      endYear: 2011,
      category: "stickers",
      tags: ["punki-punky", "stickers", "coleccionables"],
      createdAt: new Date(),
    };
    this.promotions.set(chocoshokPunkiPunky.id, chocoshokPunkiPunky);

    // Vualá Promotions
    const angryBirdsGo: Promotion = {
      id: randomUUID(),
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
      createdAt: new Date(),
    };
    this.promotions.set(angryBirdsGo.id, angryBirdsGo);

    const elChavo: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "El Chavo",
      slug: "el-chavo-2012",
      description: "Promoción del Chavo del Ocho con figuras y accesorios coleccionables de todos los personajes de la vecindad.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/El chavo 2012 Trasera cajeta_1755145664203_processed.png",
      wrapperPhotosUrls: [
        "/attached_assets/El chavo 2012 Trasera cajeta_1755145664203_processed.png",
        "/attached_assets/rotated/El chavo mini 2015 vainilla_1755219298610_rotated.png",
        "/attached_assets/rotated/El chavo mini chocolate_1755219298610_rotated.png",
        "/attached_assets/rotated/el chavo chavitops chocolate_1755219298610_rotated.png"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "figuras",
      tags: ["el-chavo", "chespirito", "vecindad", "televisión"],
      createdAt: new Date(),
    };
    this.promotions.set(elChavo.id, elChavo);

    const looney: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Looney Tunes",
      slug: "looney-tunes-2009",
      description: "Clásicos personajes de Looney Tunes en una increíble promoción con figuras coleccionables de Bugs Bunny, Pato Lucas y más.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/Frontal cajeta looney tunes 2009_1755145664204_processed.png",
      wrapperPhotosUrls: [
        "/attached_assets/Frontal cajeta looney tunes 2009_1755145664204_processed.png",
        "/attached_assets/Frontal Chocolate  looney tunes 2009.jpg",
        "/attached_assets/Lateral Chocolate  looney tunes 2009.jpg",
        "/attached_assets/Traera Chocolate  looney tunes 2009.jpg"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2009,
      endYear: 2009,
      category: "figuras",
      tags: ["looney-tunes", "bugs-bunny", "pato-lucas", "animación"],
      createdAt: new Date(),
    };
    this.promotions.set(looney.id, looney);

    const funkiPunky: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Funki Punky Xtremo",
      slug: "funki-punky-xtremo-2011",
      description: "Promoción extrema de Funki Punky con stickers, lápices y accesorios únicos con diseños rebeldes.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/trasera cajeta funki punky xtremo 2011_1755145664205_processed.png",
      wrapperPhotosUrls: [
        "/attached_assets/trasera cajeta funki punky xtremo 2011_1755145664205_processed.png",
        "/attached_assets/Trasera cajeta rebeldes con causa funky punki_1755145664206_processed.png",
        "/attached_assets/rotated/Funki punky extremo chocolate_1755219298611_rotated.png"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2011,
      endYear: 2011,
      category: "stickers",
      tags: ["funki-punky", "stickers", "rebelde", "extremo"],
      createdAt: new Date(),
    };
    this.promotions.set(funkiPunky.id, funkiPunky);

    const cartoonNetwork: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Cartoon Network",
      slug: "cartoon-network-2018",
      description: "Espectacular promoción con personajes de Cartoon Network: Ben 10, Las Chicas Superpoderosas, Hora de Aventura y más.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/Trasera chocolate cartoon network 2018_1755145664206_processed.png",
      wrapperPhotosUrls: [
        "/attached_assets/Trasera chocolate cartoon network 2018_1755145664206_processed.png",
        "/attached_assets/rotated/Frontal chocolate hora de aventura 2018_1755219298611_rotated.png"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2018,
      endYear: 2018,
      category: "figuras",
      tags: ["cartoon-network", "ben-10", "chicas-superpoderosas", "hora-de-aventura"],
      createdAt: new Date(),
    };
    this.promotions.set(cartoonNetwork.id, cartoonNetwork);

    const stevenUniverse: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Steven Universe",
      slug: "steven-universe-2017",
      description: "Mágica promoción de Steven Universe con gemas coleccionables y figuras de Steven, Garnet, Amatista y Perla.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/trasera chocolate steven universe_1755145664206_processed.png",
      wrapperPhotosUrls: [
        "/attached_assets/trasera chocolate steven universe_1755145664206_processed.png"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2017,
      endYear: 2017,
      category: "Mini Colgantes",
      tags: ["steven-universe", "gemas", "cartoon-network", "magia", "mini-colgantes"],
      createdAt: new Date(),
    };
    this.promotions.set(stevenUniverse.id, stevenUniverse);

    const corazones: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Corazones",
      slug: "corazones-2017",
      description: "Romántica promoción de San Valentín con colgantes, stickers y accesorios en forma de corazón.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/Trasera corazones 2017 chocolate_1755145664206_processed.png",
      wrapperPhotosUrls: [
        "/attached_assets/Trasera corazones 2017 chocolate_1755145664206_processed.png"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2017,
      endYear: 2017,
      category: "Mini Colgantes",
      tags: ["corazones", "san-valentin", "romántico", "mini-colgantes"],
      createdAt: new Date(),
    };
    this.promotions.set(corazones.id, corazones);

    const laEraDelHielo: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "La Era del Hielo",
      slug: "la-era-del-hielo-2012",
      description: "Aventura glacial con Manny, Sid, Diego y Scrat en una promoción llena de figuras coleccionables prehistóricas.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/Trasera la era del hielo 2012 chocolate_1755145664207_processed.png",
      wrapperPhotosUrls: [
        "/attached_assets/Trasera la era del hielo 2012 chocolate_1755145664207_processed.png"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "figuras",
      tags: ["la-era-del-hielo", "manny", "sid", "diego", "scrat"],
      createdAt: new Date(),
    };
    this.promotions.set(laEraDelHielo.id, laEraDelHielo);

    const bobEsponja: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Bob Esponja",
      slug: "bob-esponja-2012",
      description: "Diversión submarina con Bob Esponja, Patricio, Calamardo y el Señor Cangrejo en Fondo de Bikini.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/Trasera Bob esponja 2012_1755145664205_processed.png",
      wrapperPhotosUrls: [
        "/attached_assets/Trasera Bob esponja 2012_1755145664205_processed.png",
        "/attached_assets/rotated/Frontal bob esponja 2012 chocolate_1755219298611_rotated.png",
        "/attached_assets/rotated/Vainilla bob esponja 2024_1755219753445_rotated.png"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "figuras",
      tags: ["bob-esponja", "patricio", "calamardo", "fondo-de-bikini"],
      createdAt: new Date(),
    };
    this.promotions.set(bobEsponja.id, bobEsponja);

    const ecoinvasores: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Ecoinvasores",
      slug: "ecoinvasores-2011",
      description: "Promoción ecológica con alienígenas que enseñan sobre el cuidado del medio ambiente y el reciclaje.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/Ecoinvasores trasera cajeta_1755145664202_processed.png",
      wrapperPhotosUrls: [
        "/attached_assets/Ecoinvasores trasera cajeta_1755145664202_processed.png"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2011,
      endYear: 2011,
      category: "figuras",
      tags: ["ecoinvasores", "medio-ambiente", "ecología", "figuras"],
      createdAt: new Date(),
    };
    this.promotions.set(ecoinvasores.id, ecoinvasores);

    // Promociones adicionales de Vualá
    const theDog: Promotion = {
      id: randomUUID(),
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
      createdAt: new Date(),
    };
    this.promotions.set(theDog.id, theDog);

    const vualaMiniChocos: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Vualá Mini Chocos",
      slug: "vuala-mini-chocos",
      description: "Pequeños croissants de chocolate de Vualá con promociones especiales incluidas.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/rotated/IMG_4303-removebg-preview_1755219298609_rotated.png",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/IMG_4303-removebg-preview_1755219298609_rotated.png"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2008,
      endYear: 2012,
      category: "croissants",
      tags: ["mini-chocos", "chocolate", "croissants"],
      createdAt: new Date(),
    };
    this.promotions.set(vualaMiniChocos.id, vualaMiniChocos);

    const elChavoSorpresa: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "El Chavo Sorpresa",
      slug: "el-chavo-sorpresa",
      description: "Promoción de sorpresas del Chavo del Ocho con figuras y accesorios coleccionables.",
      imageUrl: null,
      wrapperPhotoUrl: "/attached_assets/rotated/IMG_4296-removebg-preview_1755219298608_rotated.png",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/IMG_4296-removebg-preview_1755219298608_rotated.png"
      ],
      wrapperRotation: 0,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2010,
      endYear: 2012,
      category: "figuras",
      tags: ["el-chavo", "sorpresas", "figuras", "coleccionables"],
      createdAt: new Date(),
    };
    this.promotions.set(elChavoSorpresa.id, elChavoSorpresa);
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
    for (const [promotionId, items] of Array.from(this.promotionItems.entries())) {
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

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    const existingBrands = await this.getAllBrands();
    if (existingBrands.length === 0) {
      await this.seedDatabase();
    }
  }

  // Brand methods
  async getAllBrands(): Promise<Brand[]> {
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
    const [promotion] = await db.update(promotions).set(data).where(eq(promotions.id, id)).returning();
    return promotion || null;
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
    // Create brands first
    const memStorage = new MemStorage();
    const brandsToSeed = await memStorage.getAllBrands();
    const promotionsToSeed = await memStorage.getAllPromotions();

    // Insert brands
    for (const brand of brandsToSeed) {
      const { id, createdAt, ...brandData } = brand;
      await this.createBrand(brandData);
    }

    // Get brand IDs from database to map them
    const dbBrands = await this.getAllBrands();
    const brandIdMap = new Map<string, string>();
    
    for (let i = 0; i < brandsToSeed.length; i++) {
      brandIdMap.set(brandsToSeed[i].id, dbBrands[i].id);
    }

    // Insert promotions with mapped brand IDs
    for (const promotion of promotionsToSeed) {
      const { id, createdAt, ...promotionData } = promotion;
      const mappedBrandId = brandIdMap.get(promotion.brandId);
      if (mappedBrandId) {
        await this.createPromotion({
          ...promotionData,
          brandId: mappedBrandId
        });
      }
    }
  }
}

// Export a singleton instance - switch to DatabaseStorage to persist data
export const storage = new DatabaseStorage();
import { randomUUID } from 'crypto';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  primaryColor: string;
  founded: number;
  createdAt: Date;
}

export interface Promotion {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  wrapperPhotoUrl: string | null;
  wrapperPhotosUrls: string[] | null;
  wrapperRotation: number;
  promotionImagesUrls: string[] | null;
  youtubeCommercialUrl: string | null;
  buffetGamesVideoUrl: string | null;
  startYear: number;
  endYear: number | null;
  category: string;
  tags: string[] | null;
  createdAt: Date;
}

export interface PromotionItem {
  id: string;
  promotionId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  rarity: string | null;
  itemNumber: number | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
}

export interface IStorage {
  getBrands(): Promise<Brand[]>;
  getBrandBySlug(slug: string): Promise<Brand | null>;
  getPromotions(): Promise<Promotion[]>;
  getPromotionBySlug(slug: string): Promise<Promotion | null>;
  getPromotionsByBrandId(brandId: string): Promise<Promotion[]>;
  getPromotionItems(promotionId: string): Promise<PromotionItem[]>;
}

export class MemStorage implements IStorage {
  private brands = new Map<string, Brand>();
  private promotions = new Map<string, Promotion>();
  private promotionItems = new Map<string, PromotionItem[]>();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Brands
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
      logoUrl: "/attached_assets/Logo_Bimbo_2000_1755143611549.png",
      primaryColor: "#FFD700",
      founded: 1945,
      createdAt: new Date(),
    };
    this.brands.set(bimbo.id, bimbo);

    const vuala: Brand = {
      id: randomUUID(),
      name: "Vualá",
      slug: "vuala",
      description: "Marca icónica mexicana de panecillos y repostería, famosa por sus promociones coleccionables con personajes animados.",
      logoUrl: "/attached_assets/Vuala_1755143611550.png",
      primaryColor: "#FF6B35",
      founded: 1990,
      createdAt: new Date(),
    };
    this.brands.set(vuala.id, vuala);

    const ricolino: Brand = {
      id: randomUUID(),
      name: "Ricolino",
      slug: "ricolino",
      description: "Marca mexicana de dulces y chocolates, reconocida por sus promociones de figuras y coleccionables.",
      logoUrl: null,
      primaryColor: "#8B0000",
      founded: 1928,
      createdAt: new Date(),
    };
    this.brands.set(ricolino.id, ricolino);

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

    // Promociones de Sabritas
    const spiderman3: Promotion = {
      id: randomUUID(),
      brandId: sabritas.id,
      name: "Spiderman 3",
      slug: "spiderman-3-2007",
      description: "Promoción épica de Sabritas con tazos coleccionables de Spider-Man 3. Incluye tazos dorados especiales y figuras exclusivas del hombre araña.",
      imageUrl: null,
      startYear: 2007,
      endYear: 2007,
      category: "tazos",
      tags: ["spiderman", "marvel", "cine", "coleccionables"],
      wrapperPhotoUrl: "/attached_assets/spiderman3_wrapper_1755143611553.jpg",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Vainilla frontal spiderman 3_1755152265577_rotated.png",
        "/attached_assets/rotated/Chocolate frontal spiderman 3_1755196507572_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 90,
      createdAt: new Date(),
    };
    this.promotions.set(spiderman3.id, spiderman3);

    const chocoshok_gormiti: Promotion = {
      id: randomUUID(),
      brandId: sabritas.id,
      name: "Chocoshok Gormiti",
      slug: "chocoshok-gormiti-2009",
      description: "Espectacular promoción de Chocoshok con figuras de Gormiti. Los Señores de la Naturaleza llegan con increíbles personajes coleccionables.",
      imageUrl: null,
      startYear: 2009,
      endYear: 2009,
      category: "figuras",
      tags: ["gormiti", "figuras", "naturaleza", "coleccionables"],
      wrapperPhotoUrl: "/attached_assets/chocoshok_gormiti_wrapper_1755143611553.jpg",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Chocoshok GORMITI frontal_1755152265583_rotated.png"
      ],
      promotionImagesUrls: [
        "/attached_assets/chocoshok gormiti 1_1755152265583.jpg",
        "/attached_assets/chocoshok gormiti 2_1755152265583.jpg"
      ],
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: "https://www.buffetgames.com/es/c/gormiti/",
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(chocoshok_gormiti.id, chocoshok_gormiti);

    const angrybirds_go: Promotion = {
      id: randomUUID(),
      brandId: sabritas.id,
      name: "Angry Birds GO!",
      slug: "angry-birds-go-2013",
      description: "Emocionante promoción de Sabritas con la franquicia Angry Birds GO! Incluye cartas coleccionables y códigos especiales para el videojuego.",
      imageUrl: null,
      startYear: 2013,
      endYear: 2013,
      category: "cartas",
      tags: ["angry-birds", "videojuegos", "cartas", "rovio"],
      wrapperPhotoUrl: "/attached_assets/angrybirds_go_wrapper_1755143611553.jpg",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/vainilla angry birds GO_1755219753445_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(angrybirds_go.id, angrybirds_go);

    // Promociones de Gamesa
    const pokemon_2008: Promotion = {
      id: randomUUID(),
      brandId: gamesa.id,
      name: "Pokémon 2008",
      slug: "pokemon-2008",
      description: "Increíble promoción de Gamesa con figuras de Pokémon. Una colección completa de los Pokémon más populares.",
      imageUrl: null,
      startYear: 2008,
      endYear: 2008,
      category: "figuras",
      tags: ["pokemon", "nintendo", "figuras", "anime"],
      wrapperPhotoUrl: "/attached_assets/pokemon_gamesa_wrapper_1755143611553.jpg",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Gamesa pokemon frontal_1755152265578_rotated.png"
      ],
      promotionImagesUrls: [
        "/attached_assets/pokemon gamesa 1_1755152265578.jpg",
        "/attached_assets/pokemon gamesa 2_1755152265578.jpg"
      ],
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(pokemon_2008.id, pokemon_2008);

    // Promociones de Barcel
    const funki_punky: Promotion = {
      id: randomUUID(),
      brandId: barcel.id,
      name: "Funki Punky Stickers",
      slug: "funki-punky-stickers-2000s",
      description: "Los legendarios stickers de Funki Punky que marcaron una época. Colección de stickers brillantes con diseños únicos y divertidos.",
      imageUrl: null,
      startYear: 2000,
      endYear: 2005,
      category: "stickers",
      tags: ["funki-punky", "stickers", "brillantes", "colección"],
      wrapperPhotoUrl: "/attached_assets/funki_punky_wrapper_1755143611553.jpg",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Funki punky frontal_1755152265579_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(funki_punky.id, funki_punky);

    // Promociones de Bimbo
    const goku_ssj: Promotion = {
      id: randomUUID(),
      brandId: bimbo.id,
      name: "Goku Super Saiyan",
      slug: "goku-super-saiyan-2005",
      description: "Promoción especial de Bimbo con figuras de Dragon Ball Z. Goku en su transformación Super Saiyan con efectos especiales.",
      imageUrl: null,
      startYear: 2005,
      endYear: 2005,
      category: "figuras",
      tags: ["dragon-ball", "goku", "super-saiyan", "anime"],
      wrapperPhotoUrl: "/attached_assets/goku_bimbo_wrapper_1755143611553.jpg",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Bimbo goku frontal_1755152265580_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(goku_ssj.id, goku_ssj);

    // Promociones de Vualá
    const looney_tunes: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Looney Tunes",
      slug: "looney-tunes-1995",
      description: "Clásica promoción de Vualá con los personajes de Looney Tunes. Bugs Bunny, Pato Lucas, y toda la pandilla en figuras coleccionables.",
      imageUrl: null,
      startYear: 1995,
      endYear: 1995,
      category: "figuras",
      tags: ["looney-tunes", "bugs-bunny", "warner-bros", "clásicos"],
      wrapperPhotoUrl: "/attached_assets/looney_vuala_wrapper_1755143611553.jpg",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Vuala looney tunes frontal_1755152265581_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(looney_tunes.id, looney_tunes);

    // Promociones de Ricolino
    const chocolate_cards: Promotion = {
      id: randomUUID(),
      brandId: ricolino.id,
      name: "Cartas de Chocolate",
      slug: "cartas-chocolate-2010",
      description: "Promoción única de Ricolino con cartas comestibles de chocolate. Una experiencia dulce y coleccionable.",
      imageUrl: null,
      startYear: 2010,
      endYear: 2010,
      category: "cartas",
      tags: ["chocolate", "cartas", "comestible", "dulce"],
      wrapperPhotoUrl: "/attached_assets/ricolino_cards_wrapper_1755143611553.jpg",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Ricolino cartas frontal_1755152265582_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(chocolate_cards.id, chocolate_cards);

    // Promociones de Marinela
    const pingüinos_aventura: Promotion = {
      id: randomUUID(),
      brandId: marinela.id,
      name: "Pingüinos Aventura",
      slug: "pinguinos-aventura-2012",
      description: "Divertida promoción de Marinela con figuras de pingüinos aventureros. Cada pingüino viene con accesorios únicos para sus aventuras.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "figuras",
      tags: ["pinguinos", "aventura", "figuras", "accesorios"],
      wrapperPhotoUrl: "/attached_assets/pinguinos_marinela_wrapper_1755143611553.jpg",
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Marinela pinguinos frontal_1755152265584_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(pingüinos_aventura.id, pingüinos_aventura);
  }

  async getBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrandBySlug(slug: string): Promise<Brand | null> {
    const brands = Array.from(this.brands.values());
    return brands.find(brand => brand.slug === slug) || null;
  }

  async getPromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values());
  }

  async getPromotionBySlug(slug: string): Promise<Promotion | null> {
    const promotions = Array.from(this.promotions.values());
    return promotions.find(promotion => promotion.slug === slug) || null;
  }

  async getPromotionsByBrandId(brandId: string): Promise<Promotion[]> {
    const promotions = Array.from(this.promotions.values());
    return promotions.filter(promotion => promotion.brandId === brandId);
  }

  async getPromotionItems(promotionId: string): Promise<PromotionItem[]> {
    return this.promotionItems.get(promotionId) || [];
  }
}
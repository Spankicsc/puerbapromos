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
      logoUrl: null,
      primaryColor: "#FF1744",
      founded: 1954,
      createdAt: new Date(),
    };
    this.brands.set(marinela.id, marinela);

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

    // Vualá Promotions
    const angry_birds_go: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Angry Birds GO",
      slug: "angry-birds-go",
      description: "Promoción de Vualá con los personajes de Angry Birds en su versión racing, incluye stickers y figuras coleccionables.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2013,
      category: "stickers",
      tags: ["angry birds", "racing", "videojuegos"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/vainilla angry birds GO_1755219753445_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(angry_birds_go.id, angry_birds_go);

    const el_chavo: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "El Chavo del Ocho",
      slug: "el-chavo-del-ocho",
      description: "Promoción especial de Vualá con los personajes del icónico programa El Chavo del Ocho de Chespirito.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2015,
      category: "stickers",
      tags: ["chespirito", "el chavo", "comedia mexicana"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/El chavo mini 2015 vainilla_1755219298610_rotated.png",
        "/attached_assets/rotated/El chavo mini chocolate_1755219298610_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(el_chavo.id, el_chavo);

    const bob_esponja_2012: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Bob Esponja 2012",
      slug: "bob-esponja-2012",
      description: "Promoción de Vualá con Bob Esponja y sus amigos de Fondo de Bikini, incluye stickers y figuras.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "stickers",
      tags: ["bob esponja", "nickelodeon", "cartoon"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Frontal bob esponja 2012 chocolate_1755219298611_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(bob_esponja_2012.id, bob_esponja_2012);

    const bob_esponja_2024: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Bob Esponja 2024",
      slug: "bob-esponja-2024",
      description: "Promoción actualizada de Bob Esponja con diseños modernos y nuevos personajes.",
      imageUrl: null,
      startYear: 2024,
      endYear: 2024,
      category: "stickers",
      tags: ["bob esponja", "nickelodeon", "cartoon", "moderna"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Vainilla bob esponja 2024_1755219753445_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(bob_esponja_2024.id, bob_esponja_2024);

    const looney_tunes: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Looney Tunes 2009",
      slug: "looney-tunes-2009",
      description: "Promoción clásica con Bugs Bunny, Pato Lucas y todos los personajes de Looney Tunes.",
      imageUrl: null,
      startYear: 2009,
      endYear: 2009,
      category: "stickers",
      tags: ["looney tunes", "bugs bunny", "warner bros"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(looney_tunes.id, looney_tunes);

    const teen_titans: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Teen Titans",
      slug: "teen-titans",
      description: "Promoción de los Jóvenes Titanes con Robin, Starfire, Raven, Beast Boy y Cyborg.",
      imageUrl: null,
      startYear: 2015,
      endYear: 2016,
      category: "stickers",
      tags: ["teen titans", "dc comics", "superhéroes"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Teen titans vainilla version 1_1755219753444_rotated.png",
        "/attached_assets/rotated/Teen titans vainilla version 2_1755219753444_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(teen_titans.id, teen_titans);

    const the_dog_2004: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "The Dog 2004",
      slug: "the-dog-2004",
      description: "Promoción icónica con los personajes de The Dog, la famosa serie de fotografías de perros.",
      imageUrl: null,
      startYear: 2004,
      endYear: 2004,
      category: "stickers",
      tags: ["the dog", "fotografía", "mascotas"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/The dog 2004 vainilla frontal_1755219753444_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 90,
      createdAt: new Date(),
    };
    this.promotions.set(the_dog_2004.id, the_dog_2004);

    const the_dog_2007: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "The Dog y The Cat 2007",
      slug: "the-dog-y-the-cat-2007",
      description: "Continuación de The Dog ahora incluyendo gatos, ampliando la colección de mascotas.",
      imageUrl: null,
      startYear: 2007,
      endYear: 2007,
      category: "stickers",
      tags: ["the dog", "the cat", "mascotas"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/The dog y the cat 2007 chocolate_1755219753445_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(the_dog_2007.id, the_dog_2007);

    const vuala_croissant: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Vualá Croissant",
      slug: "vuala-croissant",
      description: "Una probada de Europa. En 2002, Vualá introdujo al mercado mexicano una línea de croissants inspirados en la repostería europea. Disponibles en sabores vainilla, chocolate y mermelada.",
      imageUrl: null,
      startYear: 2002,
      endYear: 2010,
      category: "croissants",
      tags: ["europa", "repostería", "croissant"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/IMG_4249-removebg-preview_1755219298607_rotated.png",
        "/attached_assets/rotated/IMG_4302-removebg-preview_1755219298609_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(vuala_croissant.id, vuala_croissant);

    const hora_aventura: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Hora de Aventura 2018",
      slug: "hora-de-aventura-2018",
      description: "Promoción con Finn y Jake en sus aventuras matemáticas por la Tierra de Ooo.",
      imageUrl: null,
      startYear: 2018,
      endYear: 2018,
      category: "stickers",
      tags: ["adventure time", "cartoon network", "finn", "jake"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Frontal chocolate hora de aventura 2018_1755219298611_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(hora_aventura.id, hora_aventura);

    // Más promociones de Barcel
    const funki_punky_extremo: Promotion = {
      id: randomUUID(),
      brandId: barcel.id,
      name: "Funki Punky Extremo",
      slug: "funki-punky-extremo",
      description: "La versión más extrema de los icónicos stickers Funki Punky con diseños más atrevidos y coleccionables raros.",
      imageUrl: null,
      startYear: 2011,
      endYear: 2012,
      category: "stickers",
      tags: ["funki punky", "extremo", "stickers", "coleccionables"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Funki punky extremo chocolate_1755219298611_rotated.png",
        "/attached_assets/rotated/vainilla funki punky extremo_1755219753446_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(funki_punky_extremo.id, funki_punky_extremo);

    // Promociones adicionales de Gamesa
    const fonomania_2008: Promotion = {
      id: randomUUID(),
      brandId: gamesa.id,
      name: "Fonomania 2008",
      slug: "fonomania-2008",
      description: "Promoción musical de ChocoShok con artistas y bandas populares de la época.",
      imageUrl: null,
      startYear: 2008,
      endYear: 2008,
      category: "musica",
      tags: ["música", "artistas", "bandas"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Fonomania 2008 frontal chocolate_1755219298611_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(fonomania_2008.id, fonomania_2008);

    const dancemania_2008: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Dancemania 2008",
      slug: "dancemania-2008",
      description: "Promoción de Vualá con música y baile, presentando figuras y accesorios inspirados en la cultura dance de finales de los 2000s.",
      imageUrl: null,
      startYear: 2008,
      endYear: 2008,
      category: "figuras",
      tags: ["dance", "música", "baile"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/Dancemania 2008 frontal chocolate_1755219298609_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(dancemania_2008.id, dancemania_2008);

    // Más promociones de Vualá
    const los_simpson_2008: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Los Simpson 2008",
      slug: "los-simpson-2008",
      description: "Promoción clásica con los icónicos personajes de Los Simpson: Homer, Marge, Bart, Lisa y Maggie.",
      imageUrl: null,
      startYear: 2008,
      endYear: 2008,
      category: "stickers",
      tags: ["los simpson", "homer", "bart", "fox"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Los simpson 2008 chocolate frontal_1755148526407.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(los_simpson_2008.id, los_simpson_2008);

    const minions: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Minions",
      slug: "minions",
      description: "Promoción con los adorables Minions de la película Mi Villano Favorito.",
      imageUrl: null,
      startYear: 2015,
      endYear: 2016,
      category: "stickers",
      tags: ["minions", "mi villano favorito", "gru", "universal"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/minions chocolate_1755148526408.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(minions.id, minions);

    const tattomania_2003: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Tattomania 2003",
      slug: "tattomania-2003",
      description: "Promoción de tatuajes temporales con diseños únicos y coleccionables.",
      imageUrl: null,
      startYear: 2003,
      endYear: 2003,
      category: "tatuajes",
      tags: ["tatuajes", "temporales", "diseños"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Tattomania 2003 chocolate_1755219753444.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 90,
      createdAt: new Date(),
    };
    this.promotions.set(tattomania_2003.id, tattomania_2003);

    const pinki_pow_punks: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Pinki Pow Punks Funki Tubers 2020",
      slug: "pinki-pow-punks-funki-tubers-2020",
      description: "Promoción moderna con personajes de Pinki Pow Punks inspirados en YouTubers y cultura digital.",
      imageUrl: null,
      startYear: 2020,
      endYear: 2020,
      category: "stickers",
      tags: ["pinki pow punks", "youtubers", "digital", "moderna"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Pinki pow punks funki tubers vainilla 2020_1755219753446.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(pinki_pow_punks.id, pinki_pow_punks);

    const ecoinvasores: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Ecoinvasores",
      slug: "ecoinvasores",
      description: "Promoción ecológica con personajes alienígenas que promueven el cuidado del medio ambiente.",
      imageUrl: null,
      startYear: 2011,
      endYear: 2011,
      category: "stickers",
      tags: ["ecología", "alien", "medio ambiente", "invasores"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(ecoinvasores.id, ecoinvasores);

    const tortugas_ninja: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Tortugas Ninja",
      slug: "tortugas-ninja",
      description: "Promoción con Leonardo, Donatello, Rafael y Miguel Ángel, las Tortugas Ninja mutantes adolescentes.",
      imageUrl: null,
      startYear: 2014,
      endYear: 2015,
      category: "stickers",
      tags: ["tortugas ninja", "leonardo", "donatello", "nickelodeon"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Tortugas ninja chocolate_1755219753444.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(tortugas_ninja.id, tortugas_ninja);

    const el_futbol_huevos: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Vive el Fútbol con Huevos 2010",
      slug: "vive-el-futbol-con-huevos-2010",
      description: "Promoción futbolística con los personajes de la película mexicana 'El Fútbol de Huevos'.",
      imageUrl: null,
      startYear: 2010,
      endYear: 2010,
      category: "stickers",
      tags: ["fútbol", "huevos", "deporte", "película mexicana"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Vive el futbol con huevos 2010 frontal chocolate_1755219753446.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(el_futbol_huevos.id, el_futbol_huevos);

    // Promociones adicionales de Sabritas
    const askistix_2004: Promotion = {
      id: randomUUID(),
      brandId: sabritas.id,
      name: "Askistix 2004",
      slug: "askistix-2004",
      description: "Promoción clásica de Sabritas con los icónicos personajes de Astérix y Obélix.",
      imageUrl: null,
      startYear: 2004,
      endYear: 2004,
      category: "tazos",
      tags: ["asterix", "obelix", "galos", "cómic"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Askistix 2004 chocolate frontal_1755148526400.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(askistix_2004.id, askistix_2004);

    const avengers: Promotion = {
      id: randomUUID(),
      brandId: sabritas.id,
      name: "Avengers",
      slug: "avengers",
      description: "Promoción épica con los Vengadores de Marvel: Iron Man, Capitán América, Thor y Hulk.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "tazos",
      tags: ["avengers", "marvel", "iron man", "capitán américa", "thor", "hulk"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Avengers cajeta_1755148526400.png",
        "/attached_assets/Avengers vainilla_1755148526400.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(avengers.id, avengers);
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
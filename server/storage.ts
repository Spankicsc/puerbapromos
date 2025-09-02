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
  
  // Promotion item methods
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

    // Más promociones de Vualá
    const ecoinvasores: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Ecoinvasores",
      slug: "ecoinvasores-2011",
      description: "Promoción de Vualá con los Ecoinvasores, personajes ecológicos que enseñan sobre el cuidado del medio ambiente con figuras coleccionables.",
      imageUrl: null,
      startYear: 2011,
      endYear: 2011,
      category: "figuras",
      tags: ["ecoinvasores", "medio-ambiente", "ecología", "figuras"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Ecoinvasores trasera cajeta_1755145428099.JPG"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(ecoinvasores.id, ecoinvasores);

    const el_chavo: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "El Chavo",
      slug: "el-chavo-2012",
      description: "Promoción de Vualá con los queridos personajes del Chavo del Ocho. Incluye figuras del Chavo, Quico, Chilindrina y toda la vecindad.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "figuras",
      tags: ["el-chavo", "chespirito", "vecindad", "televisión"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/El chavo 2012 Trasera Vainilla_1755145428100.JPG",
        "/attached_assets/El chavo 2012 Trasera cajeta_1755145428100.JPG",
        "/attached_assets/trasera el hcavo 2012 chocolate_1755145428139.JPG"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(el_chavo.id, el_chavo);

    const el_futbol_de_huevos: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "El Fútbol de Huevos",
      slug: "el-futbol-de-huevos-2012",
      description: "Promoción de Vualá con los divertidos personajes de la película 'El Fútbol de Huevos'. Figuras coleccionables de Toto, Willy y más.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "figuras",
      tags: ["futbol-de-huevos", "huevos", "futbol", "película"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Frontal cajeta el futbol de huevos cajeta_1755145428100.JPG",
        "/attached_assets/Trasera cajeta el futbol de huevos cajeta_1755145428102.JPG"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(el_futbol_de_huevos.id, el_futbol_de_huevos);

    const bob_esponja: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Bob Esponja",
      slug: "bob-esponja-2012",
      description: "Promoción de Vualá con Bob Esponja y sus amigos de Fondo de Bikini. Incluye figuras de Patrick, Calamardo y más personajes marinos.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "figuras",
      tags: ["bob-esponja", "nickelodeon", "fondo-bikini", "marino"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Trasera Bob esponja 2012_1755145428102.JPG",
        "/attached_assets/rotated/Bob esponja 2012 Cajeta frontal_1755196507568_rotated.png",
        "/attached_assets/rotated/Bob esponja 2012 vainilla frontal_1755196507569_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(bob_esponja.id, bob_esponja);

    const rebeldes_causa_funky: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Rebeldes con Causa Funky Punki",
      slug: "rebeldes-causa-funky-punki-2011",
      description: "Promoción especial de Vualá con stickers y figuras de los Rebeldes con Causa. Edición Funky Punki con diseños únicos.",
      imageUrl: null,
      startYear: 2011,
      endYear: 2011,
      category: "stickers",
      tags: ["rebeldes", "funky-punki", "stickers", "causa"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Trasera cajeta rebeldes con causa funky punki_1755145428103.JPG"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(rebeldes_causa_funky.id, rebeldes_causa_funky);

    const cartoon_network: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Cartoon Network",
      slug: "cartoon-network-2018",
      description: "Promoción de Vualá con personajes de Cartoon Network. Incluye figuras de Ben 10, Las Chicas Superpoderosas, y más héroes animados.",
      imageUrl: null,
      startYear: 2018,
      endYear: 2019,
      category: "figuras",
      tags: ["cartoon-network", "ben-10", "chicas-superpoderosas", "animación"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Trasera chocolate cartoon network 2018_1755145428103.JPG",
        "/attached_assets/rotated/Cartoon network chocolate_1755196507571_rotated.png",
        "/attached_assets/rotated/Chocolate Cartoon network_1755196507572_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(cartoon_network.id, cartoon_network);

    const corazones: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Corazones",
      slug: "corazones-2017",
      description: "Promoción romántica de Vualá con diseños de corazones. Perfecta para el Día de San Valentín con figuras y stickers temáticos.",
      imageUrl: null,
      startYear: 2017,
      endYear: 2017,
      category: "stickers",
      tags: ["corazones", "san-valentin", "amor", "romántico"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Trasera corazones 2017 chocolate_1755145428104.JPG"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(corazones.id, corazones);

    const la_era_del_hielo: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "La Era del Hielo",
      slug: "la-era-del-hielo-2012",
      description: "Promoción de Vualá con Manny, Sid, Diego y los personajes de La Era del Hielo. Figuras coleccionables de la película animada.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "figuras",
      tags: ["era-del-hielo", "manny", "sid", "diego", "película"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/Trasera la era del hielo 2012 chocolate_1755145428139.JPG"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(la_era_del_hielo.id, la_era_del_hielo);

    const funki_punky_xtremo: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Funki Punky Xtremo",
      slug: "funki-punky-xtremo-2011",
      description: "Versión extrema de los clásicos Funki Punky de Vualá. Stickers brillantes con diseños más atrevidos y coloridos.",
      imageUrl: null,
      startYear: 2011,
      endYear: 2011,
      category: "stickers",
      tags: ["funki-punky", "xtremo", "brillantes", "stickers"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/trasera cajeta funki punky xtremo 2011_1755145428102.JPG"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(funki_punky_xtremo.id, funki_punky_xtremo);

    const steven_universe: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Steven Universe",
      slug: "steven-universe-2017",
      description: "Promoción de Vualá con Steven Universe y las Crystal Gems. Figuras coleccionables de Garnet, Perla, Amatista y más.",
      imageUrl: null,
      startYear: 2017,
      endYear: 2017,
      category: "figuras",
      tags: ["steven-universe", "crystal-gems", "cartoon-network", "gemas"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/trasera chocolate steven universe_1755145428103.JPG"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(steven_universe.id, steven_universe);

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
      tags: ["dancemania", "música", "baile", "cultura-dance"],
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
      tags: ["croissant", "europa", "repostería", "vainilla", "chocolate"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/IMG_4249-removebg-preview_1755219298607_rotated.png",
        "/attached_assets/rotated/IMG_4302-removebg-preview_1755219298609_rotated.png",
        "/attached_assets/rotated/IMG_4248-removebg-preview_1755219298612_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(vuala_croissant.id, vuala_croissant);

    const the_dog_2004: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "The Dog 2004",
      slug: "the-dog-2004",
      description: "Primera aparición de The Dog en México. Colección de figuras y accesorios con perritos de diferentes razas en estilo kawaii, disponible en sabores vainilla y chocolate.",
      imageUrl: null,
      startYear: 2004,
      endYear: 2004,
      category: "figuras",
      tags: ["the-dog", "kawaii", "perritos", "razas"],
      wrapperPhotoUrl: null,
      wrapperPhotosUrls: [
        "/attached_assets/rotated/IMG_4257-removebg-preview_1755219298607_rotated.png",
        "/attached_assets/rotated/IMG_4269-removebg-preview_1755219298608_rotated.png"
      ],
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      wrapperRotation: 0,
      createdAt: new Date(),
    };
    this.promotions.set(the_dog_2004.id, the_dog_2004);

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
    const promotions = Array.from(this.promotions.values());
    return promotions.filter(promotion => promotion.brandId === brandId);
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

  // Promotion item methods
  async getPromotionItemsByPromotion(promotionId: string): Promise<PromotionItem[]> {
    return this.promotionItems.get(promotionId) || [];
  }

  async createPromotionItem(data: Omit<PromotionItem, 'id' | 'createdAt'>): Promise<PromotionItem> {
    const item: PromotionItem = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    
    const existingItems = this.promotionItems.get(data.promotionId) || [];
    this.promotionItems.set(data.promotionId, [...existingItems, item]);
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

// Export a singleton instance
export const storage = new MemStorage();
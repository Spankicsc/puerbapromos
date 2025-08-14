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
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
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
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
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
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
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
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(bubulubu.id, bubulubu);

    // Vualá Promotions - Complete authentic collection from 2002-2024
    
    // Una probada de Europa (2002)
    const europaPromotion: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Una probada de Europa",
      slug: "una-probada-de-europa",
      description: "En 2002, Vualá introdujo al mercado mexicano una línea de croissants inspirados en la repostería europea, con rellenos de chocolate, vainilla y fresa. Para impulsar las ventas, lanzaron la promoción 'Una probada de Europa' del 7 de octubre al 27 de diciembre de ese año. Esta campaña ofrecía a los consumidores la oportunidad de coleccionar 29 postales ilustradas con imágenes de diversas partes de Europa, incluidas en los paquetes de sus productos. Para promocionar esta campaña, la actriz Montserrat Oliver protagonizó un comercial que destacaba los premios y la temática europea de la promoción. Sin embargo, a pesar de estos esfuerzos, la promoción no logró captar suficientemente al público adulto, ya que muchos no consideraban los croissants rellenos de chocolate como una opción de consumo habitual. Esta experiencia llevó a Vualá a replantear sus estrategias de mercado en años posteriores.",
      imageUrl: null,
      wrapperPhotoUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      promotionImagesUrls: [
        "https://images.unsplash.com/photo-1555939594-58e9c0c25166?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        "https://images.unsplash.com/photo-1549985908-597a09ef0a7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      ],
      youtubeCommercialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      buffetGamesVideoUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2002,
      endYear: 2002,
      category: "postales",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(europaPromotion.id, europaPromotion);

    // The Dog 2004
    const theDog2004: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "The Dog: The Artist Collection",
      slug: "the-dog-2004",
      description: "En 2004, Vualá lanzó la promoción 'The Dog: The Artist Collection', vigente del 1 de junio al 4 de septiembre. Siendo la primera colección con un premio exclusivo para Vualá Esta campaña ofrecía a los consumidores la oportunidad de coleccionar 10 miniaturas de perros, solo una de cada dos bolsas contenían una mascota, cada una representando una raza diferente, incluidas en los paquetes de sus productos. Además de las miniaturas, la promoción incluía stix con imágenes de los perritos, fortaleciendo la conexión emocional entre los consumidores y los productos de la marca.",
      imageUrl: null,
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: "https://www.youtube.com/watch?v=sample_thedog",
      buffetGamesVideoUrl: null,
      startYear: 2004,
      endYear: 2004,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(theDog2004.id, theDog2004);

    // Bob Esponja 2005
    const bobEsponja2005: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Bob Esponja Llaveros",
      slug: "bob-esponja-2005",
      description: "En 2005, Vualá lanzó una colección de 8 llaveros de goma basada en los personajes de la popular serie animada Bob Esponja. Esta promoción ofrecía a los consumidores la oportunidad de obtener llaveros de personajes icónicos como Bob Esponja, Patricio en patineta, Arenita, gary entre otros. Esta estrategia buscaba atraer tanto a niños como a coleccionistas, aprovechando la popularidad de la serie en ese momento. Esta promoción fue una extensión de la Colección principal de Nickelodeon que se vendía por separado en tiendas.",
      imageUrl: null,
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      startYear: 2005,
      endYear: 2005,
      category: "llaveros",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(bobEsponja2005.id, bobEsponja2005);

    // Funki Punky 2007 - Featured with complete data
    const funkiPunky2007: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Funki Punky by Faustin Bros",
      slug: "funki-punky-2007",
      description: "En 2007, Vualá lanzó la promoción 'Funki Punky', conocida anteriormente en sudamérica como Funky Punky pinky Pow, en colaboración con Faustin Bros, presentando una nueva línea de personajes eran pequeños demonios o figuras simpáticas y traviesas con un estilo irreverente. Los objetos promocionales venían dentro de pequeñas cajas de cartón, y al abrirlas, se encontraba un Funki Punky 3D, una mini figura con un diseño especial. Cada llavero tenía una frase grabada en relieve, personalizada para cada personaje, lo que los hacía únicos y coleccionables. Esta promoción se destacaba por los personajes irreverentes y las frases personalizadas que le daban un carácter distintivo. La vigencia comenzó el 1 de febrero de 2007, extendiéndose hasta agotar existencias.",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      wrapperPhotoUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      promotionImagesUrls: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        "https://images.unsplash.com/photo-1594736797933-d0401ba5faab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      ],
      youtubeCommercialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      buffetGamesVideoUrl: "https://www.youtube.com/watch?v=sample_funki_buffet",
      startYear: 2007,
      endYear: 2007,
      category: "llaveros",
      createdAt: new Date(),
    };
    this.promotions.set(funkiPunky2007.id, funkiPunky2007);

    // Spiderman 3 2007
    const spiderman2007: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Spiderman 3",
      slug: "spiderman-3-2007",
      description: "En marzo de 2007, Vualá lanzó la promoción de 'Spiderman 3' para coincidir con el estreno de la película. Los consumidores podían encontrar en los paquetes de Vualá uno de los siguientes artículos: un sticker, un tatuaje, un colgante o un cupón canjeable. La colección incluía 5 colgantes diferentes, con diseños como la cabeza de spiderman, venom y los emblemas de los personajes, además el cupón canjeable te daba la oportunidad de cambiarlo por los clásicos pegajosos de Spiderman. La promoción comenzó el 15 de marzo de 2007 y se extendió hasta agotar existencias, atrayendo tanto a los fanáticos del personaje.",
      imageUrl: null,
      startYear: 2007,
      endYear: 2007,
      category: "colgantes",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(spiderman2007.id, spiderman2007);

    // Reyes de las Olas 2007
    const reyesOlas: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Tattoo Mania: Reyes de las Olas",
      slug: "reyes-de-las-olas",
      description: "En junio de 2007, Vualá lanzó la promoción 'Tattoo Mania: Reyes de las Olas', coincidiendo con el estreno de la película animada 'Reyes de las olas' (título original: 'Surf's Up'). Esta campaña ofrecía a los consumidores la oportunidad de encontrar en sus productos uno de los siguientes artículos promocionales: Tres mini tatuajes para parecer todo un surfero, Un colgante de surf de metal, representando elementos relacionados con el surf, Uno de los Tres pingüinos para colgar, basado en los personajes de la película. La promoción comenzó el 15 de junio de 2007 y se extendió hasta agotar existencias.",
      imageUrl: null,
      startYear: 2007,
      endYear: 2007,
      category: "tatuajes",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(reyesOlas.id, reyesOlas);

    // The Dog y The Cat 2007
    const dogCat2007: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "The Dog y The Cat",
      slug: "the-dog-cat-2007",
      description: "Regreso del fenómeno de los perritos con Artist Collection. Incluía Laser Stix con efectos holográficos y mascotas en miniatura de distintas razas de perros y gatos para colgar en celulares.",
      imageUrl: null,
      startYear: 2007,
      endYear: 2007,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(dogCat2007.id, dogCat2007);

    // Funki Punky Peores que nunca 2007-2008
    const funkiPeores: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Funki Punky: Peores que nunca",
      slug: "funki-punky-peores-que-nunca",
      description: "Segunda generación de Funki Punky con Richie, Skycat y Dot. Incluía Sticks, Funki Lápices, colgantes 3D (reimpresiones sin frase) y cupones canjeables por llaveros Chain.",
      imageUrl: null,
      startYear: 2007,
      endYear: 2008,
      category: "llaveros",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(funkiPeores.id, funkiPeores);

    // Fonomania 2.0 2008
    const fonomania: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Fonomanía 2.0",
      slug: "fonomania-2008",
      description: "Accesorios decorativos para celulares desarrollados por Faustin Bros basados en Skull Island. Incluía stickers (clásicos, láser y gotazos), colgantes emoji y kits premium con llaveros resistentes.",
      imageUrl: null,
      startYear: 2008,
      endYear: 2008,
      category: "accesorios",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(fonomania.id, fonomania);

    // Bob Esponja en Movimiento 2009
    const bobMovimiento: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Bob Esponja en Movimiento",
      slug: "bob-esponja-movimiento",
      description: "En abril de 2009, Vualá lanzó la promoción 'Bob Esponja en Movimiento', vigente del 5 de abril al 29 de mayo, en medio de una etapa complicada en México debido a la crisis de la influenza, lo que hizo que esta colección pasara casi desapercibida. La promoción ofrecía a los consumidores tres artículos promocionales: Stix: calcomanías con diseños de Bob Esponja y sus amigos. Lanzadiscos: cada paquete incluía un lanzador con un disco, un sticker decorativo y una bolsita. Este diseño se destacaba por ser inusual para las promociones de la época. Cupones canjeables: que ofrecían premios adicionales. Los lanzadiscos, aunque curiosos, no lograron captar la atención y pasaron desapercibidos. La presentación de la colección incluyó un logo colorido de Vualá con letras multicolores y un fondo naranja, marcando una desviación del diseño tradicional y buscando atraer a un público más infantil. Este diseño del rostro de Bob Esponja marcó una pauta para colecciones posteriores, aunque esta fue la única con el logo de letras de colores.",
      imageUrl: null,
      startYear: 2009,
      endYear: 2009,
      category: "juguetes",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(bobMovimiento.id, bobMovimiento);

    // CMLL 2009
    const cmll: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "CMLL Vualá",
      slug: "cmll-2009",
      description: "En septiembre de 2009, Vualá lanzó la promoción 'CMLL Vualá', vigente del 1 de septiembre al 5 de diciembre de 2009. Esta colección, en colaboración con el Consejo Mundial de Lucha Libre (CMLL), presentaba 9 figuras conocidas como 'Lucha-Attacks', representando a destacados luchadores mexicanos: Negro Casas, Último Guerrero, Héctor Garza, Shocker, Dos Caras Jr., Místico, Atlantis, Volador y Logo del CMLL. Los 'Lucha-Attacks' eran spinners monocromáticos con imágenes de los luchadores, diseñados para girar al ser lanzados. Algunas piezas tenían la característica especial de brillar en la oscuridad, añadiendo un elemento atractivo para los coleccionistas. El juego asociado a los 'Lucha-Attacks' consistía en enfrentar dos spinners lanzándolos simultáneamente. El objetivo era que uno de los spinners golpeara al otro, y el que permaneciera girando por más tiempo o lograra derribar al oponente se consideraba el ganador. Esta dinámica simulaba un combate de lucha libre, permitiendo a los aficionados recrear enfrentamientos entre sus luchadores favoritos.",
      imageUrl: null,
      startYear: 2009,
      endYear: 2009,
      category: "spinners",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: "https://www.youtube.com/watch?v=sample_cmll_buffet",
      createdAt: new Date(),
    };
    this.promotions.set(cmll.id, cmll);

    // Funki Punky Rebeldes con Causa 2010
    const funkiRebeldes: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Funki Punky: Rebeldes con Causa",
      slug: "funki-punky-rebeldes-causa",
      description: "En enero de 2010, Vualá lanzó la promoción 'Funki Punky: Rebeldes con Causa', vigente desde el 1 de enero hasta agotar existencias. Esta colección, desarrollada por Faustin Bros, fue la tercera entrega de la serie Funki Punky, presentando una temática de rebeldía y unión, con lemas como 'Tú también, ayuda a tus amigos', enfatizando valores de amistad y solidaridad. Artículos promocionales incluidos: Funky Lápiz: decoralápices con figuras de los personajes Funki Punky, diseñados para colocarse en la parte superior de los lápices. Funky Clip: sujetadores o clips con diseños alusivos a la serie, utilizados para sujetar papeles. Puffy Colgante: llaveros de plástico con una esponja en su interior, tipo apachurrable, representando a los personajes de la colección. Cupón Canjeable: para obtener premios adicionales o completar la colección. Una característica notable de esta promoción fue la introducción del diseño de Kato Emo, donde el personaje Kato aparecía con un peinado emo y un cinturón, marcando una evolución en su apariencia.",
      imageUrl: null,
      startYear: 2010,
      endYear: 2010,
      category: "accesorios",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(funkiRebeldes.id, funkiRebeldes);

    // Vive el Futbol con Huevos 2010
    const huevoCartoon: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Vive el Fútbol con Huevos",
      slug: "huevo-cartoon-2010",
      description: "En abril de 2010, Vualá lanzó la promoción 'Vive el Fútbol con Huevos de Huevocartoon', vigente del 5 de abril al 30 de julio de 2010. Esta colección presentaba 8 colgantes para celular de alta calidad y diseño, inspirados en personajes icónicos de Huevocartoon, como los Huevos Rancheros y los Huevos Poeta. La promoción coincidió con la fiebre futbolística del año, ofreciendo a los consumidores la oportunidad de coleccionar estos accesorios únicos.",
      imageUrl: null,
      startYear: 2010,
      endYear: 2010,
      category: "colgantes",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(huevoCartoon.id, huevoCartoon);

    // The Dog 2010
    const theDog2010: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "The Dog 2010",
      slug: "the-dog-2010",
      description: "Regreso de The Dog después de 6 años con 12 figuras 'Mordelones' y 'Ventosas' para superficies lisas. Incluía portalápices y figuras planas con ventosa.",
      imageUrl: null,
      startYear: 2010,
      endYear: 2010,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(theDog2010.id, theDog2010);

    // El Chavo Animado 2010
    const chavoAnimado: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "El Chavo Animado",
      slug: "chavo-animado-2010",
      description: "Promoción basada en la versión animada de El Chavo del Ocho, una de las series más queridas de la televisión mexicana.",
      imageUrl: null,
      startYear: 2010,
      endYear: 2010,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(chavoAnimado.id, chavoAnimado);

    // Aliens Eco-Invasores 2011
    const ecoInvasores: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Aliens Eco-Invasores",
      slug: "aliens-eco-invasores",
      description: "Seis personajes extraterrestres con mensajes ecológicos: Tento, Grin, Gard, Terrix, Luk y Fort. Incluía Navitrones, Pegatronix con ventosas y Cliptones que brillaban en la oscuridad.",
      imageUrl: null,
      startYear: 2011,
      endYear: 2011,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(ecoInvasores.id, ecoInvasores);

    // Funki Punky Extremo 2011
    const funkiExtremo: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Funki Punky Extremo",
      slug: "funki-punky-extremo",
      description: "Temática de deportes extremos con personajes en skateboarding, surf y motocross. Incluía 11 Giga Tazos grandes, 16 Rebotazos con borde de goma y Lanza Discos.",
      imageUrl: null,
      startYear: 2011,
      endYear: 2011,
      category: "tazos",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(funkiExtremo.id, funkiExtremo);

    // Bob Esponja 2012
    const bob2012: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Bob Esponja 2012",
      slug: "bob-esponja-2012",
      description: "Promoción más pequeña de Vualá con 8 artículos: 4 Pega Bob Esponja (figuras monocromáticas con base) y 4 Deco Bob Esponja (decoralápices transparentes), ambos con stickers para personalizar.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(bob2012.id, bob2012);

    // El Chavo 2012
    const chavo2012: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "El Chavo 2012",
      slug: "chavo-2012",
      description: "Homenaje a El Chavo del Ocho con 10 figuras coleccionables: 9 plateadas (Don Ramón, Doña Florinda, La Popis, etc.) y 1 dorada especial (El Chavo en su barril).",
      imageUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(chavo2012.id, chavo2012);

    // La Era del Hielo 4 2012
    const eraHielo: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "La Era del Hielo 4",
      slug: "era-hielo-4",
      description: "Colaboración con la película incluía Giga Qbitazos de gran tamaño con personajes principales y Decoralápices de Manny, Scrat y el Capitán Tripa.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "tazos",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(eraHielo.id, eraHielo);

    // Los Simpson 2012
    const simpson2012: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Los Simpson Juegos Olímpicos",
      slug: "simpson-olimpicos-2012",
      description: "Coincidiendo con los Juegos Olímpicos de Londres 2012. Incluía Giga Tazos Ultra Prismáticos y 12 Tazos Flock de Peluche con personajes en situaciones deportivas.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2012,
      category: "tazos",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(simpson2012.id, simpson2012);

    // Angry Birds Space 2012-2013
    const angryBirdsSpace: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Angry Birds Space",
      slug: "angry-birds-space",
      description: "16 Giga Vualá Tazos (8 prismatic, 8 gold) con personajes espaciales y 5 Decoralápices personalizables. Los tazos podían unirse para construir estructuras del juego.",
      imageUrl: null,
      startYear: 2012,
      endYear: 2013,
      category: "tazos",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(angryBirdsSpace.id, angryBirdsSpace);

    // Plantas vs Zombies 2013
    const plantasZombies2013: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Plantas vs Zombies",
      slug: "plantas-zombies-2013",
      description: "Complemento a la serie de tazos de Gamesa y Sabritas. Incluía Giga Master Tazos y 5 Llaveros Puff esponjosos de personajes como Girasol, Zombie Globo y Zombie Saltarín.",
      imageUrl: null,
      startYear: 2013,
      endYear: 2013,
      category: "llaveros",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(plantasZombies2013.id, plantasZombies2013);

    // El Show de los Looney Tunes 2013
    const looneyTunes: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "El Show de los Looney Tunes",
      slug: "looney-tunes-2013",
      description: "9 llaveros monocromáticos de personajes icónicos como Bugs Bunny, Pato Lucas, Taz y Marvin el Marciano. Incluía stickers para personalizar cada personaje.",
      imageUrl: null,
      startYear: 2013,
      endYear: 2013,
      category: "llaveros",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(looneyTunes.id, looneyTunes);

    // Super Funki Punky 2013
    const superFunki: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Super Funki Punky",
      slug: "super-funki-punky-2013",
      description: "Giga Tazos con materiales Gold y Ultra Prismatic mostrando parodias de cultura pop, y 10 Decoralápices de personajes como Monty, Tico, Emma y Richie. Introdujo el sabor fresa.",
      imageUrl: null,
      startYear: 2013,
      endYear: 2013,
      category: "tazos",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(superFunki.id, superFunki);

    // Pingüinos de Madagascar 2014
    const pinguinos2014: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Pingüinos de Madagascar",
      slug: "pinguinos-madagascar-2014",
      description: "Lanza Chorros monocromáticos inspirados en los personajes de la película. Presentó el sabor fresa en los productos con la imagen del Rey Julien en el empaque.",
      imageUrl: null,
      startYear: 2014,
      endYear: 2014,
      category: "juguetes",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(pinguinos2014.id, pinguinos2014);

    // Hora de Aventura 2014
    const aventura2014: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Hora de Aventura 2014",
      slug: "hora-aventura-2014",
      description: "10 Lanzachorros monocromáticos de personajes como Finn, Jake, la Dulce Princesa y el Rey Helado. Incluía stickers para personalizar y sabor a fresa.",
      imageUrl: null,
      startYear: 2014,
      endYear: 2014,
      category: "juguetes",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(aventura2014.id, aventura2014);

    // Las Tortugas Ninja 2014
    const tortugasNinja: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Las Tortugas Ninja",
      slug: "tortugas-ninja-2014",
      description: "8 llaveros diferentes con variante dorada, 4 Dedilocos de plástico suave con orificios para dedos, stickers para decorar y cupones 2x1 para Cinémex.",
      imageUrl: null,
      startYear: 2014,
      endYear: 2014,
      category: "llaveros",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(tortugasNinja.id, tortugasNinja);

    // Angry Birds GO 2014-2015
    const angryBirdsGO: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Angry Birds GO!",
      slug: "angry-birds-go",
      description: "9 figuras del juego de carreras incluyendo Red Dorado como edición limitada especial. Las figuras venían monocromáticas con stickers para personalizar.",
      imageUrl: null,
      startYear: 2014,
      endYear: 2015,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(angryBirdsGO.id, angryBirdsGO);

    // El Chavo Mini 2016
    const chavoMini: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "El Chavo Mini",
      slug: "chavo-mini-2016",
      description: "9 figuras Dedazos con diseño estilo Funko Pop de ojos negros: El Chavo, El Chapulín Colorado, Quico, Don Ramón y Ñoño. Aspecto caricaturesco distintivo.",
      imageUrl: null,
      startYear: 2016,
      endYear: 2016,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(chavoMini.id, chavoMini);

    // Bob Esponja 2017-2018
    const bob2017: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Bob Esponja 2017",
      slug: "bob-esponja-2017",
      description: "Regreso de Vualá con nueva administración. 18 juguetes diferentes incluyendo spinners, llaveros y figuras. Empaque blanco con Bob Esponja y Gary. Duró 9 meses.",
      imageUrl: null,
      startYear: 2017,
      endYear: 2018,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(bob2017.id, bob2017);

    // Hora de Aventura 2018
    const aventura2018: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Hora de Aventura 2018",
      slug: "hora-aventura-2018",
      description: "14 juguetes: 4 llaveros con stickers, 4 fidget spinners, 4 figuras con stickers, 1 figura de goma de Jake y 1 Finn dorado en pose de batalla.",
      imageUrl: null,
      startYear: 2018,
      endYear: 2018,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(aventura2018.id, aventura2018);

    // Corazones Vualá 2019
    const corazones2019: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Corazones Vualá",
      slug: "corazones-vuala-2019",
      description: "20 caps diferentes diseñados por artista mexicano con motivos de corazones. Cada cap incluía sticker personalizable. Diseños únicos como corazón rockero, luchador, ángel y rapero.",
      imageUrl: null,
      startYear: 2019,
      endYear: 2019,
      category: "caps",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(corazones2019.id, corazones2019);

    // Cartoon Network 2019-2020
    const cartoonNetwork: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Cartoon Network",
      slug: "cartoon-network-2019",
      description: "18 figuras 2D de personajes icónicos como Steven Universe, Gumball, Johnny Bravo, Dexter, Jake el Perro, las Chicas Superpoderosas y Ben 10. Cada figura con calcomanía.",
      imageUrl: null,
      startYear: 2019,
      endYear: 2020,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(cartoonNetwork.id, cartoonNetwork);

    // Teen Titans GO 2020
    const teenTitans: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Teen Titans GO!",
      slug: "teen-titans-go-2020",
      description: "20 piezas divididas en: 5 cabezas con stickers, 10 figuras con stickers y 5 llaveros con stickers de Robin, Starfire, Raven, Cyborg y Chico Bestia.",
      imageUrl: null,
      startYear: 2020,
      endYear: 2020,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(teenTitans.id, teenTitans);

    // Steven Universe 2020-2021
    const stevenUniverse: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Steven Universe",
      slug: "steven-universe-2020",
      description: "20 piezas: 13 figuras 2D con stickers y 7 llaveros de personajes principales. Afectada por NOM-051 que retiró imágenes de personajes de empaques durante la promoción.",
      imageUrl: null,
      startYear: 2020,
      endYear: 2021,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(stevenUniverse.id, stevenUniverse);

    // Funki Tubers 2021
    const funkiTubers: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Pinky Pow Funki Tubers",
      slug: "funki-tubers-2021",
      description: "Relanzamiento de Funki Punky por Panitas Foods. 5 Pinky Toys con sudaderas y cubrebocas, 6 Funkeys de goma, 42 caps cuadrados con frases actuales y 14 caps especiales prismáticos.",
      imageUrl: null,
      startYear: 2021,
      endYear: 2021,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(funkiTubers.id, funkiTubers);

    // Among Us 2021-2022
    const amongUs: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Among Us",
      slug: "among-us-2021",
      description: "117 variantes de figuras 'Spoks' en plástico rígido: 19 azules, 19 verdes, 38 transparentes, 38 negras y 3 de impostores. Estilo similar a los hielocos de Coca-Cola.",
      imageUrl: null,
      startYear: 2021,
      endYear: 2022,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(amongUs.id, amongUs);

    // XOXO Mascotas 2022
    const xoxoMascotas: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "XOXO Mascotas",
      slug: "xoxo-mascotas-2022",
      description: "Creada por Faustin Bros. 15 figuras X-Toys, 15 Caps XL, 5 llaveros y 3 figuras BOLD especiales de mayor rareza. Destacó por su calidad y diversidad.",
      imageUrl: null,
      startYear: 2022,
      endYear: 2022,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(xoxoMascotas.id, xoxoMascotas);

    // Villanos 2022
    const villanos2022: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Villanos",
      slug: "villanos-2022",
      description: "10 Villanos de Bolsillo, 20 Amuletos Malvados y 3 Figuras BOLD (Meanie Toys) de Black Hat, Dr. Flug y 5.0.5. Logo adaptado con la V de Villanos. Última aparición de Vualá Bold.",
      imageUrl: null,
      startYear: 2022,
      endYear: 2022,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(villanos2022.id, villanos2022);

    // Plantas vs Zombies 2022-2023
    const plantasZombies2022: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Plantas vs Zombies 2022",
      slug: "plantas-zombies-2022",
      description: "Vualá Sorpresa: 10 figuras de plástico suave, 30 caps delgadas (20 + 10 variantes) y 10 llaveros de goma con personajes como Zombie All-Star, Lanzaguisantes y Cactus.",
      imageUrl: null,
      startYear: 2022,
      endYear: 2023,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(plantasZombies2022.id, plantasZombies2022);

    // Pokémon 2023
    const pokemon2023: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Pokémon TCG",
      slug: "pokemon-tcg-2023",
      description: "30 tarjetas del Juego de Cartas Coleccionables de la era Espada y Escudo, incluyendo Mewtwo, Pikachu, Dragonite y Gengar. Recibió críticas por baja calidad percibida.",
      imageUrl: null,
      startYear: 2023,
      endYear: 2023,
      category: "cartas",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(pokemon2023.id, pokemon2023);

    // Pinky Pow Punks 2023
    const pinkyPowPunks: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Pinky Pow Punks",
      slug: "pinky-pow-punks-2023",
      description: "11 personajes en 5 variantes cada uno (color, monocromática, cristal, glow, cromática) = 55 figuras. Richie Dorado limitado a 400 piezas. Evento 'Encuéntranos el Tour' en Guadalajara.",
      imageUrl: null,
      startYear: 2023,
      endYear: 2023,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(pinkyPowPunks.id, pinkyPowPunks);

    // Angry Birds 2023-2024
    const angryBirds2023: Promotion = {
      id: randomUUID(),
      brandId: vuala.id,
      name: "Angry Birds 2023",
      slug: "angry-birds-2023",
      description: "28 figuras en versiones color y translúcidas, 14 caps metálicos, 8 mega caps especiales y Red Dorado limitado a 2,000 piezas. Figuras de alta calidad muy apreciadas.",
      imageUrl: null,
      startYear: 2023,
      endYear: 2024,
      category: "figuras",
      wrapperPhotoUrl: null,
      promotionImagesUrls: null,
      youtubeCommercialUrl: null,
      buffetGamesVideoUrl: null,
      createdAt: new Date(),
    };
    this.promotions.set(angryBirds2023.id, angryBirds2023);
    
    // Add some sample items for the first few promotions
    const europaItem1: PromotionItem = {
      id: randomUUID(),
      promotionId: europaPromotion.id,
      name: "Postal Torre Eiffel",
      description: "Postal ilustrada de la Torre Eiffel de París, parte de la colección Europa",
      imageUrl: null,
      rarity: "common",
      itemNumber: 1,
      metadata: { country: "Francia", landmark: "Torre Eiffel" },
      createdAt: new Date(),
    };
    this.promotionItems.set(europaItem1.id, europaItem1);

    const dogItem1: PromotionItem = {
      id: randomUUID(),
      promotionId: theDog2004.id,
      name: "Golden Retriever",
      description: "Miniatura de Golden Retriever de la colección Artist Collection",
      imageUrl: null,
      rarity: "rare",
      itemNumber: 1,
      metadata: { breed: "Golden Retriever", type: "miniature" },
      createdAt: new Date(),
    };
    this.promotionItems.set(dogItem1.id, dogItem1);

    const bobItem1: PromotionItem = {
      id: randomUUID(),
      promotionId: bobEsponja2005.id,
      name: "Llavero Bob Esponja",
      description: "Llavero de goma de Bob Esponja con su icónica sonrisa",
      imageUrl: null,
      rarity: "common",
      itemNumber: 1,
      metadata: { character: "Bob Esponja", material: "goma" },
      createdAt: new Date(),
    };
    this.promotionItems.set(bobItem1.id, bobItem1);

    // Keep existing items from other brands
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

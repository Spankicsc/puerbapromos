import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import HeroSection from "@/components/hero-section";
import BrandCard from "@/components/brand-card";
import PromotionCard from "@/components/promotion-card";
import { type Brand, type Promotion } from "@shared/schema";

const Home = () => {
  const { data: brands, isLoading: brandsLoading } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
    staleTime: 0, // Forzar refrescos
  });

  const { data: promotions, isLoading: promotionsLoading } = useQuery<Promotion[]>({
    queryKey: ['/api/promotions'],
    staleTime: 0, // Forzar refrescos
  });

  const getFeaturedPromotions = () => {
    if (!promotions) return [];
    
    // Seleccionar promociones destacadas específicas por nombre exacto
    const featuredNames = [
      "Spiderman 3", // Promoción icónica de Sabritas
      "Angry Birds Go", // Popular de Vualá
      "Funki Punky Xtremo" // Popular de Vualá
    ];
    
    const featured = featuredNames
      .map(name => promotions.find(p => p.name === name))
      .filter((p): p is Promotion => p !== undefined);
    
    // Si no encontramos todas, completamos con las primeras disponibles que tengan imágenes
    if (featured.length < 3) {
      const remaining = promotions
        .filter(p => !featuredNames.includes(p.name))
        .filter(p => p.wrapperPhotoUrl || (p.wrapperPhotosUrls && p.wrapperPhotosUrls.length > 0))
        .slice(0, 3 - featured.length);
      featured.push(...remaining);
    }
    
    return featured.slice(0, 3);
  };

  const getPromotionCount = (brandId: string) => {
    if (!promotions) return 0;
    return promotions.filter(promotion => promotion.brandId === brandId).length;
  };

  const getBrandName = (brandId: string) => {
    if (!brands) return undefined;
    return brands.find(brand => brand.id === brandId)?.name;
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Buffet Games Welcome Section */}
      <section className="bg-gradient-to-br from-promo-yellow/10 to-amber-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
              <img 
                src="/attached_assets/logo buffet games_1763678210970.PNG" 
                alt="Buffet Games" 
                className="w-full max-w-md object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                data-testid="buffet-games-logo"
              />
            </div>
            
            {/* Welcome Text */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-promo-black mb-4">
                  Bienvenido al rincón de la nostalgia y el coleccionismo
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Soy <span className="font-bold text-promo-black">Spanki</span>, un entusiasta empedernido de los objetos promocionales — esos tazos, figuras, juguetes de cereal y ediciones limitadas que marcaron nuestra infancia y hoy nos hablan de historia, emoción y recuerdos.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-700 leading-relaxed">
                  Aquí colaboro con <span className="font-bold text-promo-black">Buffet Games</span>, una comunidad con sede en Ciudad de México que tiene como misión rescatar, mostrar y compartir las joyas del coleccionismo promocional: piezas que muchos tuvimos, otros olvidaron, y algunos atesoran como verdaderos tesoros.
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Este sitio es para ti, que sabes que un "regalo con…" no era solo un extra, sino una aventura, una memoria y parte de la identidad de infancia. Juntos, con Buffet Games y conmigo, exploraremos colecciones, historias detrás de cada pieza, lanzamientos que marcaron generaciones, y por qué estos objetos promocionales tienen un valor que va más allá de lo material.
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  Acompáñanos en este viaje: descubre rarezas, intercambios, anécdotas de mercadillos y piezas míticas, revive ese entusiasmo de "¿lo encuentro o no?" y forma parte de una comunidad donde los promocionales no se consideran juguetes olvidados, sino piezas clave de nuestra historia personal.
                </p>
              </div>
              
              <div className="pt-4 border-t-2 border-promo-yellow">
                <p className="text-xl font-bold text-promo-yellow">
                  ¡Bienvenido a la comunidad que ama lo que fue y atesora lo que permanece!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Brands Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-promo-black mb-6">Marcas Populares</h3>
        
        {brandsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands?.map((brand) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                promotionCount={getPromotionCount(brand.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Promotions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-promo-black">Promociones Destacadas</h3>
          <span className="text-promo-yellow hover:text-yellow-600 font-semibold cursor-pointer">
            Ver todas →
          </span>
        </div>
        
        {promotionsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFeaturedPromotions().map((promotion) => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                brandName={getBrandName(promotion.brandId)}
                itemCount={Math.floor(Math.random() * 100) + 20} // Mock item count for display
              />
            ))}
          </div>
        )}
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-promo-yellow mb-2" data-testid="stat-total-promotions">
              {promotions?.length || 0}
            </div>
            <div className="text-gray-600">Promociones</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-promo-yellow mb-2" data-testid="stat-total-brands">
              {brands?.length || 0}
            </div>
            <div className="text-gray-600">Marcas</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-promo-yellow mb-2">30+</div>
            <div className="text-gray-600">Años de Historia</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-promo-yellow mb-2">100+</div>
            <div className="text-gray-600">Items Catalogados</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

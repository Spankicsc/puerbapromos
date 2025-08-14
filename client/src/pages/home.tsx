import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import HeroSection from "@/components/hero-section";
import BrandCard from "@/components/brand-card";
import PromotionCard from "@/components/promotion-card";
import { type Brand, type Promotion } from "@shared/schema";

const Home = () => {
  const { data: brands, isLoading: brandsLoading } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  const { data: promotions, isLoading: promotionsLoading } = useQuery<Promotion[]>({
    queryKey: ['/api/promotions'],
  });

  const getFeaturedPromotions = () => {
    if (!promotions) return [];
    
    // Seleccionar promociones destacadas específicas por nombre
    const featuredNames = [
      "Tazos", // El más icónico de todos
      "Funki Punky Extremo", // Muy popular de Barcel
      "Bob Esponja 2024" // Más reciente y popular
    ];
    
    const featured = featuredNames
      .map(name => promotions.find(p => p.name === name))
      .filter(Boolean);
    
    // Si no encontramos todas, completamos con las primeras disponibles
    if (featured.length < 3) {
      const remaining = promotions
        .filter(p => !featuredNames.includes(p.name))
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
    <div className="bg-promo-gray">
      <HeroSection />
      
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

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h3 className="text-2xl font-bold text-promo-black mb-6">Línea de Tiempo</h3>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-promo-yellow"></div>
            
            {/* Timeline Events */}
            <div className="relative flex items-start mb-8">
              <div className="absolute left-0 w-8 h-8 bg-promo-yellow rounded-full flex items-center justify-center z-10">
                <span className="text-promo-black font-bold text-sm">94</span>
              </div>
              <div className="ml-12">
                <h4 className="text-lg font-semibold text-promo-black">Nacen los Tazos</h4>
                <p className="text-gray-600">
                  Sabritas lanza la primera serie de Tazos, revolucionando el mercado de coleccionables en México.
                </p>
              </div>
            </div>

            <div className="relative flex items-start mb-8">
              <div className="absolute left-0 w-8 h-8 bg-promo-yellow rounded-full flex items-center justify-center z-10">
                <span className="text-promo-black font-bold text-sm">98</span>
              </div>
              <div className="ml-12">
                <h4 className="text-lg font-semibold text-promo-black">Era de los Stickers</h4>
                <p className="text-gray-600">
                  Barcel introduce Funki Punky, marcando el inicio de la era dorada de los stickers coleccionables.
                </p>
              </div>
            </div>

            <div className="relative flex items-start mb-8">
              <div className="absolute left-0 w-8 h-8 bg-promo-yellow rounded-full flex items-center justify-center z-10">
                <span className="text-promo-black font-bold text-sm">05</span>
              </div>
              <div className="ml-12">
                <h4 className="text-lg font-semibold text-promo-black">Diversificación</h4>
                <p className="text-gray-600">
                  Las marcas comienzan a experimentar con juguetes, figuras y promocionales más elaborados.
                </p>
              </div>
            </div>

            <div className="relative flex items-start">
              <div className="absolute left-0 w-8 h-8 bg-promo-yellow rounded-full flex items-center justify-center z-10">
                <span className="text-promo-black font-bold text-sm">17</span>
              </div>
              <div className="ml-12">
                <h4 className="text-lg font-semibold text-promo-black">Era Digital</h4>
                <p className="text-gray-600">
                  Los spinners y promocionales modernos marcan el regreso de las grandes promociones.
                </p>
              </div>
            </div>
          </div>
        </div>
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

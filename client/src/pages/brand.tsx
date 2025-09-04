import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import PromotionCard from "@/components/promotion-card";
import { type Brand, type Promotion } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import placeholderImage from "@assets/Generated Image September 04, 2025 - 12_42PM_1757011639528.jpeg";

const Brand = () => {
  const { slug } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [brandLoading, setBrandLoading] = useState(true);
  const [promotionsLoading, setPromotionsLoading] = useState(true);

  const fetchData = async () => {
    if (!slug) return;
    
    try {
      setBrandLoading(true);
      setPromotionsLoading(true);
      
      // Fetch brand info
      const brandResponse = await fetch(`/api/brands/${slug}`);
      if (brandResponse.ok) {
        const brandData = await brandResponse.json();
        setBrand(brandData);
        console.log('🏷️ [DEBUG] Marca cargada:', brandData);
      }
      setBrandLoading(false);
      
      // Fetch promotions with timestamp to bypass cache
      const timestamp = new Date().getTime();
      const promotionsResponse = await fetch(`/api/brands/${slug}/promotions?t=${timestamp}`);
      if (promotionsResponse.ok) {
        const promotionsData = await promotionsResponse.json();
        setPromotions(promotionsData);
        console.log(`🔍 [DEBUG] Promociones cargadas para ${slug}:`, promotionsData?.length || 0);
        console.log('📋 [DEBUG] Datos completos:', promotionsData);
      }
      setPromotionsLoading(false);
    } catch (error) {
      console.error('❌ [DEBUG] Error cargando datos:', error);
      setBrandLoading(false);
      setPromotionsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const handleRefresh = async () => {
    console.log('🔄 [DEBUG] Refrescando datos...');
    await fetchData();
  };

  if (brandLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="h-12 w-96 mb-4" />
          <Skeleton className="h-6 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-promo-black mb-4">Marca no encontrada</h2>
            <p className="text-gray-600 mb-8">La marca que buscas no existe o ha sido movida.</p>
            <Link href="/" data-testid="link-back-home">
              <Button className="bg-promo-yellow text-promo-black hover:bg-yellow-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sort promotions by start year (chronological order)
  const sortedPromotions = promotions?.slice().sort((a, b) => a.startYear - b.startYear);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" data-testid="breadcrumb-home">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage data-testid="breadcrumb-brand">{brand.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Brand Header */}
        <div className="card-splat p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div 
              className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {brand.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-promo-black mb-2" data-testid="text-brand-name">
                {brand.name}
              </h1>
              <p className="text-gray-600 mb-4" data-testid="text-brand-description">
                {brand.description}
              </p>
              {brand.founded && (
                <p className="text-sm text-gray-500">
                  Fundada en {brand.founded}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Promotions Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-promo-black">
              Promociones de {brand.name}
            </h2>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={promotionsLoading}
                data-testid="button-refresh"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${promotionsLoading ? 'animate-spin' : ''}`} />
                Refrescar
              </Button>
              <span className="text-sm text-gray-500" data-testid="text-promotions-count">
                {promotions?.length || 0} promociones
              </span>
            </div>
          </div>

          {promotionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[400px] rounded-xl" />
              ))}
            </div>
          ) : promotions && promotions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPromotions.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  promotion={promotion}
                  brandName={brand.name}
                  itemCount={Math.floor(Math.random() * 100) + 20} // Mock item count
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="mb-6">
                <img 
                  src={placeholderImage} 
                  alt={`Próximamente promociones de ${brand.name}`}
                  className="mx-auto max-w-md w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <h3 className="text-xl font-semibold text-promo-black mb-2">
                Próximamente
              </h3>
              <p className="text-gray-600">
                Estamos trabajando en catalogar las promociones de {brand.name}. ¡Regresa pronto para ver todo el contenido!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Brand;

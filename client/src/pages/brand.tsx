import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import PromotionCard from "@/components/promotion-card";
import { type Brand, type Promotion } from "@shared/schema";

const Brand = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: brand, isLoading: brandLoading } = useQuery<Brand>({
    queryKey: ['/api/brands', slug],
    enabled: !!slug,
  });

  const { data: promotions, isLoading: promotionsLoading } = useQuery<Promotion[]>({
    queryKey: ['/api/brands', slug, 'promotions'],
    enabled: !!slug,
  });

  if (brandLoading) {
    return (
      <div className="bg-promo-gray min-h-screen">
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
      <div className="bg-promo-gray min-h-screen">
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

  return (
    <div className="bg-promo-gray min-h-screen">
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
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
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
            <span className="text-sm text-gray-500" data-testid="text-promotions-count">
              {promotions?.length || 0} promociones
            </span>
          </div>

          {promotionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[400px] rounded-xl" />
              ))}
            </div>
          ) : promotions && promotions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promotions.map((promotion) => (
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
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-promo-black mb-2">
                No hay promociones disponibles
              </h3>
              <p className="text-gray-600">
                Aún no hemos catalogado promociones para esta marca. ¡Regresa pronto para ver más contenido!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Brand;

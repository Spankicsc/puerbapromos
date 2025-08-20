import React from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Tag, Package } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { type Promotion, type PromotionItem, type Brand } from "@shared/schema";
import { EditablePromotion } from "@/components/EditablePromotion";
import { getBrandLogo } from "@/utils/brandLogos";

const Promotion = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: promotion, isLoading: promotionLoading } = useQuery<Promotion>({
    queryKey: ['/api/promotions', slug],
    enabled: !!slug,
  });

  const { data: items, isLoading: itemsLoading } = useQuery<PromotionItem[]>({
    queryKey: ['/api/promotions', slug, 'items'],
    enabled: !!slug,
  });

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  const getBrand = () => {
    if (!promotion || !brands) return null;
    return brands.find(brand => brand.id === promotion.brandId);
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return 'bg-gray-100 text-gray-800';
      case 'rare':
        return 'bg-blue-100 text-blue-800';
      case 'super_rare':
        return 'bg-purple-100 text-purple-800';
      case 'ultra_rare':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityLabel = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return 'Común';
      case 'rare':
        return 'Raro';
      case 'super_rare':
        return 'Super Raro';
      case 'ultra_rare':
        return 'Ultra Raro';
      default:
        return 'Común';
    }
  };

  if (promotionLoading) {
    return (
      <div className="bg-promo-gray min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="h-64 w-full mb-8 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="bg-promo-gray min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-promo-black mb-4">Promoción no encontrada</h2>
            <p className="text-gray-600 mb-8">La promoción que buscas no existe o ha sido movida.</p>
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

  const brand = getBrand();

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
            {brand && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/marcas/${brand.slug}`} data-testid="breadcrumb-brand">
                    {brand.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage data-testid="breadcrumb-promotion">{promotion.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Editable Promotion Component */}
        <div className="mb-8">
          <EditablePromotion 
            promotion={promotion}
            isEditable={true}
          />
        </div>

        {/* Items Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-promo-black">
              Colección de {promotion.name}
            </h2>
            <span className="text-sm text-gray-500" data-testid="text-items-count">
              {items?.length || 0} items
            </span>
          </div>

          {itemsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] rounded-xl" />
              ))}
            </div>
          ) : items && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-48 object-cover"
                        data-testid={`img-item-${item.id}`}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-promo-yellow to-yellow-400 flex items-center justify-center">
                        <span className="text-4xl">🎯</span>
                      </div>
                    )}
                    {item.rarity && (
                      <Badge 
                        className={`absolute top-2 right-2 text-xs ${getRarityColor(item.rarity)}`}
                      >
                        {getRarityLabel(item.rarity)}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-promo-black truncate" data-testid={`text-item-name-${item.id}`}>
                        {item.name}
                      </h3>
                      {item.itemNumber && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{item.itemNumber}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2" data-testid={`text-item-description-${item.id}`}>
                        {item.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aún no hay elementos en esta colección
              </h3>
              <p className="text-gray-500 mb-6">
                Los elementos de esta promoción se agregarán pronto.
              </p>
              <Link href="/promociones">
                <Button className="bg-promo-yellow text-promo-black hover:bg-yellow-500">
                  Ver otras promociones
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Promotion;
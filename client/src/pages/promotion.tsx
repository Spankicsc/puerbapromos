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
import { ImageUploadButton } from "@/components/ImageUploadButton";
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
    <div className="min-h-screen">
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

        {/* Promotion Header */}
        <div className="card-splat overflow-hidden mb-8">
          {promotion.imageUrl && (
            <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: `url(${promotion.imageUrl})` }}>
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center space-x-3 mb-2">
                  {brand && getBrandLogo(brand.slug) && (
                    <img 
                      src={getBrandLogo(brand.slug)!} 
                      alt={`${brand.name} logo`}
                      className="h-10 w-auto object-contain drop-shadow-lg"
                    />
                  )}
                  {brand && (
                    <Badge 
                      className="text-xs font-semibold"
                      style={{ 
                        backgroundColor: brand.primaryColor + '20',
                        color: brand.primaryColor
                      }}
                    >
                      {brand.name}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {promotion.startYear}{promotion.endYear ? `-${promotion.endYear}` : '-presente'}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-white" data-testid="text-promotion-name">
                  {promotion.name}
                </h1>
              </div>
            </div>
          )}
          
          <div className="p-8">
            {!promotion.imageUrl && (
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  {brand && getBrandLogo(brand.slug) && (
                    <img 
                      src={getBrandLogo(brand.slug)!} 
                      alt={`${brand.name} logo`}
                      className="h-8 w-auto object-contain drop-shadow-md"
                    />
                  )}
                  {brand && (
                    <Badge 
                      className="text-xs font-semibold"
                      style={{ 
                        backgroundColor: brand.primaryColor + '20',
                        color: brand.primaryColor
                      }}
                    >
                      {brand.name}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {promotion.startYear}{promotion.endYear ? `-${promotion.endYear}` : '-presente'}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-promo-black" data-testid="text-promotion-name">
                  {promotion.name}
                </h1>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Tag className="w-4 h-4" />
                <span className="capitalize">{promotion.category}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Package className="w-4 h-4" />
                <span>{items?.length || 0} items</span>
              </div>
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed" data-testid="text-promotion-description">
              {promotion.description}
            </p>
          </div>
        </div>

        {/* Additional Promotion Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Wrapper Photo Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-promo-black mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Foto de la Envoltura
              </h3>
              {promotion.wrapperPhotoUrl ? (
                <img 
                  src={promotion.wrapperPhotoUrl} 
                  alt={`Envoltura de ${promotion.name}`}
                  className="w-full h-64 object-cover rounded-lg"
                  data-testid="img-wrapper-photo"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Foto de envoltura no disponible</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* YouTube Commercial Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-promo-black mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a2.999 2.999 0 0 0-2.108-2.135C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.39.505A2.999 2.999 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.999 2.999 0 0 0 2.108 2.135c1.885.505 9.39.505 9.39.505s7.505 0 9.39-.505a2.999 2.999 0 0 0 2.108-2.135C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Comercial de YouTube
              </h3>
              {promotion.youtubeCommercialUrl ? (
                <div className="aspect-video">
                  <iframe
                    src={promotion.youtubeCommercialUrl.replace('watch?v=', 'embed/')}
                    title={`Comercial de ${promotion.name}`}
                    className="w-full h-full rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                    data-testid="iframe-youtube-commercial"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a2.999 2.999 0 0 0-2.108-2.135C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.39.505A2.999 2.999 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.999 2.999 0 0 0 2.108 2.135c1.885.505 9.39.505 9.39.505s7.505 0 9.39-.505a2.999 2.999 0 0 0 2.108-2.135C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <p>Comercial de YouTube no disponible</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buffet Games Video Section */}
        {promotion.buffetGamesVideoUrl && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              <h3 className="text-xl font-bold text-promo-black mb-4 flex items-center">
                <img 
                  src="/attached_assets/IMG_7040_1755142054930.PNG" 
                  alt="Buffet Games" 
                  className="w-6 h-6 mr-2 object-contain"
                />
                Video Explicativo de Buffet Games
              </h3>
              <div className="aspect-video">
                <iframe
                  src={promotion.buffetGamesVideoUrl.replace('watch?v=', 'embed/')}
                  title={`Video explicativo de ${promotion.name} por Buffet Games`}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allowFullScreen
                  data-testid="iframe-buffet-games-video"
                />
              </div>
            </div>
          </div>
        )}

        {/* Promotion Images Gallery */}
        {promotion.promotionImagesUrls && Array.isArray(promotion.promotionImagesUrls) && promotion.promotionImagesUrls.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              <h3 className="text-xl font-bold text-promo-black mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Imágenes de la Promoción
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {promotion.promotionImagesUrls.map((imageUrl: string, index: number) => (
                  <img 
                    key={index}
                    src={imageUrl}
                    alt={`Imagen promocional ${index + 1} de ${promotion.name}`}
                    className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    data-testid={`img-promotion-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

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
              <h3 className="text-xl font-semibold text-promo-black mb-2">
                No hay items disponibles
              </h3>
              <p className="text-gray-600">
                Aún no hemos catalogado items para esta promoción. ¡Regresa pronto para ver más contenido!
              </p>
            </div>
          )}
        </section>

        {/* Admin Section for Image Upload */}
        <section className="card-splat overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-promo-black mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-promo-yellow" />
              Administración de Imágenes
            </h3>
            <p className="text-gray-600 mb-4">
              Sube nuevas imágenes para esta promoción. Las imágenes se guardarán de forma segura en el almacenamiento en la nube.
            </p>
            <div className="flex justify-start">
              <ImageUploadButton 
                promotionSlug={slug!} 
                onImageUploaded={(url) => {
                  console.log("Nueva imagen subida:", url);
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Promotion;

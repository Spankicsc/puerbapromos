import React, { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Tag, Package, Edit2, Save, X, Plus, Trash2, Youtube, Video } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Promotion, type PromotionItem, type Brand } from "@shared/schema";
import { EditablePromotion } from "@/components/EditablePromotion";
import { WrapperCarousel } from "@/components/WrapperCarousel";
import { getBrandLogo } from "@/utils/brandLogos";
import { getYouTubeEmbedUrl } from "@/utils/youtube";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Promotion = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPromotion, setEditedPromotion] = useState<Partial<Promotion>>({});
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (updateData: Partial<Promotion>) => {
      if (!promotion) throw new Error('No promotion data');
      return await apiRequest('PUT', `/api/promotions/${promotion.id}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promotions'] });
      toast({
        title: 'Promoción actualizada',
        description: 'Los cambios se han guardado correctamente.',
      });
      setIsEditing({});
      setEditedPromotion({});
    },
    onError: (error) => {
      console.error('Error updating promotion:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la promoción.',
        variant: 'destructive',
      });
    },
  });
  
  const startEditing = (field: string) => {
    if (!promotion) return;
    setIsEditing({ ...isEditing, [field]: true });
    setEditedPromotion({ 
      ...editedPromotion, 
      [field]: promotion[field as keyof Promotion] 
    });
  };
  
  const cancelEditing = (field: string) => {
    setIsEditing({ ...isEditing, [field]: false });
    setEditedPromotion({ ...editedPromotion, [field]: undefined });
  };
  
  const saveField = (field: string) => {
    const updateData: any = {};
    
    if (field === 'tags') {
      updateData.tags = editedPromotion.tags || [];
    } else if (field === 'description') {
      updateData.description = editedPromotion.description || '';
    } else if (field === 'youtubeCommercialUrl') {
      updateData.youtubeCommercialUrl = editedPromotion.youtubeCommercialUrl;
    } else if (field === 'buffetGamesVideoUrl') {
      updateData.buffetGamesVideoUrl = editedPromotion.buffetGamesVideoUrl;
    } else if (field === 'years') {
      updateData.startYear = editedPromotion.startYear;
      updateData.endYear = editedPromotion.endYear;
    }
    
    updateMutation.mutate(updateData);
    setIsEditing({ ...isEditing, [field]: false });
  };
  
  const addPromotionImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          if (imageUrl && promotion) {
            const currentUrls = Array.isArray(promotion.promotionImagesUrls) ? promotion.promotionImagesUrls : [];
            updateMutation.mutate({
              promotionImagesUrls: [...currentUrls, imageUrl],
            });
          }
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  };
  
  const removePromotionImage = (index: number) => {
    if (!promotion || !Array.isArray(promotion.promotionImagesUrls)) return;
    const updatedImages = promotion.promotionImagesUrls.filter((_, i) => i !== index);
    updateMutation.mutate({
      promotionImagesUrls: updatedImages.length > 0 ? updatedImages : null,
    });
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

        {/* Edit Mode Toggle */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            variant={isEditMode ? "default" : "outline"}
            className={isEditMode ? "bg-promo-yellow text-promo-black hover:bg-yellow-500" : ""}
          >
            {isEditMode ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Salir de edición
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Modo edición
              </>
            )}
          </Button>
        </div>

        {/* Status indicator for edit mode */}
        {isEditMode && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded-r">
            <div className="flex">
              <Edit2 className="w-5 h-5 text-yellow-500 mr-2" />
              <p className="text-sm text-yellow-800">
                <strong>Modo de edición activado:</strong> Ahora puedes editar las imágenes directamente. Haz clic en "Editar" en las secciones de envolturas para rotar imágenes, agregar nuevas o eliminar existentes.
              </p>
            </div>
          </div>
        )}

        {/* Promotion Header - Layout Original */}
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
                  {isEditMode && !isEditing.years ? (
                    <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => startEditing('years')}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {promotion.startYear}{promotion.endYear ? `-${promotion.endYear}` : '-presente'}
                      <Edit2 className="w-2 h-2 ml-1" />
                    </Badge>
                  ) : isEditMode && isEditing.years ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={editedPromotion.startYear || promotion.startYear}
                        onChange={(e) => setEditedPromotion({ ...editedPromotion, startYear: parseInt(e.target.value) })}
                        className="w-16 h-6 text-xs bg-white border border-gray-300"
                        placeholder="Año inicio"
                      />
                      <span className="text-xs text-white">-</span>
                      <Input
                        type="number"
                        value={editedPromotion.endYear || promotion.endYear || ''}
                        onChange={(e) => setEditedPromotion({ ...editedPromotion, endYear: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-16 h-6 text-xs bg-white border border-gray-300"
                        placeholder="Año fin"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 bg-green-600 border-green-500 text-white hover:bg-green-700"
                        onClick={() => {
                          updateMutation.mutate({
                            startYear: editedPromotion.startYear || promotion.startYear,
                            endYear: editedPromotion.endYear !== undefined ? editedPromotion.endYear : promotion.endYear
                          });
                        }}
                      >
                        <Save className="w-2 h-2" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 bg-red-600 border-red-500 text-white hover:bg-red-700"
                        onClick={() => cancelEditing('years')}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {promotion.startYear}{promotion.endYear ? `-${promotion.endYear}` : '-presente'}
                    </Badge>
                  )}
                </div>
                {isEditMode && !isEditing.name ? (
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-white" data-testid="text-promotion-name">
                      {promotion.name}
                    </h1>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-black"
                      onClick={() => startEditing('name')}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </div>
                ) : isEditMode && isEditing.name ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedPromotion.name || promotion.name}
                      onChange={(e) => setEditedPromotion({ ...editedPromotion, name: e.target.value })}
                      className="text-3xl font-bold bg-white/90 text-black border-none"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-600 border-green-500 text-white hover:bg-green-700"
                      onClick={() => saveField('name')}
                      disabled={updateMutation.isPending}
                    >
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-600 border-red-500 text-white hover:bg-red-700"
                      onClick={() => cancelEditing('name')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <h1 className="text-3xl font-bold text-white" data-testid="text-promotion-name">
                    {promotion.name}
                  </h1>
                )}
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
                  {isEditMode && !isEditing.years ? (
                    <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => startEditing('years')}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {promotion.startYear}{promotion.endYear ? `-${promotion.endYear}` : '-presente'}
                      <Edit2 className="w-2 h-2 ml-1" />
                    </Badge>
                  ) : isEditMode && isEditing.years ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={editedPromotion.startYear || promotion.startYear}
                        onChange={(e) => setEditedPromotion({ ...editedPromotion, startYear: parseInt(e.target.value) })}
                        className="w-16 h-6 text-xs bg-white border border-gray-300"
                        placeholder="Año inicio"
                      />
                      <span className="text-xs text-white">-</span>
                      <Input
                        type="number"
                        value={editedPromotion.endYear || promotion.endYear || ''}
                        onChange={(e) => setEditedPromotion({ ...editedPromotion, endYear: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-16 h-6 text-xs bg-white border border-gray-300"
                        placeholder="Año fin"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 bg-green-600 border-green-500 text-white hover:bg-green-700"
                        onClick={() => {
                          updateMutation.mutate({
                            startYear: editedPromotion.startYear || promotion.startYear,
                            endYear: editedPromotion.endYear !== undefined ? editedPromotion.endYear : promotion.endYear
                          });
                        }}
                      >
                        <Save className="w-2 h-2" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 bg-red-600 border-red-500 text-white hover:bg-red-700"
                        onClick={() => cancelEditing('years')}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {promotion.startYear}{promotion.endYear ? `-${promotion.endYear}` : '-presente'}
                    </Badge>
                  )}
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
              {/* Tags */}
              <div className="flex items-center space-x-2 text-gray-600">
                {isEditMode && !isEditing.tags ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditing('tags')}
                    className="text-xs"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {Array.isArray(promotion.tags) && promotion.tags.length > 0 ? 'Editar etiquetas' : 'Agregar etiquetas'}
                  </Button>
                ) : isEditMode && isEditing.tags ? (
                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      value={editedPromotion.tags ? editedPromotion.tags.join(', ') : (Array.isArray(promotion.tags) ? promotion.tags.join(', ') : '')}
                      onChange={(e) => setEditedPromotion({ ...editedPromotion, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0) })}
                      placeholder="Ingresa etiquetas separadas por comas"
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveField('tags')}
                        disabled={updateMutation.isPending}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEditing('tags')}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : Array.isArray(promotion.tags) && promotion.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {promotion.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Sin etiquetas</span>
                )}
              </div>
            </div>
            
            {isEditMode && !isEditing.description ? (
              <div className="flex items-start gap-2">
                <p className="text-gray-700 text-lg leading-relaxed flex-1" data-testid="text-promotion-description">
                  {promotion.description}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEditing('description')}
                  className="text-xs"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Editar
                </Button>
              </div>
            ) : isEditMode && isEditing.description ? (
              <div className="space-y-3">
                <textarea
                  value={editedPromotion.description || promotion.description || ''}
                  onChange={(e) => setEditedPromotion({ ...editedPromotion, description: e.target.value })}
                  placeholder="Ingresa la descripción de la promoción"
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => saveField('description')}
                    disabled={updateMutation.isPending}
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Guardar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => cancelEditing('description')}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 text-lg leading-relaxed" data-testid="text-promotion-description">
                {promotion.description}
              </p>
            )}
          </div>
        </div>

        {/* Additional Promotion Content - Layout Original */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Wrapper Photos Section - New Carousel */}
          <div className="bg-promo-black rounded-xl shadow-lg overflow-hidden border border-yellow-400/30">
            <div className="p-6">
              <WrapperCarousel 
                wrapperPhotos={
                  promotion.wrapperPhotosUrls && promotion.wrapperPhotosUrls.length > 0 
                    ? promotion.wrapperPhotosUrls as string[]
                    : promotion.wrapperPhotoUrl 
                      ? [promotion.wrapperPhotoUrl] 
                      : null
                }
                promotionName={promotion.name}
                isEditable={isEditMode}
                promotionId={promotion.id}
                imageRotations={{ 0: promotion.wrapperRotation || 0 }}
              />
            </div>
          </div>

          {/* YouTube Commercial Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-promo-black flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.999 2.999 0 0 0-2.108-2.135C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.39.505A2.999 2.999 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.999 2.999 0 0 0 2.108 2.135c1.885.505 9.39.505 9.39.505s7.505 0 9.39-.505a2.999 2.999 0 0 0 2.108-2.135C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Comercial de YouTube
                </h3>
                {isEditMode && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditing('youtubeCommercialUrl')}
                    className="text-xs"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Editar URL
                  </Button>
                )}
              </div>
              {isEditing.youtubeCommercialUrl ? (
                <div className="space-y-3">
                  <Input
                    value={editedPromotion.youtubeCommercialUrl || promotion.youtubeCommercialUrl || ''}
                    onChange={(e) => setEditedPromotion({ ...editedPromotion, youtubeCommercialUrl: e.target.value })}
                    placeholder="Ingresa la URL del video de YouTube"
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => saveField('youtubeCommercialUrl')}
                      disabled={updateMutation.isPending}
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Guardar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelEditing('youtubeCommercialUrl')}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : promotion.youtubeCommercialUrl ? (
                <div className="aspect-video">
                  <iframe
                    src={getYouTubeEmbedUrl(promotion.youtubeCommercialUrl)}
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
                    <p className="text-sm">Sin comercial de YouTube</p>
                    {isEditMode && (
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => startEditing('youtubeCommercialUrl')}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Agregar video
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buffet Games Video Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-promo-black flex items-center">
                <img 
                  src="/attached_assets/buffet_games_logo.png" 
                  alt="Buffet Games Logo"
                  className="w-5 h-5 mr-2 object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    // Fallback si la imagen no existe
                    e.currentTarget.style.display = 'none';
                  }}
                />
                Video Explicativo de Buffet Games
              </h3>
              {isEditMode && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEditing('buffetGamesVideoUrl')}
                  className="text-xs"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Editar URL
                </Button>
              )}
            </div>
            {isEditing.buffetGamesVideoUrl ? (
              <div className="space-y-3">
                <Input
                  value={editedPromotion.buffetGamesVideoUrl || promotion.buffetGamesVideoUrl || ''}
                  onChange={(e) => setEditedPromotion({ ...editedPromotion, buffetGamesVideoUrl: e.target.value })}
                  placeholder="Ingresa la URL del video de Buffet Games"
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => saveField('buffetGamesVideoUrl')}
                    disabled={updateMutation.isPending}
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Guardar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => cancelEditing('buffetGamesVideoUrl')}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : promotion.buffetGamesVideoUrl ? (
              <div className="aspect-video">
                <iframe
                  src={getYouTubeEmbedUrl(promotion.buffetGamesVideoUrl)}
                  title={`Video explicativo de ${promotion.name} por Buffet Games`}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allowFullScreen
                  data-testid="iframe-buffet-games-video"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <p className="text-sm">Sin video de Buffet Games</p>
                  {isEditMode && (
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => startEditing('buffetGamesVideoUrl')}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Agregar video
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Elements Collection Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-promo-black">
              Elementos de la Colección
            </h2>
            <span className="text-sm text-gray-500" data-testid="text-items-count">
              {items?.length || 0} elementos • {(Array.isArray(promotion.promotionImagesUrls) ? promotion.promotionImagesUrls.length : 0)} imágenes
            </span>
          </div>

          {/* Promotion Images Gallery */}
          {(promotion.promotionImagesUrls && Array.isArray(promotion.promotionImagesUrls) && promotion.promotionImagesUrls.length > 0) || isEditMode ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-promo-black flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Imágenes Promocionales
                  </h3>
                  {isEditMode && (
                    <Button
                      size="sm"
                      onClick={addPromotionImage}
                      className="bg-promo-yellow text-promo-black hover:bg-yellow-400"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Imagen
                    </Button>
                  )}
                </div>
                {promotion.promotionImagesUrls && Array.isArray(promotion.promotionImagesUrls) && promotion.promotionImagesUrls.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {(promotion.promotionImagesUrls as string[]).map((imageUrl: string, index: number) => (
                      <div key={index} className="relative group">
                        <img 
                          src={imageUrl}
                          alt={`Imagen promocional ${index + 1} de ${promotion.name}`}
                          className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                          data-testid={`img-promotion-${index}`}
                        />
                        {isEditMode && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 w-8 h-8 p-0 bg-red-600 border-red-500 text-white hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePromotionImage(index)}
                            title="Eliminar imagen"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Sin Imágenes Promocionales
                    </h3>
                    <p className="text-gray-500 mb-4">
                      No hay imágenes promocionales disponibles
                    </p>
                    {isEditMode && (
                      <Button
                        onClick={addPromotionImage}
                        className="bg-promo-yellow text-promo-black hover:bg-yellow-400"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Primera Imagen
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Items Grid */}
          <h3 className="text-lg font-semibold text-promo-black mb-4">
            Elementos Coleccionables
          </h3>

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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar, Package, Tag, Filter, Edit, Plus, GripVertical } from "lucide-react";
import { useState } from "react";
import { type Promotion, type Brand } from "@shared/schema";
import { EditablePromotion } from "@/components/EditablePromotion";
import { CreatePromotionDialog } from "@/components/CreatePromotionDialog";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { apiRequest } from "@/lib/queryClient";
// import { getBrandLogo } from "@/utils/brandLogos";

// Componente sortable para cada promoción
function SortablePromotionCard({ promotion, getBrand, isEditMode }: {
  promotion: Promotion;
  getBrand: (brandId: string) => Brand | undefined;
  isEditMode: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: promotion.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const brand = getBrand(promotion.brandId);
  
  if (!brand) return null;

  return (
    <div ref={setNodeRef} style={style} className={`relative ${isDragging ? 'z-10' : ''}`}>
      {isEditMode && (
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-2 right-2 z-10 cursor-grab active:cursor-grabbing bg-white/80 p-1 rounded shadow-sm"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
      )}
      
      <Link href={`/promotion/${promotion.slug}`} data-testid={`link-promotion-${promotion.slug}`}>
        <Card className="group overflow-hidden card-splat cursor-pointer bg-promo-yellow/95 backdrop-blur-sm h-full hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between mb-2">
              <Badge 
                variant="secondary" 
                className="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary hover:bg-secondary/80 text-xs px-2 py-1 text-[#ffd900]"
              >
                <Calendar className="w-3 h-3 mr-1" />
                {promotion.startYear}
              </Badge>
              <img 
                src={brand.logoUrl || ''} 
                alt={brand.name}
                className="w-8 h-8 object-contain"
              />
            </div>
            <CardTitle className="text-xl font-bold text-promo-black group-hover:text-promo-yellow transition-colors" style={{ fontFamily: 'Righteous, cursive' }}>
              {promotion.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {promotion.description.length > 120
                    ? `${promotion.description.substring(0, 120)}...`
                    : promotion.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {promotion.category}
                  </Badge>
                  <span className="text-sm text-gray-500">Ver más →</span>
                </div>
              </div>
              {(promotion.wrapperPhotosUrls && promotion.wrapperPhotosUrls.length > 0) || promotion.wrapperPhotoUrl ? (
                <div className="flex-shrink-0 w-20 h-24 flex items-center justify-center relative">
                  <img 
                    src={(promotion.wrapperPhotosUrls && promotion.wrapperPhotosUrls.length > 0) 
                      ? promotion.wrapperPhotosUrls[0] 
                      : promotion.wrapperPhotoUrl || ''} 
                    alt={`Envoltura ${promotion.name}`}
                    className="max-w-full max-h-full object-contain drop-shadow-sm"
                    style={{ transform: `rotate(${promotion.wrapperRotation || 0}deg)` }}
                  />
                  {promotion.wrapperPhotosUrls && promotion.wrapperPhotosUrls.length > 1 && (
                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      +{promotion.wrapperPhotosUrls.length - 1}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

const Promotions = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const queryClient = useQueryClient();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: promotions, isLoading: promotionsLoading } = useQuery<Promotion[]>({
    queryKey: ['/api/promotions'],
  });

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });
  
  const reorderMutation = useMutation({
    mutationFn: async (promotionsList: Array<{id: string, sortOrder: number}>) => {
      const response = await fetch('/api/promotions/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promotions: promotionsList })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reorder promotions');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promotions'] });
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id && filteredPromotions) {
      const oldIndex = filteredPromotions.findIndex(p => p.id === active.id);
      const newIndex = filteredPromotions.findIndex(p => p.id === over?.id);
      
      const reorderedPromotions = arrayMove(filteredPromotions, oldIndex, newIndex);
      
      // Actualizar el sortOrder basado en la nueva posición
      const promotionUpdates = reorderedPromotions.map((promotion, index) => ({
        id: promotion.id,
        sortOrder: index
      }));
      
      reorderMutation.mutate(promotionUpdates);
    }
  }

  const getBrand = (brandId: string) => {
    return brands?.find(brand => brand.id === brandId);
  };

  const getUniqueCategories = () => {
    if (!promotions) return [];
    const categories = Array.from(new Set(promotions.map(p => p.category)));
    return categories.sort();
  };

  const filteredPromotions = promotions?.filter(promotion => {
    if (selectedCategory && promotion.category !== selectedCategory) return false;
    if (selectedBrand && promotion.brandId !== selectedBrand) return false;
    return true;
  }).sort((a, b) => {
    // Priorizar sortOrder personalizado, luego por año
    if (a.sortOrder !== b.sortOrder) {
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    }
    return a.startYear - b.startYear;
  });

  if (promotionsLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            <h1 className="nostalgia-text text-4xl font-bold text-promo-black flex items-center drop-shadow-lg">
              <Package className="w-8 h-8 mr-3 text-promo-yellow" />
              Promociones Nostálgicas
            </h1>
            <div className="flex-1 flex justify-end">
              <div className="flex items-center space-x-4">
                {isEditMode && (
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="btn-splat bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Promoción
                  </Button>
                )}
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
                  <Edit className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Modo Edición</span>
                  <Switch
                    checked={isEditMode}
                    onCheckedChange={setIsEditMode}
                    data-testid="switch-edit-mode"
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revive los recuerdos de las promociones más icónicas de las marcas mexicanas
          </p>
        </div>

        {/* Filters */}
        <div className="card-splat p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-promo-yellow" />
            <h3 className="text-lg font-semibold text-promo-black">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? "btn-splat" : "btn-splat opacity-60"}
                >
                  Todas
                </Button>
                {getUniqueCategories().map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "btn-splat" : "btn-splat opacity-60"}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBrand(null)}
                  className={selectedBrand === null ? "btn-splat" : "btn-splat opacity-60"}
                >
                  Todas
                </Button>
                {brands?.map((brand) => (
                  <Button
                    key={brand.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBrand(brand.id)}
                    className={selectedBrand === brand.id ? "btn-splat" : "btn-splat opacity-60"}
                  >
                    <img 
                      src={brand.logoUrl || ''} 
                      alt={brand.name}
                      className="w-4 h-4 mr-1 object-contain"
                    />
                    {brand.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Promotions Grid */}
        {isEditMode ? (
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredPromotions?.map(p => p.id) || []} 
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPromotions && filteredPromotions.length > 0 ? (
                  filteredPromotions.map((promotion) => (
                    <SortablePromotionCard
                      key={promotion.id}
                      promotion={promotion}
                      getBrand={getBrand}
                      isEditMode={isEditMode}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No se encontraron promociones con los filtros aplicados.</p>
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPromotions && filteredPromotions.length > 0 ? (
              filteredPromotions.map((promotion) => (
                <SortablePromotionCard
                  key={promotion.id}
                  promotion={promotion}
                  getBrand={getBrand}
                  isEditMode={false}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No se encontraron promociones con los filtros aplicados.</p>
              </div>
            )}
          </div>
        )}
      
        {/* Create Promotion Dialog */}
        <CreatePromotionDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          brands={brands || []}
        />
      </div>
    </div>
  );
};

export default Promotions;
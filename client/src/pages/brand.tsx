import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, Edit2, Save, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import PromotionCard from "@/components/promotion-card";
import { type Brand, type Promotion } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import placeholderImage from "@assets/Generated Image September 04, 2025 - 12_42PM_1757011639528.jpeg";

const Brand = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin } = useAuth();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [brandLoading, setBrandLoading] = useState(true);
  const [promotionsLoading, setPromotionsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBrandMutation = useMutation({
    mutationFn: async (updateData: Partial<Brand>) => {
      if (!brand?.id) throw new Error('No brand ID');
      await apiRequest('PUT', `/api/brands/${brand.id}`, updateData);
    },
    onSuccess: () => {
      // Update local state only after successful API call
      if (brand) {
        setBrand({ ...brand, description: editedDescription });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      setIsEditMode(false);
      toast({
        title: 'Marca actualizada',
        description: 'La descripción se ha guardado correctamente.',
      });
    },
    onError: (error) => {
      console.error('Error updating brand:', error);
      // Reset to original description on error
      setEditedDescription(brand?.description || '');
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la marca. Intenta de nuevo.',
        variant: 'destructive',
      });
    },
  });

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
        setEditedDescription(brandData.description || '');
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
        <div className="card-splat p-8 mb-8 relative">
          {isAdmin && (
            <div className="absolute top-4 right-4 flex gap-2">
              {!isEditMode ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditMode(true)}
                  className="bg-white/80 hover:bg-white"
                  data-testid="button-edit-brand"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    updateBrandMutation.mutate({ description: editedDescription });
                  }}
                  disabled={updateBrandMutation.isPending}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  data-testid="button-save-brand"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(false);
                    setEditedDescription(brand.description || '');
                  }}
                  className="bg-white/80 hover:bg-white"
                  data-testid="button-cancel-edit-brand"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </>
              )}
            </div>
          )}
          <div className="flex items-center space-x-6">
            <div 
              className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {brand.name.charAt(0)}
            </div>
            <div className="flex-1 pr-32">
              <h1 className="text-3xl font-bold text-promo-black mb-2" data-testid="text-brand-name">
                {brand.name}
              </h1>
              {isEditMode ? (
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="text-gray-600 mb-4 border-2 bg-white/80"
                  rows={3}
                  data-testid="textarea-brand-description"
                />
              ) : (
                <p className="text-gray-600 mb-4" data-testid="text-brand-description">
                  {brand.description}
                </p>
              )}
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
                  brand={brand}
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

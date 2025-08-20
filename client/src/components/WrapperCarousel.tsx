import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Package, RotateCw, Edit2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { type Promotion } from '@shared/schema';

interface WrapperCarouselProps {
  wrapperPhotos: string[] | null;
  promotionName: string;
  isEditable?: boolean;
  promotionId?: string;
  imageRotations?: { [key: number]: number };
}

export function WrapperCarousel({ wrapperPhotos, promotionName, isEditable = false, promotionId, imageRotations = {} }: WrapperCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rotations, setRotations] = useState<{ [key: number]: number }>(imageRotations);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!wrapperPhotos || wrapperPhotos.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto mb-4 text-yellow-400/50" />
        <h3 className="text-xl font-bold text-yellow-400 mb-2">
          Fotos de Envolturas
        </h3>
        <p className="text-yellow-400/70">
          No hay fotos de envoltura disponibles para esta promoción
        </p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % wrapperPhotos.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + wrapperPhotos.length) % wrapperPhotos.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Mutation for updating promotion
  const updateMutation = useMutation({
    mutationFn: async (updateData: Partial<Promotion>) => {
      if (!promotionId) throw new Error('No promotion ID');
      return await apiRequest('PUT', `/api/promotions/${promotionId}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promotions'] });
      toast({
        title: 'Promoción actualizada',
        description: 'Los cambios se han guardado correctamente.',
      });
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

  const handleRotateImage = () => {
    const currentRotation = rotations[currentIndex] || 0;
    const newRotation = (currentRotation + 90) % 360;
    const newRotations = { ...rotations, [currentIndex]: newRotation };
    setRotations(newRotations);
    
    if (promotionId) {
      updateMutation.mutate({
        wrapperRotation: newRotation,
      });
    }
  };

  const handleAddImage = () => {
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
          if (imageUrl && promotionId) {
            const currentUrls = wrapperPhotos || [];
            updateMutation.mutate({
              wrapperPhotosUrls: [...currentUrls, imageUrl],
            });
          }
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (!wrapperPhotos || !promotionId) return;
    
    const updatedPhotos = wrapperPhotos.filter((_, index) => index !== indexToRemove);
    updateMutation.mutate({
      wrapperPhotosUrls: updatedPhotos.length > 0 ? updatedPhotos : null,
    });
    
    // Adjust current index if needed
    if (currentIndex >= updatedPhotos.length && updatedPhotos.length > 0) {
      setCurrentIndex(updatedPhotos.length - 1);
    }
  };

  return (
    <div className="space-y-4" data-testid="wrapper-carousel">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-yellow-400">
          Fotos de Envolturas ({wrapperPhotos.length})
        </h3>
        {isEditable && (
          <div className="flex gap-2">
            {!isEditMode ? (
              <Button
                size="sm"
                variant="outline"
                className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                onClick={() => setIsEditMode(true)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-400/50 text-green-400 hover:bg-green-400 hover:text-black"
                  onClick={() => setIsEditMode(false)}
                >
                  Listo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  onClick={handleAddImage}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Main Carousel */}
      <div className="relative bg-black/20 rounded-lg p-4 border border-yellow-400/30">
        <div className="relative h-64 overflow-hidden rounded-lg">
          <img
            src={wrapperPhotos[currentIndex]}
            alt={`Envoltura ${currentIndex + 1} de ${promotionName}`}
            className="w-full h-full object-contain cursor-pointer transition-transform hover:scale-105"
            style={{ transform: `rotate(${rotations[currentIndex] || 0}deg)` }}
            onClick={() => !isEditMode && setSelectedImage(wrapperPhotos[currentIndex])}
            data-testid={`wrapper-image-${currentIndex}`}
          />
          
          {/* Inline editing controls */}
          {isEditable && isEditMode && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 p-0 bg-black/80 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                onClick={handleRotateImage}
                title="Rotar imagen 90°"
              >
                <RotateCw className="w-3 h-3" />
              </Button>
              {wrapperPhotos && wrapperPhotos.length > 1 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 bg-black/80 border-red-400/50 text-red-400 hover:bg-red-400 hover:text-white"
                  onClick={() => handleRemoveImage(currentIndex)}
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
          
          {/* Navigation Arrows - Hide in edit mode */}
          {wrapperPhotos.length > 1 && !isEditMode && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                onClick={prevImage}
                data-testid="carousel-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                onClick={nextImage}
                data-testid="carousel-next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
        
        {/* Image Counter */}
        {wrapperPhotos.length > 1 && (
          <div className="text-center mt-2 text-yellow-400/80 text-sm">
            {currentIndex + 1} de {wrapperPhotos.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {wrapperPhotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {wrapperPhotos.map((photo, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                index === currentIndex
                  ? 'border-yellow-400 scale-110'
                  : 'border-yellow-400/30 hover:border-yellow-400/60'
              }`}
            >
              <button
                onClick={() => goToImage(index)}
                className="w-full h-full"
                data-testid={`thumbnail-${index}`}
              >
                <img
                  src={photo}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ transform: `rotate(${rotations[index] || 0}deg)` }}
                />
              </button>
              
              {/* Thumbnail edit controls */}
              {isEditable && isEditMode && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-600 border-red-400 text-white hover:bg-red-700"
                  onClick={() => handleRemoveImage(index)}
                  title="Eliminar imagen"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Modal with Navigation */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent 
          className="max-w-6xl max-h-[95vh] bg-black/95 border-yellow-400/50 p-0"
          data-testid="fullscreen-modal"
        >
          <DialogTitle className="sr-only">Vista ampliada de envoltura</DialogTitle>
          <DialogDescription className="sr-only">
            Imagen ampliada de la envoltura promocional de {promotionName}
          </DialogDescription>
          
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/80 text-yellow-400 rounded-full hover:bg-yellow-400 hover:text-black transition-colors"
              data-testid="close-modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Navigation in Modal */}
            {wrapperPhotos && wrapperPhotos.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/80 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = (currentIndex - 1 + wrapperPhotos.length) % wrapperPhotos.length;
                    setCurrentIndex(newIndex);
                    setSelectedImage(wrapperPhotos[newIndex]);
                  }}
                  data-testid="modal-prev"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-16 top-1/2 -translate-y-1/2 z-10 bg-black/80 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = (currentIndex + 1) % wrapperPhotos.length;
                    setCurrentIndex(newIndex);
                    setSelectedImage(wrapperPhotos[newIndex]);
                  }}
                  data-testid="modal-next"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
            
            {selectedImage && (
              <div className="p-6">
                <img
                  src={selectedImage}
                  alt={`Envoltura de ${promotionName}`}
                  className="w-full h-auto max-h-[75vh] object-contain mx-auto"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                    Envoltura Original - {promotionName}
                  </h3>
                  {wrapperPhotos && wrapperPhotos.length > 1 && (
                    <p className="text-yellow-400/60 text-sm mb-2">
                      {currentIndex + 1} de {wrapperPhotos.length}
                    </p>
                  )}
                  <p className="text-yellow-400/80 text-sm">
                    Imagen auténtica de la envoltura promocional. Use las flechas para navegar.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
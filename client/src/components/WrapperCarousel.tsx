import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface WrapperCarouselProps {
  wrapperPhotos: string[] | null;
  promotionName: string;
}

export function WrapperCarousel({ wrapperPhotos, promotionName }: WrapperCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  return (
    <div className="space-y-4" data-testid="wrapper-carousel">
      <h3 className="text-xl font-bold text-yellow-400">
        Fotos de Envolturas ({wrapperPhotos.length})
      </h3>
      
      {/* Main Carousel */}
      <div className="relative bg-black/20 rounded-lg p-4 border border-yellow-400/30">
        <div className="relative h-64 overflow-hidden rounded-lg">
          <img
            src={wrapperPhotos[currentIndex]}
            alt={`Envoltura ${currentIndex + 1} de ${promotionName}`}
            className="w-full h-full object-contain cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedImage(wrapperPhotos[currentIndex])}
            data-testid={`wrapper-image-${currentIndex}`}
          />
          
          {/* Navigation Arrows */}
          {wrapperPhotos.length > 1 && (
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
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                index === currentIndex
                  ? 'border-yellow-400 scale-110'
                  : 'border-yellow-400/30 hover:border-yellow-400/60'
              }`}
              data-testid={`thumbnail-${index}`}
            >
              <img
                src={photo}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
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
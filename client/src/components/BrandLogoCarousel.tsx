import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ImageWithDescriptionUploader } from "@/components/ImageWithDescriptionUploader";
import { apiRequest } from "@/lib/queryClient";

interface BrandLogoCarouselProps {
  brandId: string;
  brandName: string;
  historicalLogos: string[];
  onUpdate: () => void;
}

export function BrandLogoCarousel({ brandId, brandName, historicalLogos, onUpdate }: BrandLogoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const logos = historicalLogos || [];

  // Auto-rotate logos every 3 seconds
  useEffect(() => {
    if (logos.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [logos.length, isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + logos.length) % logos.length);
    setIsPaused(true);
    // Resume autoplay after 5 seconds
    setTimeout(() => setIsPaused(false), 5000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % logos.length);
    setIsPaused(true);
    // Resume autoplay after 5 seconds
    setTimeout(() => setIsPaused(false), 5000);
  };

  const handleDelete = async (index: number) => {
    try {
      await apiRequest('DELETE', `/api/brands/${brandId}/historical-logos/${index}`, {});
      toast({
        title: "Logo eliminado",
        description: "El logo histórico se eliminó correctamente",
      });
      onUpdate();
      if (currentIndex >= logos.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el logo",
        variant: "destructive",
      });
    }
  };

  const handleAddLogo = async (files: Array<{ url: string; description?: string }>) => {
    try {
      for (const file of files) {
        await apiRequest('POST', `/api/brands/${brandId}/historical-logos`, { logoUrl: file.url });
      }
      toast({
        title: "Logos agregados",
        description: `Se agregaron ${files.length} logo(s) histórico(s)`,
      });
      onUpdate();
      setIsAdding(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron agregar los logos",
        variant: "destructive",
      });
    }
  };

  if (logos.length === 0 && !isAdmin) {
    return null;
  }

  if (isAdding) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-promo-black">Agregar Logos Históricos</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(false)}
          >
            Cancelar
          </Button>
        </div>
        <ImageWithDescriptionUploader
          onUpload={handleAddLogo}
          multiple={true}
          requireDescription={false}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-promo-black">Logos Históricos de {brandName}</h3>
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="bg-promo-yellow text-promo-black hover:bg-yellow-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Logo
          </Button>
        )}
      </div>

      {logos.length > 0 ? (
        <div className="relative">
          <div 
            className="flex items-center justify-center h-32 bg-gray-50 rounded-lg overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <img
              src={logos[currentIndex]}
              alt={`Logo histórico ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain transition-opacity duration-500"
            />
          </div>

          {logos.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={goToNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <div className="flex justify-center gap-2 mt-4">
                {logos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsPaused(true);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-promo-yellow' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {isAdmin && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(currentIndex)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar este logo
              </Button>
            </div>
          )}

          <p className="text-sm text-gray-500 text-center mt-2">
            Logo {currentIndex + 1} de {logos.length}
          </p>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No hay logos históricos disponibles</p>
          {isAdmin && (
            <p className="text-sm mt-2">Haz clic en "Agregar Logo" para comenzar</p>
          )}
        </div>
      )}
    </div>
  );
}

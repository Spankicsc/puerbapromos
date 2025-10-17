import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Upload } from "lucide-react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

interface ImageWithDescription {
  url: string;
  description: string;
}

interface ImageWithDescriptionUploaderProps {
  maxNumberOfFiles?: number;
  onComplete?: (images: ImageWithDescription[]) => void;
  buttonClassName?: string;
}

export function ImageWithDescriptionUploader({
  maxNumberOfFiles = 10,
  onComplete,
  buttonClassName,
}: ImageWithDescriptionUploaderProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [imageDescriptions, setImageDescriptions] = useState<Record<string, string>>({});
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize: 10485760, // 10MB
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: async () => {
          const response = await fetch("/api/objects/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          
          if (!response.ok) {
            throw new Error("Failed to get upload URL");
          }
          
          const data = await response.json();
          return {
            method: "PUT" as const,
            url: data.uploadURL,
          };
        },
      })
      .on("complete", (result) => {
        const urls = result.successful?.map(file => file.uploadURL as string) || [];
        if (urls.length > 0) {
          setUploadedUrls(urls);
          setShowUploadModal(false);
          setShowDescriptionModal(true);
          setCurrentDescriptionIndex(0);
          // Initialize descriptions
          const initialDescriptions: Record<string, string> = {};
          urls.forEach(url => {
            initialDescriptions[url] = "";
          });
          setImageDescriptions(initialDescriptions);
        }
      })
  );

  const handleDescriptionChange = (url: string, description: string) => {
    setImageDescriptions(prev => ({
      ...prev,
      [url]: description
    }));
  };

  const handleNext = () => {
    if (currentDescriptionIndex < uploadedUrls.length - 1) {
      setCurrentDescriptionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentDescriptionIndex > 0) {
      setCurrentDescriptionIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const imagesWithDescriptions: ImageWithDescription[] = uploadedUrls.map(url => ({
      url,
      description: imageDescriptions[url] || ""
    }));
    
    if (onComplete) {
      onComplete(imagesWithDescriptions);
    }
    
    // Reset
    setShowDescriptionModal(false);
    setUploadedUrls([]);
    setImageDescriptions({});
    setCurrentDescriptionIndex(0);
    uppy.cancelAll();
  };

  const handleCancel = () => {
    setShowDescriptionModal(false);
    setUploadedUrls([]);
    setImageDescriptions({});
    setCurrentDescriptionIndex(0);
    uppy.cancelAll();
  };

  const currentUrl = uploadedUrls[currentDescriptionIndex];

  return (
    <div>
      <Button 
        onClick={() => setShowUploadModal(true)} 
        className={buttonClassName}
        data-testid="button-upload-images-with-description"
      >
        <Plus className="w-3 h-3 mr-1" />
        Agregar Imágenes
      </Button>

      <DashboardModal
        uppy={uppy}
        open={showUploadModal}
        onRequestClose={() => setShowUploadModal(false)}
        proudlyDisplayPoweredByUppy={false}
      />

      <Dialog open={showDescriptionModal} onOpenChange={setShowDescriptionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Agregar descripción ({currentDescriptionIndex + 1} de {uploadedUrls.length})
            </DialogTitle>
          </DialogHeader>
          
          {currentUrl && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src={currentUrl} 
                  alt={`Imagen ${currentDescriptionIndex + 1}`}
                  className="max-w-full max-h-64 object-contain rounded border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">
                  ¿Qué parte de la colección es esta imagen?
                </Label>
                <Input
                  id="description"
                  value={imageDescriptions[currentUrl] || ""}
                  onChange={(e) => handleDescriptionChange(currentUrl, e.target.value)}
                  placeholder="Ej: Frente del tazo, Reverso, Detalle del número, etc."
                  data-testid="input-image-description"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentDescriptionIndex === 0}
                  data-testid="button-previous-image"
                >
                  Anterior
                </Button>
                
                <span className="text-sm text-gray-500">
                  Imagen {currentDescriptionIndex + 1} de {uploadedUrls.length}
                </span>

                {currentDescriptionIndex < uploadedUrls.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    data-testid="button-next-image"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      data-testid="button-cancel-upload"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleComplete}
                      data-testid="button-complete-upload"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Completar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

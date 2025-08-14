import { useState } from "react";
import { ObjectUploader } from "./ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import type { UploadResult } from "@uppy/core";
// Removed apiRequest import as we're using fetch directly

interface ImageUploadButtonProps {
  promotionSlug: string;
  onImageUploaded?: (imageUrl: string) => void;
}

export function ImageUploadButton({ promotionSlug, onImageUploaded }: ImageUploadButtonProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleGetUploadParameters = async () => {
    try {
      const response = await fetch("/api/objects/upload", {
        method: "POST",
      });
      const data = await response.json();
      return {
        method: "PUT" as const,
        url: data.uploadURL,
      };
    } catch (error) {
      console.error("Error getting upload parameters:", error);
      throw error;
    }
  };

  const handleComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    setIsUploading(true);
    try {
      if (result.successful && result.successful.length > 0) {
        const uploadedFile = result.successful[0];
        const imageUrl = uploadedFile.uploadURL as string;
        
        // Update the promotion with the new image URL
        await fetch(`/api/promotions/${promotionSlug}/images`, {
          method: "PUT",
          body: JSON.stringify({ imageUrl }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        toast({
          title: "Imagen subida exitosamente",
          description: "La imagen se ha guardado correctamente en el almacenamiento.",
        });

        onImageUploaded?.(imageUrl);
      }
    } catch (error) {
      console.error("Error updating promotion with image:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la imagen. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ObjectUploader
      maxNumberOfFiles={5}
      maxFileSize={10485760} // 10MB
      onGetUploadParameters={handleGetUploadParameters}
      onComplete={handleComplete}
      buttonClassName="bg-promo-yellow text-promo-black hover:bg-yellow-400"
    >
      <div className="flex items-center gap-2">
        <Upload className="w-4 h-4" />
        <span>{isUploading ? "Subiendo..." : "Subir Imágenes"}</span>
      </div>
    </ObjectUploader>
  );
}
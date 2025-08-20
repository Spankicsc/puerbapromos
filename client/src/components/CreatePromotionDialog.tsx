import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { type Brand, type InsertPromotion } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Package } from "lucide-react";

interface CreatePromotionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brands: Brand[];
}

const validCategories = [
  "tazos",
  "stickers", 
  "cartas",
  "juguetes",
  "figuras",
  "spinners",
  "llaveros",
  "pegatinas",
  "postales",
  "promocional",
  "coleccionable",
  "album",
  "sobres",
  "cromos",
  "calcomanias"
];

export function CreatePromotionDialog({ open, onOpenChange, brands }: CreatePromotionDialogProps) {
  const [formData, setFormData] = useState<Partial<InsertPromotion>>({
    name: "",
    description: "",
    brandId: "",
    category: "tazos",
    startYear: new Date().getFullYear(),
    endYear: undefined,
    imageUrl: "",
    wrapperPhotoUrl: "",
    wrapperPhotosUrls: [],
    promotionImagesUrls: null,
    youtubeCommercialUrl: "",
    buffetGamesVideoUrl: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: InsertPromotion) => {
      // Generate slug from name
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      const promotionData = {
        ...data,
        slug,
        // Ensure arrays and nullable fields are properly set
        wrapperPhotosUrls: Array.isArray(data.wrapperPhotosUrls) && data.wrapperPhotosUrls.length ? data.wrapperPhotosUrls : null,
        imageUrl: data.imageUrl || null,
        wrapperPhotoUrl: data.wrapperPhotoUrl || null,
        youtubeCommercialUrl: data.youtubeCommercialUrl || null,
        buffetGamesVideoUrl: data.buffetGamesVideoUrl || null,
        endYear: data.endYear || null,
      };

      const response = await apiRequest("POST", "/api/promotions", promotionData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      toast({
        title: "Promoción creada",
        description: "La nueva promoción se ha creado exitosamente.",
      });
      // Reset form
      setFormData({
        name: "",
        description: "",
        brandId: "",
        category: "tazos",
        startYear: new Date().getFullYear(),
        endYear: undefined,
        imageUrl: "",
        wrapperPhotoUrl: "",
        wrapperPhotosUrls: [],
        promotionImagesUrls: null,
        youtubeCommercialUrl: "",
        buffetGamesVideoUrl: "",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error creating promotion:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la promoción. Revisa la consola para más detalles.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.brandId) {
      toast({
        title: "Campos requeridos",
        description: "Por favor llena todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(formData as InsertPromotion);
  };

  const addWrapperPhoto = () => {
    const url = prompt("Ingresa la URL de la imagen de envoltura:");
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        wrapperPhotosUrls: [...(Array.isArray(prev.wrapperPhotosUrls) ? prev.wrapperPhotosUrls : []), url.trim()]
      }));
    }
  };

  const removeWrapperPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      wrapperPhotosUrls: Array.isArray(prev.wrapperPhotosUrls) ? prev.wrapperPhotosUrls.filter((_, i) => i !== index) : []
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-promo-yellow" />
            Crear Nueva Promoción
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre de la Promoción *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Tazos Pokémon"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="brand">Marca *</Label>
                <Select
                  value={formData.brandId || ""}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, brandId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe la promoción, qué incluía, cómo funcionaba..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category || "tazos"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {validCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="startYear">Año de Inicio</Label>
                <Input
                  id="startYear"
                  type="number"
                  value={formData.startYear || new Date().getFullYear()}
                  onChange={(e) => setFormData(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                  min="1940"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <Label htmlFor="endYear">Año de Fin (opcional)</Label>
                <Input
                  id="endYear"
                  type="number"
                  value={formData.endYear || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, endYear: e.target.value ? parseInt(e.target.value) : undefined }))}
                  min="1940"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Imágenes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imageUrl">Imagen Principal</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="URL de la imagen principal"
                />
              </div>

              <div>
                <Label htmlFor="wrapperPhotoUrl">Imagen de Envoltura Principal</Label>
                <Input
                  id="wrapperPhotoUrl"
                  value={formData.wrapperPhotoUrl || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, wrapperPhotoUrl: e.target.value }))}
                  placeholder="URL de la envoltura principal"
                />
              </div>
            </div>

            {/* Múltiples Imágenes de Envolturas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Imágenes de Envolturas Adicionales</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addWrapperPhoto}
                >
                  Agregar Imagen
                </Button>
              </div>
              
              {Array.isArray(formData.wrapperPhotosUrls) && formData.wrapperPhotosUrls.length > 0 && (
                <div className="space-y-2">
                  {formData.wrapperPhotosUrls.map((url: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={url}
                        onChange={(e) => {
                          const currentUrls = Array.isArray(formData.wrapperPhotosUrls) ? formData.wrapperPhotosUrls : [];
                          const newUrls = [...currentUrls];
                          newUrls[index] = e.target.value;
                          setFormData(prev => ({ ...prev, wrapperPhotosUrls: newUrls }));
                        }}
                        placeholder="URL de imagen de envoltura"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeWrapperPhoto(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Videos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Videos (opcional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="youtubeCommercialUrl">Comercial de YouTube</Label>
                <Input
                  id="youtubeCommercialUrl"
                  value={formData.youtubeCommercialUrl || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeCommercialUrl: e.target.value }))}
                  placeholder="URL del comercial en YouTube"
                />
              </div>

              <div>
                <Label htmlFor="buffetGamesVideoUrl">Video de Buffet Games</Label>
                <Input
                  id="buffetGamesVideoUrl"
                  value={formData.buffetGamesVideoUrl || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, buffetGamesVideoUrl: e.target.value }))}
                  placeholder="URL del video de Buffet Games"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="btn-splat bg-green-600 hover:bg-green-700"
            >
              {createMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Crear Promoción
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
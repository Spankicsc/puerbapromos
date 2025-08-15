import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Trash2, RotateCw, Upload } from "lucide-react";
import type { Promotion } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EditablePromotionProps {
  promotion: Promotion;
  isEditable?: boolean;
}

const CATEGORIES = [
  "tazos",
  "stickers", 
  "figuras",
  "spinners",
  "cartas",
  "llaveros",
  "pegatinas",
  "postales"
] as const;

export function EditablePromotion({ promotion, isEditable = false }: EditablePromotionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: promotion.name,
    description: promotion.description,
    category: promotion.category,
    startYear: promotion.startYear,
    endYear: promotion.endYear || undefined,
    wrapperPhotoUrl: promotion.wrapperPhotoUrl,
    imageUrl: promotion.imageUrl,
  });
  const [imageRotation, setImageRotation] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (updateData: any) => {
      return await apiRequest(`/api/promotions/${promotion.id}`, "PUT", updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      setIsEditing(false);
      toast({
        title: "Promoción actualizada",
        description: "Los cambios se han guardado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la promoción.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/promotions/${promotion.id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      toast({
        title: "Promoción eliminada",
        description: "La promoción se ha eliminado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la promoción.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(editData);
  };

  const handleCancel = () => {
    setEditData({
      name: promotion.name,
      description: promotion.description,
      category: promotion.category,
      startYear: promotion.startYear,
      endYear: promotion.endYear || undefined,
      wrapperPhotoUrl: promotion.wrapperPhotoUrl,
      imageUrl: promotion.imageUrl,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que quieres eliminar esta promoción?")) {
      deleteMutation.mutate();
    }
  };

  const rotateImage = () => {
    const newRotation = (imageRotation + 90) % 360;
    setImageRotation(newRotation);
    // Here you would also save the rotation to the backend
  };

  if (isEditing) {
    return (
      <Card className="mb-6 border-2 border-promo-yellow shadow-md">
        <CardHeader className="bg-promo-yellow">
          <div className="flex items-center justify-between">
            <Input
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              className="text-xl font-bold bg-white"
              data-testid="input-promotion-name"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                size="sm"
                data-testid="button-save-promotion"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                data-testid="button-cancel-edit"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  data-testid="textarea-promotion-description"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Categoría</label>
                <Select
                  value={editData.category}
                  onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger data-testid="select-promotion-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Año inicio</label>
                  <Input
                    type="number"
                    value={editData.startYear}
                    onChange={(e) => setEditData(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                    data-testid="input-promotion-start-year"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Año fin</label>
                  <Input
                    type="number"
                    value={editData.endYear || ""}
                    onChange={(e) => setEditData(prev => ({ ...prev, endYear: e.target.value ? parseInt(e.target.value) : undefined }))}
                    data-testid="input-promotion-end-year"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {editData.wrapperPhotoUrl && (
                <div className="relative">
                  <label className="text-sm font-medium">Imagen de envoltura</label>
                  <div className="relative mt-2">
                    <img
                      src={editData.wrapperPhotoUrl}
                      alt="Envoltura"
                      className="w-full max-w-xs mx-auto object-contain"
                      style={{ transform: `rotate(${imageRotation}deg)` }}
                      data-testid="img-wrapper-preview"
                    />
                    <Button
                      onClick={rotateImage}
                      className="absolute top-2 right-2"
                      size="sm"
                      variant="secondary"
                      data-testid="button-rotate-image"
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  data-testid="button-upload-image"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir nueva imagen
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 group hover:shadow-lg transition-shadow">
      <CardHeader className="bg-promo-yellow">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-promo-black" style={{ fontFamily: 'Righteous, cursive' }}>
            {promotion.name}
          </CardTitle>
          {isEditable && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
                data-testid="button-edit-promotion"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleDelete}
                size="sm"
                variant="destructive"
                disabled={deleteMutation.isPending}
                data-testid="button-delete-promotion"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 text-sm leading-relaxed mb-4" data-testid="text-promotion-description">
              {promotion.description.length > 120
                ? `${promotion.description.substring(0, 120)}...`
                : promotion.description}
            </p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs" data-testid="badge-promotion-category">
                {promotion.category}
              </Badge>
              <span className="text-sm text-gray-500">
                {promotion.startYear}{promotion.endYear && promotion.endYear !== promotion.startYear && ` - ${promotion.endYear}`}
              </span>
            </div>
          </div>
          {promotion.wrapperPhotoUrl && (
            <div className="flex-shrink-0 w-20 h-24 flex items-center justify-center">
              <img 
                src={promotion.wrapperPhotoUrl} 
                alt={`Envoltura ${promotion.name}`}
                className="max-w-full max-h-full object-contain drop-shadow-sm"
                data-testid="img-wrapper-photo"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
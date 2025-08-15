import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Save, Trash2, RotateCw, Calendar, Tag, X } from "lucide-react";
import { type Promotion, type Brand } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface EditablePromotionProps {
  promotion: Promotion;
  isEditable: boolean;
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

export function EditablePromotion({ promotion, isEditable }: EditablePromotionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPromotion, setEditedPromotion] = useState(promotion);
  const [wrapperRotation, setWrapperRotation] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get brands for brand info
  const { data: brands } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  const getBrand = (brandId: string) => {
    return brands?.find(brand => brand.id === brandId);
  };

  const brand = getBrand(promotion.brandId);

  const updateMutation = useMutation({
    mutationFn: async (updateData: Partial<Promotion>) => {
      const response = await apiRequest("PUT", `/api/promotions/${promotion.id}`, updateData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      setIsEditing(false);
      toast({
        title: "Promoción actualizada",
        description: "Los cambios se han guardado correctamente.",
      });
    },
    onError: (error) => {
      console.error("Error updating promotion:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la promoción. Revisa la consola para más detalles.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/promotions/${promotion.id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      toast({
        title: "Promoción eliminada",
        description: "La promoción se ha eliminado correctamente.",
      });
    },
    onError: (error) => {
      console.error("Error deleting promotion:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la promoción.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      name: editedPromotion.name,
      description: editedPromotion.description,
      category: editedPromotion.category,
      startYear: editedPromotion.startYear,
      endYear: editedPromotion.endYear,
      wrapperPhotoUrl: editedPromotion.wrapperPhotoUrl,
      imageUrl: editedPromotion.imageUrl,
    });
  };

  const handleCancel = () => {
    setEditedPromotion(promotion);
    setIsEditing(false);
  };

  const handleRotateWrapper = () => {
    const newRotation = (wrapperRotation + 90) % 360;
    setWrapperRotation(newRotation);
  };

  if (!brand) return null;

  return (
    <div className="relative">
      {/* Editing Controls Overlay */}
      {isEditable && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          {!isEditing ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsEditing(true)}
              data-testid="button-edit-promotion"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                data-testid="button-save-promotion"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCancel}
                data-testid="button-cancel-edit"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                data-testid="button-delete-promotion"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar promoción?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La promoción "{promotion.name}" será eliminada permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Main Card - Exactly Same Design as Normal View */}
      {isEditing ? (
        // Editing Mode - Keep same visual design but with editable fields
        <Card className="group overflow-hidden card-splat bg-promo-yellow/95 backdrop-blur-sm h-full transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between mb-2">
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-1"
                style={{ backgroundColor: `${brand.primaryColor}20`, color: brand.primaryColor }}
              >
                <Calendar className="w-3 h-3 mr-1" />
                <Input
                  type="number"
                  value={editedPromotion.startYear}
                  onChange={(e) => setEditedPromotion({ ...editedPromotion, startYear: parseInt(e.target.value) })}
                  className="w-16 h-5 text-xs border-0 bg-transparent p-0"
                  data-testid="input-start-year"
                />
              </Badge>
              <img 
                src={brand.logoUrl || ''} 
                alt={brand.name}
                className="w-8 h-8 object-contain"
              />
            </div>
            <Input
              value={editedPromotion.name}
              onChange={(e) => setEditedPromotion({ ...editedPromotion, name: e.target.value })}
              className="text-xl font-bold text-promo-black border-0 bg-transparent p-0"
              style={{ fontFamily: 'Righteous, cursive' }}
              data-testid="input-promotion-name"
            />
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 min-w-0">
                <Textarea
                  value={editedPromotion.description}
                  onChange={(e) => setEditedPromotion({ ...editedPromotion, description: e.target.value })}
                  className="text-gray-600 text-sm leading-relaxed mb-4 border-0 bg-white/50 rounded"
                  rows={3}
                  data-testid="textarea-description"
                />
                <div className="flex items-center justify-between">
                  <Select
                    value={editedPromotion.category}
                    onValueChange={(value) => setEditedPromotion({ ...editedPromotion, category: value })}
                  >
                    <SelectTrigger className="w-32 h-6 text-xs" data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {validCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {editedPromotion.wrapperPhotoUrl && (
                <div className="flex-shrink-0 w-20 h-24 flex items-center justify-center relative">
                  <Dialog>
                    <DialogTrigger asChild>
                      <img 
                        src={editedPromotion.wrapperPhotoUrl} 
                        alt={`Envoltura ${editedPromotion.name}`}
                        className="max-w-full max-h-full object-contain drop-shadow-sm cursor-pointer hover:scale-105 transition-transform"
                        style={{ transform: `rotate(${wrapperRotation}deg)` }}
                        data-testid="img-wrapper-preview"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full">
                      <div className="flex items-center justify-center p-4">
                        <img 
                          src={editedPromotion.wrapperPhotoUrl} 
                          alt={`Envoltura ${editedPromotion.name}`}
                          className="max-w-full max-h-[80vh] object-contain"
                          style={{ transform: `rotate(${wrapperRotation}deg)` }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 w-6 h-6 p-0"
                    onClick={handleRotateWrapper}
                    data-testid="button-rotate-wrapper"
                  >
                    <RotateCw className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Normal View Mode - Exact same design as the original cards
        <Link href={`/promotion/${promotion.slug}`} data-testid={`link-promotion-${promotion.slug}`}>
          <Card className="group overflow-hidden card-splat cursor-pointer bg-promo-yellow/95 backdrop-blur-sm h-full hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2 py-1"
                  style={{ backgroundColor: `${brand.primaryColor}20`, color: brand.primaryColor }}
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
                {promotion.wrapperPhotoUrl && (
                  <div className="flex-shrink-0 w-20 h-24 flex items-center justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <img 
                          src={promotion.wrapperPhotoUrl} 
                          alt={`Envoltura ${promotion.name}`}
                          className="max-w-full max-h-full object-contain drop-shadow-sm cursor-pointer hover:scale-105 transition-transform"
                          style={{ transform: `rotate(${wrapperRotation}deg)` }}
                          data-testid="img-wrapper-normal"
                          onClick={(e) => e.preventDefault()}
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-full">
                        <div className="flex items-center justify-center p-4">
                          <img 
                            src={promotion.wrapperPhotoUrl} 
                            alt={`Envoltura ${promotion.name}`}
                            className="max-w-full max-h-[80vh] object-contain"
                            style={{ transform: `rotate(${wrapperRotation}deg)` }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  );
}
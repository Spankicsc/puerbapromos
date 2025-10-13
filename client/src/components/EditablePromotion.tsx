import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Save, Trash2, RotateCw, Calendar, Tag, X, ZoomIn, ZoomOut, Move, Plus, Maximize2 } from "lucide-react";
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
  const [wrapperRotation, setWrapperRotation] = useState(promotion.wrapperRotation || 0);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [currentEditingImage, setCurrentEditingImage] = useState<string | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showAddTags, setShowAddTags] = useState(false);

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
      tags: editedPromotion.tags,
      startYear: editedPromotion.startYear,
      endYear: editedPromotion.endYear,
      wrapperPhotoUrl: editedPromotion.wrapperPhotoUrl,
      wrapperPhotosUrls: editedPromotion.wrapperPhotosUrls,
      imageUrl: editedPromotion.imageUrl,
      youtubeCommercialUrl: editedPromotion.youtubeCommercialUrl,
      buffetGamesVideoUrl: editedPromotion.buffetGamesVideoUrl,
      wrapperRotation: wrapperRotation, // Incluir la rotación actual
    });
  };

  // Manual save function
  const saveChanges = () => {
    updateMutation.mutate({
      name: editedPromotion.name,
      description: editedPromotion.description,
      category: editedPromotion.category,
      tags: editedPromotion.tags,
      startYear: editedPromotion.startYear,
      endYear: editedPromotion.endYear,
      wrapperPhotoUrl: editedPromotion.wrapperPhotoUrl,
      wrapperPhotosUrls: editedPromotion.wrapperPhotosUrls,
      imageUrl: editedPromotion.imageUrl,
      youtubeCommercialUrl: editedPromotion.youtubeCommercialUrl,
      buffetGamesVideoUrl: editedPromotion.buffetGamesVideoUrl,
      wrapperRotation: wrapperRotation, // Usar la rotación actual del estado
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPromotion(promotion);
    setIsEditing(false);
  };

  const handleRotateWrapper = () => {
    const newRotation = (wrapperRotation + 90) % 360;
    setWrapperRotation(newRotation);
    setEditedPromotion({ ...editedPromotion, wrapperRotation: newRotation });
    
    // Guardar automáticamente la rotación
    updateMutation.mutate({
      name: editedPromotion.name,
      description: editedPromotion.description,
      category: editedPromotion.category,
      tags: editedPromotion.tags,
      startYear: editedPromotion.startYear,
      endYear: editedPromotion.endYear,
      wrapperPhotoUrl: editedPromotion.wrapperPhotoUrl,
      wrapperPhotosUrls: editedPromotion.wrapperPhotosUrls,
      imageUrl: editedPromotion.imageUrl,
      youtubeCommercialUrl: editedPromotion.youtubeCommercialUrl,
      buffetGamesVideoUrl: editedPromotion.buffetGamesVideoUrl,
      wrapperRotation: newRotation, // Usar la nueva rotación
    });
  };

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetImageTransforms = () => {
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
    setWrapperRotation(0);
  };

  const addWrapperPhoto = () => {
    // Create hidden file input
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
          if (imageUrl) {
            const currentUrls = Array.isArray(editedPromotion.wrapperPhotosUrls) ? editedPromotion.wrapperPhotosUrls : [];
            setEditedPromotion({ 
              ...editedPromotion, 
              wrapperPhotosUrls: [...currentUrls, imageUrl]
            });
          }
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  };

  const removeWrapperPhoto = (index: number) => {
    const currentUrls = Array.isArray(editedPromotion.wrapperPhotosUrls) ? editedPromotion.wrapperPhotosUrls : [];
    setEditedPromotion({ 
      ...editedPromotion, 
      wrapperPhotosUrls: currentUrls.filter((_, i) => i !== index)
    });
  };

  const openImageEditor = (imageUrl: string) => {
    setCurrentEditingImage(imageUrl);
    setShowImageEditor(true);
    resetImageTransforms();
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
                onClick={saveChanges}
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

      {/* Main Card - Always same design, inline editing when active */}
      <Card className="group overflow-hidden card-splat cursor-pointer bg-promo-yellow/95 backdrop-blur-sm h-full hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <Badge 
              variant="secondary" 
              className="text-xs px-2 py-1"
              style={{ backgroundColor: `${brand.primaryColor}20`, color: brand.primaryColor }}
            >
              <Calendar className="w-3 h-3 mr-1" />
              {isEditing ? (
                <Input
                  type="number"
                  value={editedPromotion.startYear}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    setEditedPromotion({ ...editedPromotion, startYear: newValue });
                  }}
                  className="w-16 h-5 text-xs border-0 bg-transparent p-0"
                  data-testid="input-start-year"
                />
              ) : (
                promotion.startYear
              )}
            </Badge>
            <img 
              src={brand.logoUrl || ''} 
              alt={brand.name}
              className="w-8 h-8 object-contain"
            />
          </div>
          
          {isEditing ? (
            <Input
              value={editedPromotion.name}
              onChange={(e) => {
                const newValue = e.target.value;
                setEditedPromotion({ ...editedPromotion, name: newValue });
              }}
              className="text-xl font-bold text-promo-black border-0 bg-transparent p-0"
              style={{ fontFamily: 'Righteous, cursive' }}
              data-testid="input-promotion-name"
            />
          ) : (
            <CardTitle className="text-xl font-bold text-promo-black group-hover:text-promo-yellow transition-colors" style={{ fontFamily: 'Righteous, cursive' }}>
              {promotion.name}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Textarea
                  value={editedPromotion.description}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setEditedPromotion({ ...editedPromotion, description: newValue });
                  }}
                  className="text-gray-600 text-sm leading-relaxed mb-4 border-1 bg-white/50 rounded"
                  rows={4}
                  data-testid="textarea-description"
                />
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {promotion.description.length > 120
                    ? `${promotion.description.substring(0, 120)}...`
                    : promotion.description}
                </p>
              )}
              
              {/* Tags and Categories */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {promotion.category}
                  </Badge>
                  {Array.isArray(promotion.tags) && promotion.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {Array.isArray(promotion.tags) && promotion.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{promotion.tags.length - 2}
                    </Badge>
                  )}
                </div>
                {!isEditing && (
                  <span className="text-sm text-gray-500">Ver más →</span>
                )}
              </div>
              
              {/* Extended editing fields when in edit mode */}
              {isEditing && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  {/* Tags editing */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Etiquetas:</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setShowAddTags(!showAddTags)}
                      >
                        ✏️ Editar
                      </Button>
                    </div>
                    
                    {/* Current tags */}
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(editedPromotion.tags) && editedPromotion.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1 hover:bg-red-100"
                            onClick={() => {
                              const newTags = editedPromotion.tags?.filter((_, i) => i !== index) || null;
                              setEditedPromotion({ ...editedPromotion, tags: newTags });
                            }}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                      {(!editedPromotion.tags || editedPromotion.tags.length === 0) && (
                        <span className="text-xs text-gray-400">Sin etiquetas adicionales</span>
                      )}
                    </div>
                  </div>
                  
                  {showAddTags && (
                    <div className="space-y-2 p-2 bg-white rounded border">
                      <div className="text-xs font-medium">Categorías disponibles:</div>
                      <div className="flex flex-wrap gap-1">
                        {[...validCategories, ...customCategories].map((category) => (
                          <Button
                            key={category}
                            type="button"
                            variant={Array.isArray(editedPromotion.tags) && editedPromotion.tags.includes(category) ? "default" : "outline"}
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              const currentTags = Array.isArray(editedPromotion.tags) ? editedPromotion.tags : [];
                              if (currentTags.includes(category)) {
                                const newTags = currentTags.filter(t => t !== category);
                                setEditedPromotion({ ...editedPromotion, tags: newTags.length > 0 ? newTags : null });
                              } else {
                                setEditedPromotion({ ...editedPromotion, tags: [...currentTags, category] });
                              }
                            }}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="flex gap-1">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Nueva etiqueta"
                          className="h-6 text-xs"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && newTag.trim()) {
                              const trimmed = newTag.trim().toLowerCase();
                              const currentTags = Array.isArray(editedPromotion.tags) ? editedPromotion.tags : [];
                              if (!currentTags.includes(trimmed)) {
                                setEditedPromotion({ ...editedPromotion, tags: [...currentTags, trimmed] });
                              }
                              setNewTag("");
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            if (newTag.trim()) {
                              const trimmed = newTag.trim().toLowerCase();
                              const currentTags = Array.isArray(editedPromotion.tags) ? editedPromotion.tags : [];
                              if (!currentTags.includes(trimmed)) {
                                setEditedPromotion({ ...editedPromotion, tags: [...currentTags, trimmed] });
                              }
                              setNewTag("");
                            }
                          }}
                        >
                          +
                        </Button>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setShowAddTags(false)}
                      >
                        Cerrar
                      </Button>
                    </div>
                  )}
                  
                  {/* URL inputs */}
                  <div className="space-y-2">
                    <Label htmlFor="youtube-url">Video de YouTube</Label>
                    <Input
                      id="youtube-url"
                      value={editedPromotion.youtubeCommercialUrl || ""}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setEditedPromotion({ ...editedPromotion, youtubeCommercialUrl: newValue });
                      }}
                      placeholder="URL del comercial de YouTube"
                      data-testid="input-youtube-url"
                    />
                    
                    <Label htmlFor="buffet-url">Video de Buffet Games</Label>
                    <Input
                      id="buffet-url"
                      value={editedPromotion.buffetGamesVideoUrl || ""}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setEditedPromotion({ ...editedPromotion, buffetGamesVideoUrl: newValue });
                      }}
                      placeholder="URL del video de Buffet Games"
                      data-testid="input-buffet-url"
                    />
                  </div>
                </div>
              )}
            </div>
            {((promotion.wrapperPhotosUrls && promotion.wrapperPhotosUrls.length > 0) || promotion.wrapperPhotoUrl) && (
              <div className="flex-shrink-0 w-20 h-24 flex items-center justify-center relative">
                <Dialog>
                  <DialogTrigger asChild>
                    <img 
                      src={(promotion.wrapperPhotosUrls && promotion.wrapperPhotosUrls.length > 0) 
                        ? promotion.wrapperPhotosUrls[0] 
                        : promotion.wrapperPhotoUrl || ''} 
                      alt={`Envoltura ${promotion.name}`}
                      className="w-full h-full object-contain drop-shadow-sm cursor-pointer hover:scale-105 transition-transform"
                      style={{ 
                        transform: `rotate(${wrapperRotation}deg) scale(${(promotion.wrapperScale || 100) / 100})`,
                        position: 'relative',
                        left: `${promotion.wrapperOffsetX || 0}px`,
                        top: `${promotion.wrapperOffsetY || 0}px`
                      }}
                      data-testid="img-wrapper-normal"
                      onClick={(e) => !isEditing && e.preventDefault()}
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full">
                    <div className="flex items-center justify-center p-4">
                      <img 
                        src={(promotion.wrapperPhotosUrls && promotion.wrapperPhotosUrls.length > 0) 
                          ? promotion.wrapperPhotosUrls[0] 
                          : promotion.wrapperPhotoUrl || ''} 
                        alt={`Envoltura ${promotion.name}`}
                        className="max-w-full max-h-[80vh] object-contain"
                        style={{ 
                          transform: `rotate(${wrapperRotation}deg) scale(${(promotion.wrapperScale || 100) / 100})`
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 w-6 h-6 p-0"
                    onClick={handleRotateWrapper}
                    data-testid="button-rotate-wrapper"
                  >
                    <RotateCw className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Image Editor Dialog */}
      {showImageEditor && currentEditingImage && (
        <Dialog open={showImageEditor} onOpenChange={setShowImageEditor}>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>Editor de Imagen</DialogTitle>
            </DialogHeader>
            <div className="relative flex items-center justify-center p-4 bg-gray-100 rounded">
              <div 
                className="relative overflow-hidden bg-white rounded border shadow-lg"
                style={{ 
                  transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transition: 'transform 0.2s ease'
                }}
              >
                <img 
                  src={currentEditingImage} 
                  alt="Editing"
                  className="max-w-[500px] max-h-[400px] object-contain"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 p-4">
              <Button size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={resetImageTransforms}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
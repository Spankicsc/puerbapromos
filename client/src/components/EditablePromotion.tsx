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
  const [wrapperRotation, setWrapperRotation] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [currentEditingImage, setCurrentEditingImage] = useState<string | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

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
      wrapperPhotosUrls: editedPromotion.wrapperPhotosUrls,
      imageUrl: editedPromotion.imageUrl,
      youtubeCommercialUrl: editedPromotion.youtubeCommercialUrl,
      buffetGamesVideoUrl: editedPromotion.buffetGamesVideoUrl,
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
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {editedPromotion.category || "tazos"}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setShowAddCategory(!showAddCategory)}
                      >
                        ✏️ Cambiar
                      </Button>
                    </div>
                    
                    {showAddCategory && (
                      <div className="space-y-2 p-2 bg-white rounded border">
                        <div className="flex flex-wrap gap-1">
                          {[...validCategories, ...customCategories].map((category) => (
                            <Button
                              key={category}
                              type="button"
                              variant={editedPromotion.category === category ? "default" : "outline"}
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => {
                                setEditedPromotion({ ...editedPromotion, category });
                                setShowAddCategory(false);
                              }}
                            >
                              {category}
                            </Button>
                          ))}
                        </div>
                        
                        <div className="flex gap-1">
                          <Input
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Nueva categoría"
                            className="h-6 text-xs"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newCategory.trim()) {
                                const trimmed = newCategory.trim().toLowerCase();
                                if (!validCategories.includes(trimmed) && !customCategories.includes(trimmed)) {
                                  setCustomCategories([...customCategories, trimmed]);
                                  setEditedPromotion({ ...editedPromotion, category: trimmed });
                                }
                                setNewCategory("");
                                setShowAddCategory(false);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              if (newCategory.trim()) {
                                const trimmed = newCategory.trim().toLowerCase();
                                if (!validCategories.includes(trimmed) && !customCategories.includes(trimmed)) {
                                  setCustomCategories([...customCategories, trimmed]);
                                  setEditedPromotion({ ...editedPromotion, category: trimmed });
                                }
                                setNewCategory("");
                                setShowAddCategory(false);
                              }
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
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
            
            {/* Additional Wrapper Photos Section */}
            <div className="mt-4 space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Imágenes de Envolturas</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addWrapperPhoto}
                  data-testid="button-add-wrapper"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Agregar
                </Button>
              </div>
              
              {/* Drag and Drop Zone */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  files.forEach(file => {
                    if (file.type.startsWith('image/')) {
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
                    }
                  });
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
              >
                <div className="text-gray-500">
                  <div className="text-2xl mb-2">📷</div>
                  <p>Arrastra imágenes aquí o </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addWrapperPhoto}
                    className="mt-2"
                  >
                    Seleccionar archivo
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.isArray(editedPromotion.wrapperPhotosUrls) && editedPromotion.wrapperPhotosUrls.map((url: string, index: number) => (
                  <div key={index} className="relative group">
                    <img 
                      src={url} 
                      alt={`Envoltura ${index + 1}`}
                      className="w-full h-16 object-contain bg-white rounded border cursor-pointer hover:scale-105 transition-transform shadow-sm"
                      onClick={() => openImageEditor(url)}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      onClick={() => removeWrapperPhoto(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Image URL Inputs */}
              <div className="space-y-2">
                <Label htmlFor="image-url">Imagen Principal</Label>
                <Input
                  id="image-url"
                  value={editedPromotion.imageUrl || ""}
                  onChange={(e) => setEditedPromotion({ ...editedPromotion, imageUrl: e.target.value })}
                  placeholder="URL de imagen principal"
                  data-testid="input-image-url"
                />
                
                <Label htmlFor="wrapper-url">Envoltura Principal</Label>
                <Input
                  id="wrapper-url"
                  value={editedPromotion.wrapperPhotoUrl || ""}
                  onChange={(e) => setEditedPromotion({ ...editedPromotion, wrapperPhotoUrl: e.target.value })}
                  placeholder="URL de envoltura principal"
                  data-testid="input-wrapper-url"
                />
                
                <Label htmlFor="youtube-url">Video de YouTube</Label>
                <Input
                  id="youtube-url"
                  value={editedPromotion.youtubeCommercialUrl || ""}
                  onChange={(e) => setEditedPromotion({ ...editedPromotion, youtubeCommercialUrl: e.target.value })}
                  placeholder="URL del comercial de YouTube"
                  data-testid="input-youtube-url"
                />
                
                <Label htmlFor="buffet-url">Video de Buffet Games</Label>
                <Input
                  id="buffet-url"
                  value={editedPromotion.buffetGamesVideoUrl || ""}
                  onChange={(e) => setEditedPromotion({ ...editedPromotion, buffetGamesVideoUrl: e.target.value })}
                  placeholder="URL del video de Buffet Games"
                  data-testid="input-buffet-url"
                />
              </div>
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
      
      {/* Enhanced Image Editor Dialog */}
      <Dialog open={showImageEditor} onOpenChange={setShowImageEditor}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Maximize2 className="w-5 h-5 mr-2" />
              Editor de Imagen - {editedPromotion.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4">
            {/* Image Controls */}
            <div className="flex items-center justify-center space-x-4 bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={imageZoom <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {Math.round(imageZoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={imageZoom >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotateWrapper}
                >
                  <RotateCw className="w-4 h-4 mr-1" />
                  Rotar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetImageTransforms}
                >
                  Resetear
                </Button>
              </div>
            </div>
            
            {/* Image Display Area */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8 min-h-[400px] overflow-hidden">
              {currentEditingImage && (
                <div 
                  className="cursor-move"
                  style={{
                    transform: `scale(${imageZoom}) rotate(${wrapperRotation}deg) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseDown={(e) => {
                    const startX = e.clientX - imagePosition.x;
                    const startY = e.clientY - imagePosition.y;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      setImagePosition({
                        x: e.clientX - startX,
                        y: e.clientY - startY
                      });
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                >
                  <img 
                    src={currentEditingImage} 
                    alt="Imagen en edición"
                    className="max-w-full max-h-[400px] object-contain drop-shadow-lg"
                    draggable={false}
                  />
                </div>
              )}
            </div>
            
            {/* Tips */}
            <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <div className="flex items-center justify-center space-x-4">
                <span className="flex items-center">
                  <Move className="w-4 h-4 mr-1" />
                  Arrastra para mover
                </span>
                <span className="flex items-center">
                  <ZoomIn className="w-4 h-4 mr-1" />
                  Botones para zoom
                </span>
                <span className="flex items-center">
                  <RotateCw className="w-4 h-4 mr-1" />
                  Rotar en incrementos de 90°
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { PromotionItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { MultipleImageUploader } from "./MultipleImageUploader";
import { ImageWithDescriptionUploader } from "./ImageWithDescriptionUploader";

interface ItemDetailModalProps {
  item: PromotionItem | null;
  isOpen: boolean;
  onClose: () => void;
  promotionSlug: string;
}

export function ItemDetailModal({ item, isOpen, onClose, promotionSlug }: ItemDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<PromotionItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [fullImageView, setFullImageView] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleEdit = () => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsEditing(false);
  };

  const handleUploadImages = async (images: Array<{ url: string; description: string }>) => {
    if (!item?.id) return;
    
    try {
      const imageUrls = images.map(img => img.url);
      const imageDescriptions: Record<string, string> = {};
      images.forEach(img => {
        imageDescriptions[img.url] = img.description;
      });

      await apiRequest('PUT', `/api/promotion-items/${item.id}/images`, {
        imageUrls,
        imageDescriptions
      });
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/promotions', promotionSlug, 'items'] });
      
      toast({
        title: 'Imágenes subidas',
        description: `Se agregaron ${images.length} imagen(es) con descripciones.`,
      });
    } catch (error) {
      console.error('Error uploading item images:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron subir las imágenes.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    try {
      setIsSaving(true);
      
      const updateData = {
        name: editingItem.name,
        description: editingItem.description,
        rarity: editingItem.rarity,
        itemNumber: editingItem.itemNumber
      };

      const updatedItem = await apiRequest("PUT", `/api/promotion-items/${editingItem.id}`, updateData);
      
      // Actualizar el item directamente en el caché
      queryClient.setQueryData(['/api/promotions', promotionSlug, 'items'], (oldData: PromotionItem[]) => {
        if (!oldData) return oldData;
        return oldData.map(item => 
          item.id === editingItem.id ? { ...item, ...updateData } : item
        );
      });

      // También invalidar para asegurar que se actualice
      await queryClient.invalidateQueries({ queryKey: ['/api/promotions', promotionSlug, 'items'] });
      
      toast({
        title: 'Pieza actualizada',
        description: 'Los cambios se han guardado correctamente.',
      });
      
      setIsEditing(false);
      setEditingItem(null);
      onClose();
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la pieza.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return await apiRequest("DELETE", `/api/promotion-items/${itemId}`);
    },
    onSuccess: (_, deletedItemId) => {
      // Actualizar el caché removiendo el item eliminado usando el ID correcto
      queryClient.setQueryData(['/api/promotions', promotionSlug, 'items'], (oldData: PromotionItem[]) => {
        if (!oldData) return oldData;
        return oldData.filter(i => i.id !== deletedItemId);
      });

      // También invalidar para asegurar que se actualice
      queryClient.invalidateQueries({ queryKey: ['/api/promotions', promotionSlug, 'items'] });
      
      toast({
        title: 'Pieza eliminada',
        description: 'La pieza se ha eliminado correctamente.',
      });
      
      onClose(); // Cerrar el modal después de eliminar
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la pieza.',
        variant: 'destructive',
      });
    },
  });

  const getRarityColor = (rarity: string | null) => {
    switch (rarity) {
      case "common": return "bg-gray-500";
      case "rare": return "bg-blue-500";
      case "super_rare": return "bg-purple-500";
      case "ultra_rare": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  const getRarityLabel = (rarity: string | null) => {
    switch (rarity) {
      case "common": return "Común";
      case "rare": return "Rara";
      case "super_rare": return "Súper Rara";
      case "ultra_rare": return "Ultra Rara";
      default: return "No especificada";
    }
  };

  if (!item) return null;

  const currentItem = editingItem || item;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold" data-testid="text-item-title">
                {currentItem.name}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isSaving}
                      data-testid="button-cancel-edit"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                      data-testid="button-save-item"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {isSaving ? "Guardando..." : "Guardar"}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isSaving}
                          data-testid="button-delete-item-editing"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar pieza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. La pieza "{currentItem.name}" será eliminada permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(item.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm" 
                      onClick={handleEdit}
                      data-testid="button-edit-item"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          data-testid="button-delete-item"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar pieza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. La pieza "{currentItem.name}" será eliminada permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(item.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
            <DialogDescription className="text-sm text-gray-600">
              Vista detallada de la pieza. Haz clic en "Editar" para modificar la información.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Imágenes</Label>
                <ImageWithDescriptionUploader
                  maxNumberOfFiles={5}
                  onComplete={handleUploadImages}
                  buttonClassName="text-xs h-8"
                />
              </div>
              
              {/* Primary Image */}
              {currentItem.imageUrl && (
                <div className="mb-4">
                  <img
                    src={currentItem.imageUrl}
                    alt={currentItem.name}
                    className="max-w-full max-h-96 object-contain rounded-lg shadow-lg mx-auto cursor-pointer hover:opacity-80 transition-opacity"
                    data-testid="img-item-full"
                    onClick={() => setFullImageView(currentItem.imageUrl!)}
                  />
                </div>
              )}
              
              {/* Additional Images */}
              {currentItem.imageUrls && currentItem.imageUrls.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Imágenes adicionales</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {currentItem.imageUrls.map((url, index) => (
                      <div key={index} className="space-y-1">
                        <img
                          src={url}
                          alt={`${currentItem.name} - imagen ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg shadow cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setFullImageView(url)}
                          data-testid={`img-additional-${index}`}
                        />
                        {currentItem.imageDescriptions && currentItem.imageDescriptions[url] && (
                          <p className="text-xs text-gray-600 text-center" data-testid={`text-image-description-${index}`}>
                            {currentItem.imageDescriptions[url]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!currentItem.imageUrl && (!currentItem.imageUrls || currentItem.imageUrls.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay imágenes disponibles</p>
                  <p className="text-xs mt-1">Haz clic en "Agregar Imágenes" para subir fotos</p>
                </div>
              )}
            </div>

            {/* Item Name */}
            <div>
              <Label htmlFor="item-name" className="text-sm font-medium">Nombre del Promocional</Label>
              {isEditing ? (
                <Input
                  id="item-name"
                  value={currentItem.name}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="mt-1"
                  data-testid="input-item-name"
                />
              ) : (
                <div className="mt-1 p-2 bg-gray-50 rounded-md font-medium" data-testid="text-item-name-display">
                  {currentItem.name}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rarity" className="text-sm font-medium">Rareza</Label>
                {isEditing ? (
                  <select
                    id="rarity"
                    value={currentItem.rarity || ""}
                    onChange={(e) => setEditingItem(prev => prev ? {...prev, rarity: e.target.value || null} : null)}
                    className="w-full mt-1 p-2 border rounded-md"
                    data-testid="select-item-rarity"
                  >
                    <option value="">No especificada</option>
                    <option value="common">Común</option>
                    <option value="rare">Rara</option>
                    <option value="super_rare">Súper Rara</option>
                    <option value="ultra_rare">Ultra Rara</option>
                  </select>
                ) : (
                  <Badge className={`${getRarityColor(currentItem.rarity)} text-white mt-1`} data-testid="badge-item-rarity">
                    {getRarityLabel(currentItem.rarity)}
                  </Badge>
                )}
              </div>

              <div>
                <Label htmlFor="itemNumber" className="text-sm font-medium">Número</Label>
                {isEditing ? (
                  <Input
                    id="itemNumber"
                    type="number"
                    value={currentItem.itemNumber || ""}
                    onChange={(e) => setEditingItem(prev => prev ? {...prev, itemNumber: e.target.value ? parseInt(e.target.value) : null} : null)}
                    className="mt-1"
                    data-testid="input-item-number"
                  />
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded-md" data-testid="text-item-number">
                    {currentItem.itemNumber ? `#${currentItem.itemNumber}` : "No especificado"}
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={currentItem.description || ""}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, description: e.target.value || null} : null)}
                  placeholder="Añade una descripción para esta pieza..."
                  className="mt-1 min-h-[120px]"
                  data-testid="textarea-item-description"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-[120px]" data-testid="text-item-description">
                  {currentItem.description || (
                    <span className="text-gray-500 italic">Sin descripción</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Image Modal */}
      {fullImageView && (
        <Dialog open={!!fullImageView} onOpenChange={() => setFullImageView(null)}>
          <DialogContent className="max-w-4xl w-full p-2">
            <DialogHeader className="sr-only">
              <DialogTitle>Vista completa de imagen</DialogTitle>
              <DialogDescription>Imagen mostrada en tamaño completo</DialogDescription>
            </DialogHeader>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setFullImageView(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <img
                src={fullImageView}
                alt="Vista completa"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
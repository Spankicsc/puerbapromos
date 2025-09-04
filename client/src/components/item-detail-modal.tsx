import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X } from "lucide-react";
import { PromotionItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-item-detail">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold" data-testid="text-item-name">
              {isEditing ? (
                <Input
                  value={currentItem.name}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="text-xl font-bold"
                  data-testid="input-item-name"
                />
              ) : (
                currentItem.name
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={isSaving}
                    data-testid="button-save-item"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {isSaving ? "Guardando..." : "Guardar"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCancel}
                    data-testid="button-cancel-edit"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm" 
                  onClick={handleEdit}
                  data-testid="button-edit-item"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            Vista detallada de la pieza. Haz clic en "Editar" para modificar la información.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Section */}
          {currentItem.imageUrl && (
            <div className="flex justify-center">
              <img
                src={currentItem.imageUrl}
                alt={currentItem.name}
                className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                data-testid="img-item-full"
              />
            </div>
          )}

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
  );
}
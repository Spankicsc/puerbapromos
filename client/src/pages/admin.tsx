import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Database, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface AdminExportData {
  brands: any[];
  promotions: any[];
  timestamp: string;
  total_brands: number;
  total_promotions: number;
}

export default function AdminPage() {
  const [exportData, setExportData] = useState<AdminExportData | null>(null);
  const queryClient = useQueryClient();

  const { data: promotions } = useQuery<any[]>({
    queryKey: ['/api/promotions'],
  });

  const { data: brands } = useQuery<any[]>({
    queryKey: ['/api/brands'],
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/export');
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setExportData(data);
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/reset-and-seed', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to reset database');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promotions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      setExportData(null);
    },
  });

  const downloadExportData = () => {
    if (!exportData) return;
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `promospedia-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-promo-yellow/20 via-orange-50 to-promo-yellow/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="nostalgia-text text-4xl font-bold text-promo-black flex items-center justify-center drop-shadow-lg">
            <Database className="w-8 h-8 mr-3 text-promo-yellow" />
            Panel de Administración
          </h1>
          <p className="text-xl text-gray-600 mt-4">
            Administra la sincronización de datos entre desarrollo y deployment
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Problema identificado:</strong> El preview (desarrollo) y el deployment (producción) usan bases de datos separadas. 
            Los cambios hechos en el modo editor del preview no aparecen automáticamente en el deployment. 
            Use este panel para sincronizar los datos.
          </AlertDescription>
        </Alert>

        {/* Current Status */}
        <Card className="card-splat mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Estado Actual (Desarrollo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-promo-black">
                  {brands?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Marcas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-promo-black">
                  {promotions?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Promociones</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card className="card-splat mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2 text-blue-600" />
              Exportar Datos Actuales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Exporta todos los datos actuales del desarrollo (incluyendo tus cambios del modo editor).
            </p>
            
            <Button
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
              className="btn-splat bg-blue-600 hover:bg-blue-700"
              data-testid="button-export-data"
            >
              {exportMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Datos
                </>
              )}
            </Button>

            {exportData && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-green-800">Datos Exportados</h4>
                  <Badge variant="secondary">
                    {exportData.timestamp}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="font-medium">Marcas:</span> {exportData.total_brands}
                  </div>
                  <div>
                    <span className="font-medium">Promociones:</span> {exportData.total_promotions}
                  </div>
                </div>
                <Button
                  onClick={downloadExportData}
                  size="sm"
                  variant="outline"
                  className="w-full"
                  data-testid="button-download-export"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar JSON
                </Button>
              </div>
            )}

            {exportMutation.isError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  Error al exportar datos: {exportMutation.error?.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Reset Section */}
        <Card className="card-splat">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <RefreshCw className="w-5 h-5 mr-2" />
              Sincronizar con Deployment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-orange-700">
                <strong>Atención:</strong> Esta acción forzará que el deployment use los mismos datos que el desarrollo. 
                Esto debería hacer que tus cambios del modo editor aparezcan en el deployment.
              </AlertDescription>
            </Alert>

            <p className="text-gray-600">
              Al realizar esta acción, la base de datos se reseteará con los datos iniciales actualizados, 
              incluyendo todos los cambios que hayas hecho en el modo editor.
            </p>
            
            <Button
              onClick={() => resetMutation.mutate()}
              disabled={resetMutation.isPending}
              className="btn-splat bg-orange-600 hover:bg-orange-700"
              data-testid="button-sync-deployment"
            >
              {resetMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sincronizar con Deployment
                </>
              )}
            </Button>

            {resetMutation.isError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  Error al sincronizar: {resetMutation.error?.message}
                </AlertDescription>
              </Alert>
            )}

            {resetMutation.isSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-700">
                  ¡Sincronización completada! Los datos se han actualizado exitosamente.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
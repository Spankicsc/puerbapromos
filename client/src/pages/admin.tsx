import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Download, Upload, ArrowRight, Database, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sourceUrl, setSourceUrl] = useState('');
  
  // Get current data stats
  const { data: exportData, isLoading: isExporting, refetch: refetchExport } = useQuery({
    queryKey: ['/api/sync/export'],
    queryFn: async () => {
      const response = await fetch('/api/sync/export');
      if (!response.ok) throw new Error('Failed to export data');
      return response.json();
    }
  });

  // Get all promotions by brand for display
  const { data: brands } = useQuery({ queryKey: ['/api/brands'] });
  const { data: promotions } = useQuery({ queryKey: ['/api/promotions'] });

  // Migration mutation
  const migrationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/migrate/vuala-to-gamesa', { method: 'POST' });
      if (!response.ok) throw new Error('Migration failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Migración completada",
        description: `Se movieron ${data.migratedCount} promociones de Vualá a Gamesa`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/promotions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
    },
    onError: () => {
      toast({
        title: "❌ Error en migración",
        description: "No se pudo completar la migración",
        variant: "destructive"
      });
    }
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/sync/import', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Import failed');
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "✅ Importación completada", 
        description: `${result.stats.created} creados, ${result.stats.updated} actualizados`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/promotions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      refetchExport();
    }
  });

  // Full sync mutation
  const fullSyncMutation = useMutation({
    mutationFn: async (sourceUrl: string) => {
      const response = await fetch('/api/sync/full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceUrl })
      });
      if (!response.ok) throw new Error('Sync failed');
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "🔄 Sincronización completada",
        description: `Datos sincronizados desde ${result.source}. ${result.stats.created} creados, ${result.stats.updated} actualizados`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/promotions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      refetchExport();
    },
    onError: (error: any) => {
      toast({
        title: "❌ Error de sincronización",
        description: error.message || "No se pudo completar la sincronización",
        variant: "destructive"
      });
    }
  });

  const downloadExport = () => {
    if (exportData) {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `promospedia-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Calculate promotion counts by brand
  const promotionsByBrand = promotions && brands ? promotions.reduce((acc: any, promo: any) => {
    const brand = brands.find((b: any) => b.id === promo.brandId);
    if (brand) {
      acc[brand.name] = (acc[brand.name] || 0) + 1;
    }
    return acc;
  }, {}) : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sincronización de datos entre Preview y Deployment
          </p>
        </div>

        {/* Current Environment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Estado Actual de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isExporting ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Cargando datos...</span>
              </div>
            ) : exportData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {exportData.counts.brands}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Marcas</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {exportData.counts.promotions}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Promociones</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {exportData.counts.items}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Items</div>
                </div>
              </div>
            ) : null}

            {promotionsByBrand && (
              <div>
                <h4 className="font-medium mb-2">Promociones por Marca:</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(promotionsByBrand).map(([brand, count]) => (
                    <Badge key={brand} variant="outline" className="px-3 py-1">
                      {brand}: {count as number}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={() => refetchExport()} 
                variant="outline"
                data-testid="button-refresh"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button 
                onClick={downloadExport} 
                disabled={!exportData}
                data-testid="button-download"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Migration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Migración Vualá → Gamesa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Esta migración mueve todas las promociones de Vualá anteriores al 2017 hacia Gamesa.</strong>
                  <br />Solo se ejecuta en el ambiente de deployment.
                </div>
              </div>
              
              <Button 
                onClick={() => migrationMutation.mutate()}
                disabled={migrationMutation.isPending}
                data-testid="button-migrate"
              >
                {migrationMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Migrando...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Ejecutar Migración
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Full Sync */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Sincronización Completa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourceUrl">URL del Preview (origen de datos):</Label>
              <Input
                id="sourceUrl"
                placeholder="https://tu-preview-url.replit.app"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                data-testid="input-source-url"
              />
              <p className="text-sm text-gray-500">
                La URL del ambiente de preview desde donde copiar todos los datos
              </p>
            </div>
            
            <Button 
              onClick={() => fullSyncMutation.mutate(sourceUrl)}
              disabled={!sourceUrl || fullSyncMutation.isPending}
              data-testid="button-full-sync"
            >
              {fullSyncMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar Todo
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Separator />

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Ambiente actual: <Badge variant="outline">{exportData?.environment || 'unknown'}</Badge>
          </p>
          {exportData?.version && (
            <p className="mt-1">
              Última actualización: {new Date(exportData.version).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
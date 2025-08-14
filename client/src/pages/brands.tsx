import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Calendar, Palette } from "lucide-react";
import { type Brand } from "@shared/schema";

const Brands = () => {
  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-promo-black mb-4 flex items-center justify-center">
            <Building2 className="w-8 h-8 mr-3 text-promo-yellow" />
            Marcas Nostálgicas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre las marcas mexicanas que marcaron tu infancia con sus inolvidables promociones de colección
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands?.map((brand) => (
            <Link key={brand.id} href={`/marcas/${brand.slug}`} data-testid={`link-brand-${brand.slug}`}>
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/95 backdrop-blur-sm border-2 hover:border-promo-yellow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-promo-black group-hover:text-promo-yellow transition-colors">
                      {brand.name}
                    </CardTitle>
                    {brand.founded && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {brand.founded}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-gray-500" />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: brand.primaryColor }}
                    />
                    <span className="text-sm text-gray-500 font-mono">
                      {brand.primaryColor}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3 leading-relaxed">
                    {brand.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-promo-yellow font-semibold group-hover:underline">
                      Ver promociones →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {brands && brands.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-2xl font-semibold text-promo-black mb-2">
              No hay marcas disponibles
            </h3>
            <p className="text-gray-600">
              Estamos trabajando en catalogar más marcas nostálgicas mexicanas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brands;
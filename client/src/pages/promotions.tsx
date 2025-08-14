import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Package, Tag, Filter } from "lucide-react";
import { useState } from "react";
import { type Promotion, type Brand } from "@shared/schema";

const Promotions = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const { data: promotions, isLoading: promotionsLoading } = useQuery<Promotion[]>({
    queryKey: ['/api/promotions'],
  });

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  const getBrand = (brandId: string) => {
    return brands?.find(brand => brand.id === brandId);
  };

  const getUniqueCategories = () => {
    if (!promotions) return [];
    const categories = [...new Set(promotions.map(p => p.category))];
    return categories.sort();
  };

  const filteredPromotions = promotions?.filter(promotion => {
    if (selectedCategory && promotion.category !== selectedCategory) return false;
    if (selectedBrand && promotion.brandId !== selectedBrand) return false;
    return true;
  });

  if (promotionsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
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
            <Package className="w-8 h-8 mr-3 text-promo-yellow" />
            Promociones Nostálgicas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revive los recuerdos de las promociones más icónicas de las marcas mexicanas
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-promo-yellow" />
            <h3 className="text-lg font-semibold text-promo-black">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? "bg-promo-yellow text-promo-black hover:bg-yellow-400" : ""}
                >
                  Todas
                </Button>
                {getUniqueCategories().map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-promo-yellow text-promo-black hover:bg-yellow-400" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedBrand === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBrand(null)}
                  className={selectedBrand === null ? "bg-promo-yellow text-promo-black hover:bg-yellow-400" : ""}
                >
                  Todas
                </Button>
                {brands?.map((brand) => (
                  <Button
                    key={brand.id}
                    variant={selectedBrand === brand.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedBrand(brand.id)}
                    className={selectedBrand === brand.id ? "bg-promo-yellow text-promo-black hover:bg-yellow-400" : ""}
                  >
                    {brand.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPromotions?.map((promotion) => {
            const brand = getBrand(promotion.brandId);
            return (
              <Link key={promotion.id} href={`/promociones/${promotion.slug}`} data-testid={`link-promotion-${promotion.slug}`}>
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/95 backdrop-blur-sm border-2 hover:border-promo-yellow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-promo-black group-hover:text-promo-yellow transition-colors line-clamp-2">
                          {promotion.name}
                        </CardTitle>
                        {brand && (
                          <p className="text-sm text-gray-500 mt-1 font-medium">
                            {brand.name}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        <Tag className="w-3 h-3 mr-1" />
                        {promotion.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {promotion.startYear}
                          {promotion.endYear && promotion.endYear !== promotion.startYear && ` - ${promotion.endYear}`}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                      {promotion.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-promo-yellow font-semibold group-hover:underline">
                        Ver promoción →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPromotions && filteredPromotions.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-promo-black mb-2">
              No hay promociones disponibles
            </h3>
            <p className="text-gray-600">
              {selectedCategory || selectedBrand 
                ? "No se encontraron promociones con los filtros seleccionados."
                : "Estamos trabajando en catalogar más promociones nostálgicas."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;
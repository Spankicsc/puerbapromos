import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, Filter, Calendar, Tag } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { type Promotion, type Brand } from "@shared/schema";
import { EditablePromotion } from "@/components/EditablePromotion";
import { getBrandLogo } from "@/utils/brandLogos";

const SearchPage = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Extract query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
  }, [location]);

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
    const categories = promotions.map(p => p.category);
    return Array.from(new Set(categories));
  };

  const filteredPromotions = promotions?.filter(promotion => {
    // Search only in promotion name
    const matchesSearch = !searchQuery || 
      promotion.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || promotion.category === selectedCategory;
    const matchesBrand = !selectedBrand || promotion.brandId === selectedBrand;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  if (promotionsLoading) {
    return (
      <div className="bg-promo-gray min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 space-y-4">
                  <div className="h-40 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-promo-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-promo-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-promo-black">
              Resultados de búsqueda
            </h1>
            {searchQuery && (
              <p className="text-gray-600 mt-1">
                Buscando: "{searchQuery}" ({filteredPromotions?.length || 0} resultados)
              </p>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre de promoción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
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
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? "bg-promo-yellow text-promo-black" : "text-gray-600"}
                >
                  Todas
                </Button>
                {getUniqueCategories().map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-promo-yellow text-promo-black" : "text-gray-600"}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
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
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBrand(null)}
                  className={selectedBrand === null ? "bg-promo-yellow text-promo-black" : "text-gray-600"}
                >
                  Todas
                </Button>
                {brands?.map((brand) => (
                  <Button
                    key={brand.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBrand(brand.id)}
                    className={selectedBrand === brand.id ? "bg-promo-yellow text-promo-black" : "text-gray-600"}
                  >
                    <img 
                      src={brand.logoUrl || getBrandLogo(brand.slug) || ''} 
                      alt={brand.name}
                      className="w-4 h-4 mr-1 object-contain"
                    />
                    {brand.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPromotions && filteredPromotions.length > 0 ? (
            filteredPromotions.map((promotion) => {
              const brand = getBrand(promotion.brandId);
              return (
                <EditablePromotion
                  key={promotion.id}
                  promotion={promotion}
                  isEditable={false}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? `No hay promociones que coincidan con "${searchQuery}"`
                  : "Intenta ajustar los filtros de búsqueda"
                }
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                }}
                className="bg-promo-yellow text-promo-black hover:bg-yellow-500"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
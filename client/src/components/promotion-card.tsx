import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Promotion } from "@shared/schema";

interface PromotionCardProps {
  promotion: Promotion;
  brandName?: string;
  itemCount?: number;
}

const PromotionCard = ({ promotion, brandName, itemCount = 0 }: PromotionCardProps) => {
  const getBrandColor = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'sabritas':
        return 'bg-red-100 text-red-800';
      case 'gamesa':
        return 'bg-blue-100 text-blue-800';
      case 'barcel':
        return 'bg-green-100 text-green-800';
      case 'bimbo':
        return 'bg-yellow-100 text-yellow-800';
      case 'marinela':
        return 'bg-pink-100 text-pink-800';
      case 'vualá':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getYearRange = () => {
    if (promotion.endYear) {
      return `${promotion.startYear}-${promotion.endYear}`;
    }
    return `${promotion.startYear}-presente`;
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        {promotion.imageUrl && (
          <img 
            src={promotion.imageUrl} 
            alt={promotion.name}
            className="w-full h-48 object-cover"
            data-testid={`img-promotion-${promotion.slug}`}
          />
        )}
        {!promotion.imageUrl && (
          <div className="w-full h-48 bg-gradient-to-r from-promo-yellow to-yellow-400 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          {brandName && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getBrandColor(brandName)}`}>
              {brandName}
            </span>
          )}
          <span className="text-gray-500 text-sm" data-testid={`text-year-${promotion.slug}`}>
            {getYearRange()}
          </span>
        </div>
        <h4 className="text-xl font-bold text-promo-black mb-2" data-testid={`text-promotion-name-${promotion.slug}`}>
          {promotion.name}
        </h4>
        <p className="text-gray-600 mb-4 line-clamp-3" data-testid={`text-promotion-description-${promotion.slug}`}>
          {promotion.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500" data-testid={`text-item-count-${promotion.slug}`}>
            {itemCount}+ items
          </span>
          <Link href={`/promociones/${promotion.slug}`} data-testid={`link-promotion-${promotion.slug}`}>
            <Button className="bg-promo-yellow text-promo-black hover:bg-yellow-500 transition-colors font-semibold">
              Ver colección
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionCard;

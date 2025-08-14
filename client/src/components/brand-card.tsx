import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { type Brand } from "@shared/schema";

interface BrandCardProps {
  brand: Brand;
  promotionCount: number;
}

const BrandCard = ({ brand, promotionCount }: BrandCardProps) => {
  const getIconForBrand = (brandName: string) => {
    switch (brandName.toLowerCase()) {
      case 'sabritas':
        return '🥔';
      case 'gamesa':
        return '🍪';
      case 'barcel':
        return '🍬';
      case 'bimbo':
        return '🍞';
      case 'marinela':
        return '🧁';
      case 'vualá':
        return '🍦';
      default:
        return '📦';
    }
  };

  return (
    <Link href={`/marcas/${brand.slug}`} data-testid={`link-brand-${brand.slug}`}>
      <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <CardContent className="p-6 text-center">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform text-2xl"
            style={{ backgroundColor: brand.primaryColor }}
          >
            {getIconForBrand(brand.name)}
          </div>
          <h4 className="font-semibold text-promo-black mb-2" data-testid={`text-brand-name-${brand.slug}`}>
            {brand.name}
          </h4>
          <p className="text-sm text-gray-600" data-testid={`text-promotion-count-${brand.slug}`}>
            {promotionCount} promociones
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BrandCard;

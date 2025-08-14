import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { type Brand } from "@shared/schema";

interface BrandCardProps {
  brand: Brand;
  promotionCount: number;
}

const BrandCard = ({ brand, promotionCount }: BrandCardProps) => {
  return (
    <Link href={`/marcas/${brand.slug}`} data-testid={`link-brand-${brand.slug}`}>
      <Card className="group overflow-hidden card-splat cursor-pointer bg-promo-yellow/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4 text-center">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden"
            style={{ backgroundColor: brand.primaryColor }}
          >
            {brand.logoUrl ? (
              <img 
                src={brand.logoUrl} 
                alt={`${brand.name} logo`}
                className="w-12 h-12 object-contain"
                data-testid={`img-brand-logo-${brand.slug}`}
              />
            ) : (
              <span className="text-2xl text-white font-bold">
                {brand.name.charAt(0)}
              </span>
            )}
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

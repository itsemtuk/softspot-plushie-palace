
import React from 'react';
import { Heart, Star, MapPin, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MarketplacePlushie } from '@/types/marketplace';
import { RobustImage } from '@/components/ui/robust-image';

interface ProductCardProps {
  product: MarketplacePlushie;
  onProductClick: (product: MarketplacePlushie) => void;
  onWishlistToggle: (id: string, event: React.MouseEvent) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductClick,
  onWishlistToggle,
  isWishlisted
}) => {
  // Add null checks and fallbacks
  if (!product) {
    return null;
  }

  const {
    id = '',
    title = 'Unnamed Plushie',
    price = 0,
    imageUrl = '',
    image = '',
    username = 'Unknown',
    location = '',
    deliveryCost = 0,
    discount = 0,
    originalPrice = null,
    likes = 0,
    condition = 'Unknown'
  } = product;

  // Ensure price is a number
  const safePrice = typeof price === 'number' ? price : parseFloat(String(price)) || 0;
  const safeDeliveryCost = typeof deliveryCost === 'number' ? deliveryCost : parseFloat(String(deliveryCost)) || 0;
  const safeDiscount = typeof discount === 'number' ? discount : parseFloat(String(discount)) || 0;
  const safeLikes = typeof likes === 'number' ? likes : parseInt(String(likes)) || 0;
  
  const displayPrice = safePrice.toFixed(2);
  const isOnSale = safeDiscount > 0;
  const originalPriceValue = originalPrice ? (typeof originalPrice === 'number' ? originalPrice : parseFloat(String(originalPrice))) : null;
  
  // Use imageUrl first, fallback to image, then to placeholder
  const displayImage = imageUrl || image || '/placeholder.svg';

  const handleCardClick = () => {
    onProductClick(product);
  };

  const handleWishlistClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onWishlistToggle(id, event);
  };

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative" onClick={handleCardClick}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <RobustImage
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            showLoadingSpinner={true}
          />
        </div>
        
        {/* Wishlist button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 h-8 w-8 rounded-full ${
            isWishlisted 
              ? 'bg-red-100 text-red-500 hover:bg-red-200' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
          onClick={handleWishlistClick}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>

        {/* Discount badge */}
        {isOnSale && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
            -{safeDiscount}%
          </Badge>
        )}

        {/* Free shipping badge */}
        {safeDeliveryCost === 0 && (
          <Badge className="absolute bottom-2 left-2 bg-green-500 hover:bg-green-600 text-white text-xs">
            <Truck className="h-3 w-3 mr-1" />
            Free Shipping
          </Badge>
        )}
      </div>

      <CardContent className="p-3" onClick={handleCardClick}>
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-softspot-600">
              ${displayPrice}
            </span>
            {isOnSale && originalPriceValue && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPriceValue.toFixed(2)}
              </span>
            )}
          </div>

          {/* Seller info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{username}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{safeLikes}</span>
            </div>
          </div>

          {/* Location and condition */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
            )}
            <Badge variant="outline" className="text-xs">
              {condition}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

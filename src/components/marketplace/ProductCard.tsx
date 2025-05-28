import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { MarketplacePlushie } from "@/types/marketplace";
import { BrandLogo } from "../brand/BrandLogo";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: MarketplacePlushie;
  onProductClick: (product: MarketplacePlushie) => void;
  onWishlistToggle: (id: string, event: React.MouseEvent) => void;
  isWishlisted?: boolean;
}

export const ProductCard = ({ 
  product, 
  onProductClick, 
  onWishlistToggle,
  isWishlisted = false
}: ProductCardProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const isCurrentUserProduct = user?.id === product.userId;
  
  // Format the date
  const formattedDate = product.timestamp ? 
    formatDistanceToNow(new Date(product.timestamp), { addSuffix: true }) : 
    'Recently';

  // Check if the product has reviews
  const hasReviews = product.reviews && product.reviews.length > 0;
  
  // Calculate average rating only if there are reviews
  const avgRating = hasReviews ? 
    product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length : 
    0;
  
  // Format original price and current price for display
  const originalPrice = product.originalPrice || product.price;
  const currentPrice = product.discount ? 
    product.price - (product.price * (product.discount / 100)) : 
    product.price;
  
  // Format shipping info with proper number handling
  const deliveryCost = typeof product.deliveryCost === 'number' ? product.deliveryCost : 0;
  const shippingInfo = deliveryCost === 0 ? 
    "Free shipping" : 
    `+$${deliveryCost.toFixed(2)} shipping`;
    
  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.userId) {
      // Check if this is the current user's product
      if (isCurrentUserProduct) {
        navigate('/profile');
      } else {
        navigate(`/user/${product.userId}`);
      }
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to checkout with this product
    navigate(`/checkout?item=${product.id}`);
  };

  // Default image fallback
  const fallbackImage = "https://via.placeholder.com/400x400?text=No+Image";

  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md cursor-pointer h-full flex flex-col ${isCurrentUserProduct ? 'ring-2 ring-softspot-300' : ''}`}
      onClick={() => onProductClick(product)}
    >
      <div className="relative">
        {/* Discount badge */}
        {product.discount && product.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 z-10">
            {product.discount}% OFF
          </Badge>
        )}
        
        {/* Owner badge - show if it's the current user's product */}
        {isCurrentUserProduct && (
          <Badge className="absolute top-2 left-2 bg-softspot-500 z-10">
            Your listing
          </Badge>
        )}
        
        {/* Wishlist button */}
        <button
          className={`absolute top-2 right-2 p-1.5 rounded-full z-10 ${isWishlisted ? 'bg-red-100' : 'bg-white bg-opacity-75'}`}
          onClick={(e) => onWishlistToggle(product.id, e)}
        >
          <Heart 
            className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-gray-500'}`} 
          />
        </button>
        
        {/* Product image */}
        <AspectRatio ratio={1} className="bg-gray-100">
          <img
            src={product.image || fallbackImage}
            alt={product.title || "Plushie"}
            className="object-cover w-full h-full"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </AspectRatio>
      </div>
      
      <CardContent className="p-3 flex-grow flex flex-col">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center">
            {product.brand && (
              <div className="mr-2 flex-shrink-0">
                <BrandLogo brandName={product.brand} className="w-6 h-6" />
              </div>
            )}
            <p className="text-xs text-gray-500 truncate">{product.brand || 'Unknown brand'}</p>
          </div>
          
          {/* User profile section */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={handleProfileClick}
          >
            <Avatar className="h-6 w-6 mr-1">
              <AvatarImage src={`/assets/avatars/PLUSH_Bear.PNG`} alt={product.username || ""} />
              <AvatarFallback>{product.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500 hover:text-softspot-500">
              {product.username || "Anonymous"}
            </span>
          </div>
        </div>
        
        <h3 className="font-medium line-clamp-2 mb-1 flex-grow">{product.title}</h3>
        
        <div className="flex flex-col gap-1 mt-auto">
          {/* Price section */}
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg">
              ${currentPrice.toFixed(2)}
            </span>
            {product.discount && product.discount > 0 && (
              <span className="text-gray-500 text-xs line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Shipping and ratings */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{shippingInfo}</span>
            
            {hasReviews ? (
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{avgRating.toFixed(1)}</span>
              </div>
            ) : (
              <span className="text-gray-400">No reviews</span>
            )}
          </div>
          
          {/* Buy Now button */}
          <Button 
            className="mt-3 bg-softspot-500 hover:bg-softspot-600 text-white w-full text-sm h-9"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { MarketplacePlushie } from "@/types/marketplace";

interface ProductCardProps {
  plushie: MarketplacePlushie;
  onProductClick: (plushie: MarketplacePlushie) => void;
  onWishlistToggle: (id: string, event: React.MouseEvent) => void;
  viewMode?: "grid" | "list";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  plushie,
  onProductClick,
  onWishlistToggle,
  viewMode = "grid"
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on wishlist button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    console.log("ProductCard: Card clicked, calling onProductClick");
    onProductClick(plushie);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlistToggle(plushie.id, e);
  };

  if (viewMode === "list") {
    return (
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200 mb-4"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              {plushie.image || plushie.imageUrl ? (
                <img
                  src={plushie.image || plushie.imageUrl}
                  alt={plushie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg truncate">{plushie.title}</h3>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-xl font-bold text-green-600">
                    ${plushie.price?.toFixed(2) || '0.00'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleWishlistClick}
                    className="p-1"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {plushie.description}
              </p>
              
              <div className="flex items-center gap-2 mb-2">
                {plushie.condition && (
                  <Badge variant="secondary" className="text-xs">
                    {plushie.condition}
                  </Badge>
                )}
                {plushie.brand && (
                  <Badge variant="outline" className="text-xs">
                    {plushie.brand}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>@{plushie.username || 'Unknown'}</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {plushie.likes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {plushie.comments || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="aspect-square relative">
        {plushie.image || plushie.imageUrl ? (
          <img
            src={plushie.image || plushie.imageUrl}
            alt={plushie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={handleWishlistClick}
        >
          <Heart className="h-4 w-4" />
        </Button>
        
        {plushie.discount && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            -{plushie.discount}%
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold truncate flex-1">{plushie.title}</h3>
          <span className="text-lg font-bold text-green-600 ml-2">
            ${plushie.price?.toFixed(2) || '0.00'}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {plushie.description}
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          {plushie.condition && (
            <Badge variant="secondary" className="text-xs">
              {plushie.condition}
            </Badge>
          )}
          {plushie.brand && (
            <Badge variant="outline" className="text-xs">
              {plushie.brand}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>@{plushie.username || 'Unknown'}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {plushie.likes || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {plushie.comments || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

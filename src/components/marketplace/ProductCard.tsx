
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, Truck } from "lucide-react";
import { MarketplacePlushie } from "@/types/marketplace";
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: MarketplacePlushie;
  onProductClick: (product: MarketplacePlushie) => void;
  onWishlistToggle: (id: string, event: React.MouseEvent) => void;
  isWishlisted: boolean;
}

export function ProductCard({ 
  product, 
  onProductClick, 
  onWishlistToggle, 
  isWishlisted 
}: ProductCardProps) {
  // Use discount or original price if available
  const hasDiscount = typeof product.discount === 'number' && product.discount > 0;
  const originalPrice = product.originalPrice || (hasDiscount ? product.price / (1 - product.discount / 100) : null);
  const displayPrice = product.price.toFixed(2);
  const displayOriginalPrice = originalPrice ? originalPrice.toFixed(2) : null;
  
  // Determine badge type
  let badgeText = '';
  let badgeColor = '';
  
  if (product.condition === 'New') {
    badgeText = 'New';
    badgeColor = 'bg-blue-500';
  } else if (hasDiscount) {
    badgeText = `-${product.discount}%`;
    badgeColor = 'bg-softspot-500';
  } else if (product.condition === 'Like New') {
    badgeText = 'Like New';
    badgeColor = 'bg-green-500';
  } else if (product.condition === 'Good') {
    badgeText = 'Good';
    badgeColor = 'bg-yellow-500';
  } else if (product.condition === 'Fair') {
    badgeText = 'Fair';
    badgeColor = 'bg-orange-500';
  }

  return (
    <Card 
      className="overflow-hidden content-card transition-all duration-300 h-full cursor-pointer hover:shadow-md"
      onClick={() => onProductClick(product)}
    >
      <div className="relative pt-[100%]">
        <img
          src={product.image}
          alt={product.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/300?text=Image+Error";
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white hover:bg-softspot-100 rounded-full w-8 h-8 shadow-md"
          onClick={(e) => onWishlistToggle(product.id, e)}
        >
          <Heart className={cn("h-4 w-4", isWishlisted ? "fill-softspot-500 text-softspot-500" : "text-gray-400")} />
        </Button>
        
        {badgeText && (
          <span className={`absolute top-2 left-2 ${badgeColor} text-white text-xs px-2 py-1 rounded`}>
            {badgeText}
          </span>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-gray-800 text-sm truncate">{product.title}</h3>
        <p className="text-xs text-gray-600 mb-1">{product.brand || 'Unknown brand'}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className={`font-bold text-sm ${hasDiscount ? 'text-softspot-500' : ''}`}>${displayPrice}</span>
            {hasDiscount && displayOriginalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1">${displayOriginalPrice}</span>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Star className="h-3 w-3 text-yellow-400 mr-1" />
            <span>4.8</span>
          </div>
        </div>
        
        <div className="mt-2 flex justify-between items-center text-xs">
          <span className="text-gray-500 flex items-center">
            <Truck className="h-3 w-3 mr-1" />
            {product.deliveryCost === 0 ? 'Free' : `$${product.deliveryCost?.toFixed(2)}`}
          </span>
          
          <span className="text-green-500">In Stock</span>
        </div>
      </div>
    </Card>
  );
}

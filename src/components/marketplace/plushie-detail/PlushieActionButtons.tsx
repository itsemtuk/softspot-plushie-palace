
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2, ShoppingCart, Check } from "lucide-react";

interface PlushieActionButtonsProps {
  isAddingToCart: boolean;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onContactSeller: () => void;
  onToggleWishlist: () => void;
  onShare: () => void;
}

export const PlushieActionButtons = ({
  isAddingToCart,
  isWishlisted,
  onAddToCart,
  onContactSeller,
  onToggleWishlist,
  onShare
}: PlushieActionButtonsProps) => {
  return (
    <div className="mt-6 grid grid-cols-4 gap-2">
      <Button 
        onClick={onAddToCart} 
        className="col-span-2 bg-softspot-500 hover:bg-softspot-600 text-white rounded-md"
        disabled={isAddingToCart}
      >
        {isAddingToCart ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Added
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>
      
      <Button 
        onClick={onContactSeller} 
        variant="outline"
        className="col-span-2 rounded-md"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Contact Seller
      </Button>
      
      <Button
        onClick={onToggleWishlist}
        variant="ghost"
        className={`flex justify-center items-center rounded-md ${isWishlisted ? 'text-red-500' : ''}`}
      >
        <Heart className={isWishlisted ? 'fill-current' : ''} />
      </Button>
      
      <Button
        onClick={onShare}
        variant="ghost"
        className="flex justify-center items-center rounded-md"
      >
        <Share2 />
      </Button>
    </div>
  );
};

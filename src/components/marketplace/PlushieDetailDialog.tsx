
import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { MarketplacePlushie } from "@/types/marketplace";
import { X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { PlushieHeader } from "./plushie-detail/PlushieHeader";
import { PlushieImage } from "./plushie-detail/PlushieImage";
import { PlushieTabs } from "./plushie-detail/PlushieTabs";
import { PlushieActionButtons } from "./plushie-detail/PlushieActionButtons";

interface PlushieDetailDialogProps {
  plushie: MarketplacePlushie;
  open: boolean;
  onClose: () => void;
}

export const PlushieDetailDialog = ({ plushie, open, onClose }: PlushieDetailDialogProps) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("details");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const formattedDate = plushie.timestamp ? 
    formatDistanceToNow(new Date(plushie.timestamp), { addSuffix: true }) : 
    'Recently';
  
  const handleContactSeller = () => {
    navigate(`/messaging`);
    toast({
      title: "Contact initiated",
      description: "Redirecting to messages to contact the seller."
    });
    onClose();
  };
  
  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted 
        ? "Item removed from your wishlist" 
        : "Item added to your wishlist"
    });
  };
  
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    setTimeout(() => {
      setIsAddingToCart(false);
      toast({
        title: "Added to cart",
        description: "Item has been added to your shopping cart."
      });
    }, 1000);
  };
  
  const handleShare = () => {
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto bg-white rounded-lg">
        <DialogClose className="absolute top-4 right-4 rounded-full hover:bg-gray-100 p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="grid md:grid-cols-2 grid-cols-1 gap-0">
          <PlushieImage plushie={plushie} />
          
          <div className="p-6">
            <PlushieHeader plushie={plushie} formattedDate={formattedDate} />
            
            <PlushieTabs 
              plushie={plushie}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
            />
            
            <PlushieActionButtons
              isAddingToCart={isAddingToCart}
              isWishlisted={isWishlisted}
              onAddToCart={handleAddToCart}
              onContactSeller={handleContactSeller}
              onToggleWishlist={handleToggleWishlist}
              onShare={handleShare}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

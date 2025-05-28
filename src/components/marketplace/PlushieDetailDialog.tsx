import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketplacePlushie } from "@/types/marketplace";
import { X, Heart, MessageSquare, Share2, ShoppingCart, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandLogo } from "../brand/BrandLogo";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface PlushieDetailDialogProps {
  plushie: MarketplacePlushie;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlushieDetailDialog = ({ plushie, open, onOpenChange }: PlushieDetailDialogProps) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("details");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const formattedDate = plushie.timestamp ? 
    formatDistanceToNow(new Date(plushie.timestamp), { addSuffix: true }) : 
    'Recently';
    
  // Format shipping info with proper number handling
  const deliveryCost = typeof plushie.deliveryCost === 'number' ? plushie.deliveryCost : 0;
  const shippingInfo = deliveryCost === 0 ? 
    "Free shipping" : 
    `$${deliveryCost.toFixed(2)} shipping`;
  
  // Format price
  const price = plushie.price || 0;
  const originalPrice = plushie.originalPrice || plushie.price || 0;
  const hasDiscount = plushie.discount && plushie.discount > 0;
  
  const handleContactSeller = () => {
    navigate(`/messaging`);
    toast({
      title: "Contact initiated",
      description: "Redirecting to messages to contact the seller."
    });
    onOpenChange(false);
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
    // Copy to clipboard functionality would go here
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto bg-white rounded-lg">
        {/* Single close button in top right */}
        <DialogClose className="absolute top-4 right-4 rounded-full hover:bg-gray-100 p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="grid md:grid-cols-2 grid-cols-1 gap-0">
          {/* Image Section */}
          <div className="relative h-[300px] md:h-full bg-gray-50 flex items-center justify-center">
            {!imageLoaded && (
              <Skeleton className="w-full h-full absolute inset-0 rounded-l-lg" />
            )}
            <img 
              src={plushie.image} 
              alt={plushie.title || "Plushie"} 
              className={`h-full w-full object-contain p-4 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.error("Image failed to load:", e);
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=No+Image";
                setImageLoaded(true);
              }}
            />
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-red-500 rounded-md">
                {plushie.discount}% OFF
              </Badge>
            )}
          </div>
          
          {/* Details Section */}
          <div className="p-6">
            <div className="flex items-center mb-2">
              {plushie.brand && (
                <div className="flex items-center">
                  <BrandLogo brandName={plushie.brand} className="w-5 h-5 mr-2" />
                  <span className="text-sm text-gray-600">{plushie.brand}</span>
                </div>
              )}
            </div>
            
            <DialogTitle className="text-xl font-bold mb-2">{plushie.title}</DialogTitle>
            
            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-2xl font-bold">${price.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-gray-500 line-through text-sm">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-sm text-gray-600">{shippingInfo}</span>
            </div>
            
            <div className="flex items-center space-x-1 mb-4">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${plushie.username || 'U'}`} />
                <AvatarFallback>{plushie.username?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{plushie.username || 'Anonymous'}</span>
              <span className="text-xs text-gray-500">• {formattedDate}</span>
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
              <TabsList className="grid grid-cols-2 bg-gray-50 rounded-lg">
                <TabsTrigger value="details" className="rounded-md">Details</TabsTrigger>
                <TabsTrigger value="shipping" className="rounded-md">Shipping</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-3 pt-2">
                <p className="text-gray-700">{plushie.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {plushie.condition && (
                    <div>
                      <span className="font-medium">Condition: </span>
                      <span>{plushie.condition}</span>
                    </div>
                  )}
                  
                  {plushie.species && (
                    <div>
                      <span className="font-medium">Species: </span>
                      <span>{plushie.species}</span>
                    </div>
                  )}
                  
                  {plushie.material && (
                    <div>
                      <span className="font-medium">Material: </span>
                      <span>{plushie.material}</span>
                    </div>
                  )}
                  
                  {plushie.size && (
                    <div>
                      <span className="font-medium">Size: </span>
                      <span>{plushie.size}</span>
                    </div>
                  )}
                  
                  {plushie.color && (
                    <div>
                      <span className="font-medium">Color: </span>
                      <span>{plushie.color}</span>
                    </div>
                  )}
                  
                  {plushie.filling && (
                    <div>
                      <span className="font-medium">Filling: </span>
                      <span>{plushie.filling}</span>
                    </div>
                  )}
                </div>
                
                {plushie.tags && plushie.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {plushie.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="cursor-pointer rounded-md">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="shipping" className="space-y-3 pt-2">
                <div>
                  <h4 className="font-medium mb-1">Shipping Details</h4>
                  <p className="text-sm text-gray-700">
                    {deliveryCost === 0 
                      ? "This item includes free shipping."
                      : `Shipping cost: $${deliveryCost.toFixed(2)}`
                    }
                  </p>
                </div>
                
                {plushie.location && (
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-sm text-gray-700">{plushie.location}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-1">Shipping Policy</h4>
                  <p className="text-sm text-gray-700">
                    Seller typically ships within 2-3 business days.
                    Returns accepted within 14 days of delivery.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Action Buttons - Improved layout */}
            <div className="mt-6 grid grid-cols-4 gap-2">
              <Button 
                onClick={handleAddToCart} 
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
                onClick={handleContactSeller} 
                variant="outline"
                className="col-span-2 rounded-md"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Seller
              </Button>
              
              <Button
                onClick={handleToggleWishlist}
                variant="ghost"
                className={`flex justify-center items-center rounded-md ${isWishlisted ? 'text-red-500' : ''}`}
              >
                <Heart className={isWishlisted ? 'fill-current' : ''} />
              </Button>
              
              <Button
                onClick={handleShare}
                variant="ghost"
                className="flex justify-center items-center rounded-md"
              >
                <Share2 />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import { Heart, MessageCircle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PlushieCardProps {
  id: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  price?: number;
  forSale?: boolean;
  variant?: "feed" | "marketplace" | "featured";
}

export function PlushieCard({ 
  id, 
  image, 
  title, 
  username, 
  likes, 
  comments, 
  price, 
  forSale = false,
  variant = "feed"
}: PlushieCardProps) {
  // Ensure price is a number before using toFixed
  const displayPrice = typeof price === 'number' ? price : 0;
  
  return (
    <Card className={cn(
      "overflow-hidden card-hover",
      variant === "featured" ? "border-softspot-200" : "border-gray-100",
      variant === "marketplace" ? "h-full flex flex-col" : ""
    )}>
      <div className={cn(
        "relative overflow-hidden",
        variant === "featured" ? "h-56" : "h-48",
        variant === "marketplace" ? "h-40" : ""
      )}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
        />
        {forSale && (
          <div className="absolute top-2 right-2 bg-softspot-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <DollarSign className="h-3 w-3 mr-1" />
            {displayPrice.toFixed(2)}
          </div>
        )}
      </div>
      
      <CardContent className={cn(
        "p-4",
        variant === "marketplace" ? "flex flex-col flex-grow" : ""
      )}>
        <h3 className="font-medium text-lg text-gray-800 mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-500">by @{username}</p>
        
        <div className={cn(
          "mt-3 flex items-center justify-between",
          variant === "marketplace" ? "mt-auto pt-3" : ""
        )}>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-gray-600">
              <Heart className="h-4 w-4 text-rose-400 mr-1" />
              <span className="text-xs">{likes}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MessageCircle className="h-4 w-4 text-softspot-400 mr-1" />
              <span className="text-xs">{comments}</span>
            </div>
          </div>
          
          {forSale && (
            <Button size="sm" className="bg-softspot-400 hover:bg-softspot-500 text-xs px-3">
              {variant === "marketplace" ? "View Item" : "Buy Now"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PlushieCard;

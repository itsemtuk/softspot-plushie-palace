
import { X, Heart, Share2, Flag, MessageSquare, DollarSign } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlushieDetails } from "./plushie-detail/PlushieDetails";
import { PlushieInfo } from "./plushie-detail/PlushieInfo";
import { PlushieActions } from "./plushie-detail/PlushieActions";
import { PlushieComments } from "./plushie-detail/PlushieComments";
import { MarketplacePlushie } from "@/types/marketplace";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PlushieDetailDialogProps {
  plushie: MarketplacePlushie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlushieDetailDialog({ plushie, open, onOpenChange }: PlushieDetailDialogProps) {
  const [isLiked, setIsLiked] = useState(false);
  const isMobile = useIsMobile();
  
  const handleLike = () => {
    setIsLiked(!isLiked);
  };
  
  useEffect(() => {
    // Reset state when plushie changes
    if (plushie) {
      setIsLiked(false);
    }
  }, [plushie]);
  
  if (!plushie) return null;
  
  const MobileContent = () => (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-2 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl">{plushie.title}</SheetTitle>
            <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center">
              <X className="h-4 w-4" />
            </SheetClose>
          </div>
          <SheetDescription className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              ${plushie.price}
            </Badge>
            {plushie.condition && (
              <Badge variant="outline">{plushie.condition}</Badge>
            )}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-grow overflow-auto">
          <div className="space-y-4 p-4 pb-24">
            <PlushieDetails plushie={plushie} />
            <PlushieInfo plushie={plushie} />
            <PlushieComments plushie={plushie} />
          </div>
        </ScrollArea>
        
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleLike} 
            className={isLiked ? "text-red-500" : ""}
          >
            <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
          </Button>
          
          <Button variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
          
          <Button className="flex-1 bg-softspot-500 hover:bg-softspot-600 font-semibold">
            <MessageSquare className="mr-2 h-4 w-4" /> Contact Seller
          </Button>
          
          <Button className="flex-1 bg-green-500 hover:bg-green-600 font-semibold">
            <DollarSign className="mr-2 h-4 w-4" /> Buy Now
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  const DesktopContent = () => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{plushie.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              ${plushie.price}
            </Badge>
            {plushie.condition && (
              <Badge variant="outline">{plushie.condition}</Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlushieDetails plushie={plushie} />
          
          <div className="space-y-6">
            <PlushieInfo plushie={plushie} />
            <PlushieActions plushie={plushie} />
            <PlushieComments plushie={plushie} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  
  return isMobile ? <MobileContent /> : <DesktopContent />;
}

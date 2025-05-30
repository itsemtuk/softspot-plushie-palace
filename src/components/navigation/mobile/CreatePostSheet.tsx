
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ImageIcon, ShoppingCart, Handshake } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCreatePost } from "@/hooks/use-create-post";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";

export interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePostSheet = ({ open, onOpenChange }: CreatePostSheetProps) => {
  const navigate = useNavigate();
  const { setIsPostCreationOpen } = useCreatePost();
  
  const handleAuthentication = (action: string, callback: () => void) => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to ${action}.`
      });
      onOpenChange(false);
      navigate("/sign-in");
      return false;
    }
    
    callback();
    return true;
  };
  
  const handleCreatePost = () => {
    handleAuthentication("create posts", () => {
      onOpenChange(false);
      console.log("Opening post creation dialog (mobile)");
      setTimeout(() => {
        setIsPostCreationOpen(true);
      }, 100);
    });
  };
  
  const handleTradeRequest = () => {
    handleAuthentication("create trade requests", () => {
      onOpenChange(false);
      navigate('/messages');
      toast({
        title: "Trade Request",
        description: "Trade request feature coming soon!"
      });
    });
  };
  
  const navigateToPage = (path: string, action: string) => {
    handleAuthentication(action, () => {
      onOpenChange(false);
      navigate(path);
    });
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full p-0 bg-white">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle>Create new</SheetTitle>
          </SheetHeader>
          
          <div className="p-4 space-y-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-3 justify-start w-full py-6 bg-white rounded-md"
              onClick={handleCreatePost}
            >
              <ImageIcon className="h-5 w-5" />
              <span>Create Post</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-3 justify-start w-full py-6 bg-white rounded-md"
              onClick={handleTradeRequest}
            >
              <Handshake className="h-5 w-5" />
              <span>Trade Request</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-3 justify-start w-full py-6 bg-white rounded-md"
              onClick={() => navigateToPage('/sell', 'sell items')}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Sell Item</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

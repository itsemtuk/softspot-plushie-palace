
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ImageIcon, ShoppingCart, MessageSquare, BarChart2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCreatePost } from "@/hooks/use-create-post";

export interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePostSheet = ({ open, onOpenChange }: CreatePostSheetProps) => {
  const navigate = useNavigate();
  const { onCreatePost } = useCreatePost();
  
  const handleCreatePost = () => {
    onOpenChange(false);
    onCreatePost();
  };

  const handleCreatePoll = () => {
    onOpenChange(false);
    onCreatePost(); // For now, use the same flow for polls
  };
  
  const navigateToPage = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle>Create new</SheetTitle>
          </SheetHeader>
          
          <div className="p-4 space-y-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-3 justify-start w-full py-6"
              onClick={handleCreatePost}
            >
              <ImageIcon className="h-5 w-5" />
              <span>Create Post</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-3 justify-start w-full py-6"
              onClick={() => navigateToPage('/marketplace/sell')}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Sell Item</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-3 justify-start w-full py-6"
              onClick={() => navigateToPage('/messages')}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Trade Request</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-3 justify-start w-full py-6"
              onClick={handleCreatePoll}
            >
              <BarChart2 className="h-5 w-5" />
              <span>Create Poll</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

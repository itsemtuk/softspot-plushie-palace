
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ImageIcon, ShoppingCart, MessageSquare, BarChart2 } from "lucide-react";
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePostSheet = ({ open, onOpenChange }: CreatePostSheetProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"post" | "marketplace">("post");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePostSubmit = () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const newPost = {
        id: `post-${Date.now()}`, // Simple ID generation
        userId: user.id,
        image: image || "https://images.unsplash.com/photo-1591561582301-7ce6588cc286",
        title: title || "My new post",
        username: user.username || user.firstName || "Anonymous",
        likes: 0,
        comments: 0,
        description: description || "Check out this plushie!",
        tags: tags.length ? tags : ["plushie"],
        timestamp: new Date().toISOString(),
        price: activeTab === "marketplace" ? price : undefined,
        forSale: activeTab === "marketplace",
        condition: "New",
        color: "",
        material: "",
        location: "",
        deliveryCost: 0
      };
      
      // For now, just store in localStorage
      const currentPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      currentPosts.unshift(newPost);
      localStorage.setItem('posts', JSON.stringify(currentPosts));
      
      // Reset form and close
      resetForm();
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice(0);
    setImage("");
    setTags([]);
  };
  
  const navigateToPage = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle>Create new</SheetTitle>
          </SheetHeader>
          
          <div className="p-4 space-y-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-3 justify-start w-full py-6"
              onClick={handlePostSubmit}
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
              onClick={handlePostSubmit}
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


import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, ShoppingCart } from "lucide-react";
import { useUser } from '@clerk/clerk-react';
import { v4 as uuidv4 } from 'uuid';

export interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePostSheet = ({ open, onOpenChange }: CreatePostSheetProps) => {
  const { user } = useUser();
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
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle>Create new post</SheetTitle>
          </SheetHeader>
          
          <Tabs defaultValue="post" className="flex-1 flex flex-col" 
                value={activeTab} onValueChange={(v) => setActiveTab(v as "post" | "marketplace")}>
            <TabsList className="grid grid-cols-2 mx-4">
              <TabsTrigger value="post" className="flex gap-2">
                <ImageIcon className="h-4 w-4" />
                Post
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex gap-2">
                <ShoppingCart className="h-4 w-4" />
                Sell
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="post" className="flex-1 p-4 space-y-4">
              {/* Post creation content */}
              <div>Post creation form will go here</div>
              <Button onClick={handlePostSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating..." : "Post"}
              </Button>
            </TabsContent>
            
            <TabsContent value="marketplace" className="flex-1 p-4 space-y-4">
              {/* Marketplace listing content */}
              <div>Marketplace listing form will go here</div>
              <Button onClick={handlePostSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating..." : "List for Sale"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

import { useState } from 'react';
import {
  PlusSquare,
  ShoppingBag,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useCreatePost } from "@/hooks/use-create-post";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData, ExtendedPost } from '@/types/marketplace';
import { toast } from "@/components/ui/use-toast";
import { addPost } from "@/utils/posts/postManagement";

export function CreatePostSheet() {
  const { isSheetOpen, isPostCreationOpen, onOpenChange, onClosePostCreation, setIsPostCreationOpen } = useCreatePost();
  const navigate = useNavigate();
  const isSignedIn = !!localStorage.getItem('currentUserId');
  const userId = localStorage.getItem('currentUserId') || 'anonymous';
  const username = localStorage.getItem('currentUsername') || "Anonymous";

  const handleCreatePost = async (postData: PostCreationData): Promise<void> => {
    try {
      if (!isSignedIn) {
        // Redirect to sign in if not authenticated
        toast({
          title: "Authentication required",
          description: "Please sign in to create a post",
          variant: "destructive"
        });
        
        onClosePostCreation();
        onOpenChange(false);
        
        setTimeout(() => {
          navigate('/sign-in');
        }, 100);
        
        return Promise.reject(new Error("Authentication required"));
      }
      
      // Fix the post creation to include all required properties
      const newPost: ExtendedPost = {
        id: `post-${Date.now()}`,
        userId: userId,
        image: postData.image,
        title: postData.title,
        username: username,
        likes: 0,
        comments: 0,
        description: postData.description || "",
        tags: postData.tags || [],
        timestamp: new Date().toISOString(),
        price: 0, // Default price
        forSale: false, // Not for sale by default  
        condition: "New", // Default condition
        color: "", // Default color
        material: "", // Default material
        location: postData.location, // Include location
        deliveryCost: 0 // Add the missing required property
      };
      
      const result = await addPost(newPost);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to create post");
      }
      
      toast({
        title: "Post created successfully!",
        description: "Your post is now visible in your profile and feed."
      });
      
      // Close dialogs first
      onClosePostCreation();
      onOpenChange(false);
      
      // Navigate to feed after successful post with a slight delay to ensure dialogs close
      navigate('/feed');
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error creating post",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      return Promise.reject(error);
    }
  };

  const handleAction = (action: string, path: string) => {
    onOpenChange(false);
    
    if (!isSignedIn) {
      toast({
        title: "Authentication required", 
        description: `Please sign in to ${action}`,
        variant: "destructive"
      });
      navigate('/sign-in');
      return;
    }

    if (action === 'post') {
      setIsPostCreationOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button size="icon" className="rounded-full bg-softspot-500 hover:bg-softspot-600">
            <PlusSquare className="h-5 w-5 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[40vh]">
          <SheetHeader>
            <SheetTitle>Create New</SheetTitle>
            <SheetDescription>Choose what you'd like to do</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-2 h-auto py-6"
              onClick={() => handleAction('post', '/feed')}
            >
              <PlusSquare className="h-8 w-8" />
              <span>Post</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-2 h-auto py-6"
              onClick={() => handleAction('sell', '/sell')}
            >
              <ShoppingBag className="h-8 w-8" />
              <span>Sell</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-2 h-auto py-6"
              onClick={() => handleAction('trade', '/messages')}
            >
              <MessageSquare className="h-8 w-8" />
              <span>Trade</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={onClosePostCreation}
        onPostCreated={handleCreatePost}
      />
    </>
  );
}


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExtendedPost } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { addPost } from "@/utils/posts/postManagement";

interface UseCreatePostOptions {
  redirectAfterCreate?: boolean;
  redirectPath?: string;
}

export const useCreatePost = (options?: UseCreatePostOptions) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<ExtendedPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const onOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
  };
  
  const onCreatePost = () => {
    setIsPostCreationOpen(true);
  };
  
  const onClosePostCreation = () => {
    setIsPostCreationOpen(false);
    setPostToEdit(null);
  };

  const handlePostCreation = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Create post
      const result = await addPost({
        ...data,
        id: `post-${Date.now()}`,
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Your post has been created."
        });
        
        onClosePostCreation();
        
        if (options?.redirectAfterCreate) {
          navigate(options.redirectPath || '/feed');
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to create your post. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSheetOpen,
    isPostCreationOpen,
    isSubmitting,
    postToEdit,
    setIsPostCreationOpen,
    onOpenChange,
    onCreatePost,
    onClosePostCreation,
    handlePostCreation
  };
};

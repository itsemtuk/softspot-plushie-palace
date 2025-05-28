import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ExtendedPost } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { usePostActions } from "./usePostActions";

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
  const { user } = useUser();
  const { createPost } = usePostActions();
  
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

      if (!user?.id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create posts.",
          variant: "destructive"
        });
        navigate('/sign-in');
        return;
      }
      
      // Use the new centralized createPost function
      await createPost(data);
      
      toast({
        title: "Success!",
        description: "Your post has been created."
      });
      
      onClosePostCreation();
      
      if (options?.redirectAfterCreate) {
        navigate(options.redirectPath || '/feed');
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

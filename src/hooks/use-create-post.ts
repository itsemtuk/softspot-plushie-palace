
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export function useCreatePost() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();

  const onCreatePost = () => {
    setIsSheetOpen(false);
    
    // Make sure the route exists before navigating
    try {
      navigate('/feed');
      
      // Use a short timeout to ensure the navigation completes before opening dialog
      setTimeout(() => {
        const createPostButton = document.querySelector('button[data-create-post]');
        if (createPostButton) {
          (createPostButton as HTMLButtonElement).click();
        } else {
          console.error("Create post button not found");
          toast({
            title: "Create Post",
            description: "Opening post creation dialog..."
          });
        }
      }, 100);
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not navigate to post creation. Please try again."
      });
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
  };

  return {
    isSheetOpen,
    onOpenChange,
    onCreatePost,
  };
}

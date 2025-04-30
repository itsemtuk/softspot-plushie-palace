
import { PlusSquare, ShoppingBag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCreatePost } from "@/hooks/use-create-post";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData, ExtendedPost } from '@/types/marketplace';
import { toast } from "@/components/ui/use-toast";
import { addPost } from "@/utils/posts/postManagement";
import { getCurrentUserId } from "@/utils/storage/localStorageUtils";

// Check if Clerk is configured
const isClerkConfigured = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_') && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_valid-test-key-for-dev-only";

// Create a safe version of useUser
function useSafeUser() {
  if (!isClerkConfigured) {
    // Return a fallback when Clerk isn't configured
    return {
      user: null,
      isLoaded: true
    };
  }

  // Don't directly use useUser here - it would still throw in a non-Clerk context
  // Instead, just provide a fallback with localStorage data
  return {
    user: null,
    isLoaded: true
  };
}

export function CreatePostSheet() {
  const { isSheetOpen, isPostCreationOpen, onOpenChange, onClosePostCreation, setIsPostCreationOpen } = useCreatePost();
  const navigate = useNavigate();
  
  // Get user data safely
  let userData = { user: null, isLoaded: true };
  try {
    if (isClerkConfigured) {
      const { useUser } = require('@clerk/clerk-react');
      userData = useUser();
    }
  } catch (error) {
    console.error("Error using Clerk's useUser:", error);
  }
  
  // Safely extract user data with fallbacks
  const userId = userData?.user?.id || localStorage.getItem('currentUserId') || 'anonymous';
  const username = userData?.user?.username || userData?.user?.firstName || localStorage.getItem('currentUsername') || "Anonymous";

  const handleCreatePost = async (postData: PostCreationData): Promise<void> => {
    try {
      if (!userId || userId === 'anonymous') {
        throw new Error("You must be signed in to create a post");
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
        location: postData.location // Include location
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
      setTimeout(() => {
        navigate('/feed');
      }, 100);
      
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
              onClick={() => {
                onOpenChange(false);
                setIsPostCreationOpen(true);
              }}
            >
              <PlusSquare className="h-8 w-8" />
              <span>Post</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-2 h-auto py-6"
              onClick={() => {
                onOpenChange(false);
                navigate('/sell');
              }}
            >
              <ShoppingBag className="h-8 w-8" />
              <span>Sell</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-2 h-auto py-6"
              onClick={() => {
                onOpenChange(false);
                navigate('/messages');
              }}
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

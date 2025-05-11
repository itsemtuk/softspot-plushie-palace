
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusSquare, ShoppingBag, MessageSquare, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/hooks/use-create-post";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData, ExtendedPost } from "@/types/marketplace";
import { toast } from "@/hooks/use-toast";
import { addPost } from "@/utils/posts/postManagement";

// Check if Clerk is configured
const isClerkConfigured = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_') && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_valid-test-key-for-dev-only";

interface CreateButtonProps {
  onCreatePost?: () => void;
}

export const CreateButton = ({ onCreatePost: externalOnCreatePost }: CreateButtonProps = {}) => {
  const { 
    isSheetOpen, 
    isPostCreationOpen, 
    postToEdit, 
    onOpenChange, 
    onCreatePost: handleCreatePost, 
    onClosePostCreation
  } = useCreatePost();
  
  const navigate = useNavigate();
  const isSignedIn = !!localStorage.getItem('currentUserId');
  const userId = localStorage.getItem('currentUserId') || 'anonymous';
  const username = localStorage.getItem('currentUsername') || 'Anonymous';

  const handlePostCreation = async (postData: PostCreationData): Promise<void> => {
    if (!isSignedIn) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to be logged in to create posts"
      });
      return Promise.reject("Authentication required");
    }
    
    try {
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
        deliveryCost: 0 // Add the required property
      };
      
      const result = await addPost(newPost);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to create post");
      }
      
      toast({
        title: "Post created successfully!",
        description: "Your post is now visible in your profile and feed."
      });
      
      onClosePostCreation();
      navigate('/feed');
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again."
      });
      return Promise.reject(error);
    }
  };

  const handleButtonClick = () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create content"
      });
      navigate('/sign-in');
      return;
    }
    
    // If signed in, continue with normal flow
    onOpenChange(true);
  };

  
  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button 
            variant="default" 
            className="flex items-center gap-2 bg-softspot-500 hover:bg-softspot-600"
            onClick={handleButtonClick}
          >
            <PlusSquare className="h-4 w-4" />
            Create
          </Button>
        </SheetTrigger>
        {isSignedIn && (
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New</SheetTitle>
              <SheetDescription>Choose what you'd like to do</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 mt-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 justify-start"
                onClick={() => {
                  onOpenChange(false);
                  if (externalOnCreatePost) {
                    externalOnCreatePost();
                  } else {
                    handleCreatePost();
                  }
                }}
              >
                <PlusSquare className="h-4 w-4" />
                Create Post
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 justify-start"
                onClick={() => navigate('/marketplace/sell')}
              >
                <ShoppingBag className="h-4 w-4" />
                Sell Item
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 justify-start"
                onClick={() => navigate('/messages')}
              >
                <MessageSquare className="h-4 w-4" />
                Trade Request
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 justify-start"
                onClick={() => {
                  onOpenChange(false);
                  if (externalOnCreatePost) {
                    externalOnCreatePost();
                  } else {
                    handleCreatePost();
                  }
                }}
              >
                <BarChart2 className="h-4 w-4" />
                Create Poll
              </Button>
            </div>
          </SheetContent>
        )}
      </Sheet>

      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={onClosePostCreation}
        onPostCreated={handlePostCreation}
        postToEdit={postToEdit}
      />
    </>
  );
};


import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusSquare, ShoppingBag, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/hooks/use-create-post";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData, ExtendedPost } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { addPost } from "@/utils/posts/postManagement";

interface CreateButtonProps {
  onCreatePost?: () => void;
}

export const CreateButton = ({ onCreatePost: externalOnCreatePost }: CreateButtonProps = {}) => {
  const { isSheetOpen, isPostCreationOpen, postToEdit, onOpenChange, onCreatePost, onClosePostCreation, setIsPostCreationOpen } = useCreatePost();
  const navigate = useNavigate();
  const { user } = useUser();

  const handleCreatePost = async (postData: PostCreationData): Promise<void> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to be logged in to create posts"
      });
      return Promise.reject("Authentication required");
    }
    
    try {
      const username = user?.username || user?.firstName || "Anonymous";
      
      const newPost: ExtendedPost = {
        id: `post-${Date.now()}`,
        userId: user?.id || 'anonymous',
        image: postData.image,
        title: postData.title,
        username: username,
        likes: 0,
        comments: 0,
        description: postData.description || "",
        tags: postData.tags || [],
        timestamp: new Date().toISOString(),
      };
      
      const result = await addPost(newPost);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to create post");
      }
      
      toast({
        title: "Post created successfully!",
        description: "Your post is now visible in your profile and feed."
      });
      
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

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="default" className="flex items-center gap-2 bg-softspot-500 hover:bg-softspot-600">
            <PlusSquare className="h-4 w-4" />
            Create
          </Button>
        </SheetTrigger>
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
                  onCreatePost();
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
          </div>
        </SheetContent>
      </Sheet>

      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={onClosePostCreation}
        onPostCreated={handleCreatePost}
        postToEdit={postToEdit}
      />
    </>
  );
};

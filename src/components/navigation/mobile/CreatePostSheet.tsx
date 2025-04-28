
import { PlusSquare, ShoppingBag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCreatePost } from "@/hooks/use-create-post";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { addPost } from "@/utils/postStorage";
import { useUser } from "@clerk/clerk-react";

export function CreatePostSheet() {
  const { isSheetOpen, isPostCreationOpen, onOpenChange, onClosePostCreation, setIsPostCreationOpen } = useCreatePost();
  const navigate = useNavigate();
  const { user } = useUser();

  const handleCreatePost = async (postData: PostCreationData): Promise<void> => {
    try {
      if (!user) {
        throw new Error("You must be signed in to create a post");
      }
      
      const username = user?.username || user?.firstName || "Anonymous";
      
      const newPost = {
        id: `post-${Date.now()}`,
        userId: user.id,
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
      
      // Navigate to feed after successful post
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
                navigate('/marketplace/sell');
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

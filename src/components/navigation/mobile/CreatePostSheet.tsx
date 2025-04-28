
import { PlusSquare, ShoppingBag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCreatePost } from "@/hooks/use-create-post";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";

export function CreatePostSheet() {
  const { isSheetOpen, isPostCreationOpen, onOpenChange, onCreatePost, onClosePostCreation } = useCreatePost();
  const navigate = useNavigate();

  const handleCreatePost = async (postData: PostCreationData): Promise<void> => {
    toast({
      title: "Post created successfully!",
      description: "Your post is now visible in your profile and feed."
    });
    return Promise.resolve();
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
                onCreatePost();
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

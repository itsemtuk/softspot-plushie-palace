
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusSquare, ShoppingBag, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/hooks/use-create-post";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";

interface CreateButtonProps {
  onCreatePost?: () => void;
}

export const CreateButton = ({ onCreatePost: externalOnCreatePost }: CreateButtonProps = {}) => {
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
      />
    </>
  );
};

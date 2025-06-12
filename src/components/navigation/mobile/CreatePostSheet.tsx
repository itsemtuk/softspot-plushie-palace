
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Camera, DollarSign, X } from "lucide-react";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { QuickListForm } from "@/components/marketplace/QuickListForm";
import { useCreatePost } from "@/hooks/use-create-post";
import { useFeedPostCreation } from "@/hooks/useFeedPostCreation";
import { PostCreationData } from "@/types/core";

interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostSheet({ open, onOpenChange }: CreatePostSheetProps) {
  const [activeMode, setActiveMode] = useState<"select" | "post" | "sell">("select");
  const { isPostCreationOpen, setIsPostCreationOpen, onClosePostCreation } = useCreatePost();
  const { handlePostCreated } = useFeedPostCreation(() => {});

  const handleModeSelect = (mode: "post" | "sell") => {
    setActiveMode(mode);
    if (mode === "post") {
      setIsPostCreationOpen(true);
    }
  };

  const handlePostCreationComplete = async (data: PostCreationData) => {
    try {
      await handlePostCreated(data);
      setIsPostCreationOpen(false);
      setActiveMode("select");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleClose = () => {
    setIsPostCreationOpen(false);
    setActiveMode("select");
    onOpenChange(false);
  };

  if (activeMode === "post") {
    return (
      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={handleClose}
        onPostCreated={handlePostCreationComplete}
      />
    );
  }

  if (activeMode === "sell") {
    return (
      <QuickListForm
        isOpen={open}
        onClose={() => {
          setActiveMode("select");
          onOpenChange(false);
        }}
      />
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto rounded-t-xl">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
          <SheetTitle className="text-xl">Create Content</SheetTitle>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="py-6 space-y-4">
          <Button
            onClick={() => handleModeSelect("post")}
            className="w-full h-16 text-left flex items-center gap-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
            variant="outline"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Create Post</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Share a photo of your plushie</p>
            </div>
          </Button>

          <Button
            onClick={() => handleModeSelect("sell")}
            className="w-full h-16 text-left flex items-center gap-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800"
            variant="outline"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Sell Item</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">List your plushie for sale</p>
            </div>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

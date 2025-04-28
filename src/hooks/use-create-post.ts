
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import PostCreationFlow from "@/components/post/PostCreationFlow";

export function useCreatePost() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const navigate = useNavigate();

  const onCreatePost = () => {
    setIsSheetOpen(false);
    setIsPostCreationOpen(true);
  };

  const onClosePostCreation = () => {
    setIsPostCreationOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
  };

  return {
    isSheetOpen,
    isPostCreationOpen,
    onOpenChange,
    onCreatePost,
    onClosePostCreation,
  };
}

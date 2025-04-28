
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { ExtendedPost } from "@/types/marketplace";

export function useCreatePost() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<ExtendedPost | null>(null);
  const navigate = useNavigate();

  const onCreatePost = () => {
    setIsSheetOpen(false);
    setPostToEdit(null);
    setIsPostCreationOpen(true);
  };

  const onEditPost = (post: ExtendedPost) => {
    setPostToEdit(post);
    setIsPostCreationOpen(true);
  };

  const onClosePostCreation = () => {
    setIsPostCreationOpen(false);
    setPostToEdit(null);
  };

  const onOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
  };

  return {
    isSheetOpen,
    isPostCreationOpen,
    postToEdit,
    onOpenChange,
    onCreatePost,
    onEditPost,
    onClosePostCreation,
    setIsPostCreationOpen
  };
}

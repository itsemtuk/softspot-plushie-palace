
import { useState } from "react";
import { PostCreationForm } from "@/components/post/PostCreationForm";
import { useNavigate } from "react-router-dom";
import { ExtendedPost } from "@/types/marketplace";

interface UseCreatePostOptions {
  redirectAfterCreate?: boolean;
  redirectPath?: string;
}

export const useCreatePost = (options?: UseCreatePostOptions) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<ExtendedPost | null>(null);
  const navigate = useNavigate();
  
  const onOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
  };
  
  const onCreatePost = () => {
    setIsPostCreationOpen(true);
  };
  
  const onClosePostCreation = () => {
    setIsPostCreationOpen(false);
    setPostToEdit(null);
  };
  
  return {
    isSheetOpen,
    isPostCreationOpen,
    setIsPostCreationOpen,
    postToEdit,
    onOpenChange,
    onCreatePost,
    onClosePostCreation
  };
};

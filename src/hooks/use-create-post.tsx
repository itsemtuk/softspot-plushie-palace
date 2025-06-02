import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { ExtendedPost } from "@/types/core";

export const useCreatePost = () => {
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);

  const openPostCreation = () => {
    setIsPostCreationOpen(true);
  };

  const onClosePostCreation = () => {
    setIsPostCreationOpen(false);
  };

  return {
    isPostCreationOpen,
    openPostCreation,
    onClosePostCreation,
  };
};

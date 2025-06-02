
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

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
    setIsPostCreationOpen,
    openPostCreation,
    onClosePostCreation,
  };
};

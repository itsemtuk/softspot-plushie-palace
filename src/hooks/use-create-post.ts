
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useCreatePost() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();

  const onCreatePost = () => {
    setIsSheetOpen(false);
    navigate('/create-post');
  };

  const onOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
  };

  return {
    isSheetOpen,
    onOpenChange,
    onCreatePost,
  };
}

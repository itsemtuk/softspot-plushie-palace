import { useState, useCallback } from 'react';
import { ExtendedPost, Comment } from "@/types/core";

interface PostDialogState {
  isOpen: boolean;
  post: ExtendedPost | null;
}

interface UsePostDialog {
  dialogState: PostDialogState;
  openPostDialog: (post: ExtendedPost) => void;
  closePostDialog: () => void;
}

export const usePostDialog = (): UsePostDialog => {
  const [dialogState, setDialogState] = useState<PostDialogState>({
    isOpen: false,
    post: null,
  });

  const openPostDialog = useCallback((post: ExtendedPost) => {
    setDialogState({
      isOpen: true,
      post: post,
    });
  }, []);

  const closePostDialog = useCallback(() => {
    setDialogState({
      isOpen: false,
      post: null,
    });
  }, []);

  return {
    dialogState,
    openPostDialog,
    closePostDialog,
  };
};

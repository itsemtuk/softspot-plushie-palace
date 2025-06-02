
import { useState, useCallback } from "react";
import { PostContent } from "./PostContent";
import { ExtendedPost, Comment } from "@/types/core";

interface PostDialogContentProps {
  post: ExtendedPost;
  onPostUpdate: (updatedPost: ExtendedPost) => void;
  onPostDelete: (postId: string) => void;
  onCommentSubmit: (comment: Omit<Comment, 'id' | 'likes' | 'timestamp' | 'isLiked'>) => Promise<void>;
  onCommentLike: (commentId: string) => Promise<void>;
  onCommentUnlike: (commentId: string) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export const PostDialogContent = ({
  post,
  onPostUpdate,
  onPostDelete,
  onCommentSubmit,
  onCommentLike,
  onCommentUnlike,
  onEditComment,
  onDeleteComment
}: PostDialogContentProps) => {
  const handlePostEdited = (editedPost: ExtendedPost) => {
    onPostUpdate(editedPost);
  };

  const handlePostDeleted = (postId: string) => {
    onPostDelete(postId);
  };

  return (
    <PostContent
      post={post}
      onClose={() => {}}
      onPostEdited={handlePostEdited}
      onPostDeleted={handlePostDeleted}
    />
  );
};

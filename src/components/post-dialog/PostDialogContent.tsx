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
  const [comments, setComments] = useState<Comment[]>([]);

  const handleCommentSubmit = useCallback(
    async (newComment: Omit<Comment, 'id' | 'likes' | 'timestamp' | 'isLiked'>) => {
      try {
        await onCommentSubmit(newComment);
        // Optimistically update the local state
        setComments(prevComments => [
          ...prevComments,
          {
            ...newComment,
            id: `temp-${Date.now()}`, // Temporary ID
            likes: 0,
            timestamp: new Date().toISOString(),
            isLiked: false,
          } as Comment,
        ]);
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    },
    [onCommentSubmit]
  );

  return (
    <PostContent
      post={post}
      comments={comments}
      onPostUpdate={onPostUpdate}
      onPostDelete={onPostDelete}
      onCommentSubmit={handleCommentSubmit}
      onCommentLike={onCommentLike}
      onCommentUnlike={onCommentUnlike}
      onEditComment={onEditComment}
      onDeleteComment={onDeleteComment}
    />
  );
};

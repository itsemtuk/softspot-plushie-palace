
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { ExtendedPost, Comment } from "@/types/core";
import { PostDialogContent } from "./post-dialog/PostDialogContent";

interface PostDialogProps {
  post: ExtendedPost | null;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const PostDialog = ({ post, isOpen, onClose, children }: PostDialogProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handlePostUpdate = (updatedPost: ExtendedPost) => {
    console.log("Post updated:", updatedPost);
  };

  const handlePostDelete = (postId: string) => {
    console.log("Post deleted:", postId);
    onClose();
  };

  const handleCommentSubmit = async (comment: Omit<Comment, 'id' | 'likes' | 'timestamp' | 'isLiked'>) => {
    console.log("Comment submitted:", comment);
  };

  const handleCommentLike = async (commentId: string) => {
    console.log("Comment liked:", commentId);
  };

  const handleCommentUnlike = async (commentId: string) => {
    console.log("Comment unliked:", commentId);
  };

  const handleEditComment = async (commentId: string, content: string) => {
    console.log("Comment edited:", commentId, content);
  };

  const handleDeleteComment = async (commentId: string) => {
    console.log("Comment deleted:", commentId);
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <PostDialogContent 
          post={post} 
          onPostUpdate={handlePostUpdate}
          onPostDelete={handlePostDelete}
          onCommentSubmit={handleCommentSubmit}
          onCommentLike={handleCommentLike}
          onCommentUnlike={handleCommentUnlike}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
        />
      </DialogContent>
    </Dialog>
  );
};

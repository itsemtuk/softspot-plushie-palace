
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { ExtendedPost, Comment } from "@/types/core";
import { PostDialogContent } from "./post-dialog/PostDialogContent";
import { commentService, PostComment } from "@/utils/comments/commentService";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PostDialogProps {
  post: ExtendedPost | null;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const PostDialog = ({ post, isOpen, onClose, children }: PostDialogProps) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();

  // Determine post type based on where the post comes from
  const getPostType = (post: ExtendedPost): 'post' | 'feed_post' => {
    // If post has title and description, it's likely from feed_posts
    // Otherwise, it's from posts table
    return (post.title !== undefined || post.description !== undefined) ? 'feed_post' : 'post';
  };

  // Load comments when dialog opens
  useEffect(() => {
    if (isOpen && post) {
      loadComments();
    }
  }, [isOpen, post]);

  const loadComments = async () => {
    if (!post) return;
    
    setIsLoadingComments(true);
    try {
      const postType = getPostType(post);
      const fetchedComments = await commentService.getComments(post.id, postType);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setComments([]); // Clear comments when closing
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
    if (!user || !post) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to comment."
      });
      return;
    }

    try {
      const token = await getToken({ template: "supabase" });
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Could not get authentication token."
        });
        return;
      }

      // Get user ID from Supabase
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .single();

      if (!userData) {
        toast({
          variant: "destructive",
          title: "User not found",
          description: "Please try refreshing the page."
        });
        return;
      }

      const postType = getPostType(post);
      const newComment = await commentService.createComment(
        post.id,
        postType,
        comment.content,
        userData.id,
        token
      );

      if (newComment) {
        setComments(prev => [...prev, newComment]);
        toast({
          title: "Comment added",
          description: "Your comment has been posted successfully."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to post comment. Please try again."
        });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post comment. Please try again."
      });
    }
  };

  const handleCommentLike = async (commentId: string) => {
    console.log("Comment liked:", commentId);
  };

  const handleCommentUnlike = async (commentId: string) => {
    console.log("Comment unliked:", commentId);
  };

  const handleEditComment = async (commentId: string, content: string) => {
    if (!user) return;

    try {
      const token = await getToken({ template: "supabase" });
      if (!token) return;

      const updatedComment = await commentService.updateComment(commentId, content, token);
      if (updatedComment) {
        setComments(prev => prev.map(c => c.id === commentId ? updatedComment : c));
        toast({
          title: "Comment updated",
          description: "Your comment has been updated successfully."
        });
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update comment."
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const token = await getToken({ template: "supabase" });
      if (!token) return;

      const success = await commentService.deleteComment(commentId, token);
      if (success) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        toast({
          title: "Comment deleted",
          description: "Your comment has been removed."
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment."
      });
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Post Details</DialogTitle>
        <PostDialogContent 
          post={post} 
          comments={comments}
          isLoadingComments={isLoadingComments}
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

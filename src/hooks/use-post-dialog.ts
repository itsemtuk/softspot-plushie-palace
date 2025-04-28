
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";
import { ExtendedPost, Comment } from "@/types/marketplace";
import { likePost, likeComment } from "@/utils/posts/postInteraction";
import { updatePost, deletePost } from "@/utils/posts/postManagement";

export function usePostDialog(post: ExtendedPost | null) {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [isAuthor, setIsAuthor] = useState(false);
  
  // Initialize state based on post data
  useEffect(() => {
    if (post) {
      // Check if user has liked this post
      const hasLiked = Array.isArray(post.likes) && post.likes.some(like => like.userId === user?.id) || false;
      setIsLiked(hasLiked);
      
      // Set like count
      setLikeCount(Array.isArray(post.likes) ? post.likes.length : 0);
      
      // Set comments
      setCommentList(Array.isArray(post.comments) ? post.comments : []);
      
      // Check if current user is the author
      setIsAuthor(post.userId === user?.id);
    }
  }, [post, user]);

  const handleLikeToggle = async () => {
    if (!user || !post) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to like posts.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Optimistic update
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prevCount => newIsLiked ? prevCount + 1 : Math.max(0, prevCount - 1));
      
      // Persist like
      await likePost(post.id, user.id, user.username as string);
    } catch (error) {
      // Revert optimistic update on error
      console.error("Error liking post:", error);
      setIsLiked(!isLiked);
      setLikeCount(prevCount => isLiked ? prevCount + 1 : Math.max(0, prevCount - 1));
      
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCommentLikeToggle = async (commentId: string) => {
    if (!user || !post) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to like comments.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Optimistically update UI
      const updatedComments = commentList.map(comment => {
        if (comment.id === commentId) {
          const hasLiked = comment.likes?.some(like => like.userId === user.id) || false;
          
          // If already liked, remove like, otherwise add it
          const updatedLikes = hasLiked 
            ? (comment.likes?.filter(like => like.userId !== user.id) || [])
            : [...(comment.likes || []), { userId: user.id, username: user.username as string }];
          
          return {
            ...comment,
            likes: updatedLikes
          };
        }
        return comment;
      });
      
      setCommentList(updatedComments);
      
      // Persist like to storage
      await likeComment(post.id, commentId, user.id, user.username as string);
    } catch (error) {
      console.error("Error liking comment:", error);
      toast({
        title: "Error",
        description: "Failed to update comment like status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCommentSubmit = async (content: string) => {
    if (!user || !post) return;
    
    try {
      const newComment: Comment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        username: user.username as string,
        content,
        createdAt: new Date().toISOString(),
        likes: []
      };
      
      // Update local state immediately for responsive UI
      const updatedComments = [...commentList, newComment];
      setCommentList(updatedComments);
      
      // Update the post with the new comment
      await updatePost(post.id, {
        comments: updatedComments
      });
      
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Error",
        description: "Failed to submit your comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async (updatedContent: string) => {
    if (!post) return;
    
    try {
      await updatePost(post.id, {
        content: updatedContent,
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update your post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFindSimilar = () => {
    if (!post) return;
    
    // Logic to find similar posts based on tags or content
    toast({
      title: "Finding similar posts",
      description: "This feature is coming soon!",
    });
  };

  return {
    isLiked,
    likeCount,
    commentList,
    isAuthor,
    handleLikeToggle,
    handleCommentLikeToggle,
    handleCommentSubmit,
    handleSaveEdit,
    handleFindSimilar,
  };
}

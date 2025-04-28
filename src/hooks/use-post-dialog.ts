
import { useState, useEffect } from "react";
import { togglePostLike, updatePost } from "@/utils/postStorage";
import { useUser } from "@clerk/clerk-react";
import { ExtendedPost } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { Comment } from "@/components/post-dialog/PostCommentItem";
import { useNavigate } from "react-router-dom";

export function usePostDialog(post: ExtendedPost | null) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Only consider the user as author if both user and post exist and usernames match
  const isAuthor = user && post ? user.username === post.username : false;
  
  // Update local state when post changes
  useEffect(() => {
    if (post) {
      setLikeCount(post.likes);
      setIsLiked(false); // Reset like state for each post
      
      // Reset comment list when post changes to prevent duplication
      setCommentList(post.comments ? 
        Array.isArray(post.comments) ? 
          post.comments.map((comment: any) => ({
            id: comment.id || `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            username: comment.username || 'Anonymous',
            text: comment.text || comment.content || '',
            timestamp: comment.timestamp || new Date().toISOString(),
            isLiked: comment.isLiked || false,
            likes: comment.likes || 0,
          })) 
        : []
      : []);
    }
  }, [post?.id]); // Only reset when the post ID changes, not on every post prop change

  const handleSaveEdit = async (newTitle: string, newDescription: string) => {
    if (!post) return;

    try {
      setIsSubmitting(true);
      const updatedPost: ExtendedPost = {
        ...post,
        title: newTitle,
        description: newDescription,
        userId: post.userId || user?.id || 'anonymous',
        timestamp: post.timestamp || new Date().toISOString(),
      };

      const result = await updatePost(updatedPost);

      if (result.success) {
        toast({
          title: "Post updated",
          description: "Your changes have been saved successfully.",
        });
      } else {
        throw new Error(result.error || "Failed to update post");
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    // Attempt to update the backend (optional, can fail silently)
    if (post) {
      togglePostLike(post.id)
        .catch(err => console.error('Failed to toggle like:', err));
    }
  };

  const handleCommentLikeToggle = (commentId: string) => {
    setCommentList(comments => 
      comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, isLiked: !comment.isLiked }
          : comment
      )
    );
  };

  const handleCommentSubmit = (comment: string) => {
    if (!comment.trim() || !user) return;
    
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      username: user?.username || 'Anonymous',
      text: comment,
      timestamp: new Date().toISOString(),
      isLiked: false,
      likes: 0,
    };
    
    // Add comment to local state
    setCommentList(prev => [...prev, newComment]);
    
    // Update post with new comment (optional)
    if (post) {
      // Prepare comments array ensuring it's properly typed
      const updatedComments = [
        ...(Array.isArray(post.comments) ? post.comments : []), 
        { 
          id: newComment.id,
          username: newComment.username,
          text: newComment.text,
          timestamp: newComment.timestamp,
          isLiked: false,
          likes: 0
        }
      ];
      
      // Create a proper updated post object that matches the ExtendedPost type
      const updatedPost: ExtendedPost = {
        ...post,
        comments: updatedComments,
        commentsCount: updatedComments.length
      };
      
      // This is optional and can fail silently
      updatePost(updatedPost)
        .catch(err => console.error('Failed to save comment:', err));
    }
  };

  const handleFindSimilar = () => {
    navigate('/feed');
  };

  return {
    isLiked,
    likeCount,
    commentList,
    isSubmitting,
    isAuthor,
    handleSaveEdit,
    handleLikeToggle,
    handleCommentLikeToggle,
    handleCommentSubmit,
    handleFindSimilar,
  };
}

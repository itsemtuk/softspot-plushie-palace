
import { useState, useEffect } from "react";
import { Comment, ExtendedPost } from "@/types/marketplace";
import { updatePost, deletePost } from "@/utils/posts/postManagement";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function usePostDialog(post: ExtendedPost | null) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      // Check if the current user has liked the post
      const liked = Array.isArray(post.likes) 
        ? post.likes.some(like => like.userId === "user-1") // Replace with actual user ID
        : false;
      setIsLiked(liked);
      
      // Set like count
      const count = Array.isArray(post.likes) ? post.likes.length : (typeof post.likes === 'number' ? post.likes : 0);
      setLikeCount(count);
      
      // Set comments
      const comments = Array.isArray(post.comments) ? post.comments : [];
      setCommentList(comments);
      
      // Check if current user is the author
      setIsAuthor(post.userId === "user-1"); // Replace with actual user ID
    }
  }, [post]);

  const handleLikeToggle = async () => {
    if (!post) return;
    
    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      // Update the post with new like status
      const updatedLikes = Array.isArray(post.likes) 
        ? isLiked 
          ? post.likes.filter(like => like.userId !== "user-1") 
          : [...post.likes, { userId: "user-1", username: "Me" }]
        : isLiked ? 0 : 1;
      
      const editedPost: ExtendedPost = {
        ...post,
        likes: updatedLikes
      };
      
      await updatePost(editedPost);
    } catch (error) {
      // Revert UI on error
      setIsLiked(isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update like status. Please try again."
      });
    }
  };

  const handleCommentLikeToggle = async (commentId: string) => {
    if (!post) return;
    
    // Find the comment
    const updatedComments = commentList.map(comment => {
      if (comment.id === commentId) {
        const isCommentLiked = Array.isArray(comment.likes) 
          ? comment.likes.some(like => like.userId === "user-1")
          : false;
        
        const updatedLikes = Array.isArray(comment.likes)
          ? isCommentLiked
            ? comment.likes.filter(like => like.userId !== "user-1")
            : [...comment.likes, { userId: "user-1", username: "Me" }]
          : isCommentLiked ? [] : [{ userId: "user-1", username: "Me" }];
        
        return { ...comment, likes: updatedLikes };
      }
      return comment;
    });
    
    // Update UI optimistically
    setCommentList(updatedComments);
    
    try {
      // Update the post with new comments
      const editedPost: ExtendedPost = {
        ...post,
        comments: updatedComments
      };
      
      await updatePost(editedPost);
    } catch (error) {
      // Revert on error
      setCommentList(commentList);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update comment like. Please try again."
      });
    }
  };

  const handleCommentSubmit = async (text: string) => {
    if (!post || !text.trim()) return;
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: "user-1", // Replace with actual user ID
      username: "Me", // Replace with actual username
      content: text.trim(),
      createdAt: new Date().toISOString(),
      likes: []
    };
    
    // Update UI optimistically
    const updatedComments = [newComment, ...commentList];
    setCommentList(updatedComments);
    
    try {
      // Update the post with new comment
      const editedPost: ExtendedPost = {
        ...post,
        comments: updatedComments
      };
      
      await updatePost(editedPost);
    } catch (error) {
      // Revert on error
      setCommentList(commentList);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment. Please try again."
      });
    }
  };

  const handleSaveEdit = async (editedPost: ExtendedPost): Promise<boolean> => {
    if (!post) return false;
    
    try {
      await updatePost(editedPost);
      
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated."
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update post. Please try again."
      });
      
      return false;
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    
    try {
      const result = await deletePost(post.id);
      
      if (result.success) {
        toast({
          title: "Post deleted",
          description: "Your post has been successfully deleted."
        });
        
        // Navigate back or to profile
        navigate('/profile');
      } else {
        throw new Error(result.error || "Failed to delete post");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post. Please try again."
      });
    }
  };

  const handleFindSimilar = () => {
    // This would typically navigate to a search page with similar items
    console.log("Finding similar items to:", post?.title);
    
    toast({
      title: "Finding similar items",
      description: "This feature is coming soon!"
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
    handleDeletePost,
  };
}

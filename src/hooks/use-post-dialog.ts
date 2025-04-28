import { ExtendedPost, Comment } from "@/types/marketplace";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export const usePostDialog = (post: ExtendedPost | null) => {
  // Fix all the state definitions to match proper types
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post?.likes || 0);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  
  // Check if the current user is the author of the post
  useState(() => {
    if (!post) return;
    
    // Get current user ID from localStorage or auth context
    const currentUserId = localStorage.getItem('currentUserId');
    setIsAuthor(currentUserId === post.userId);
    
    // Check if the post is liked by the current user
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setIsLiked(likedPosts.includes(post.id));
    
    // Load comments for this post
    const loadComments = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data or localStorage
        const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
        const postComments = allComments.filter((c: any) => c.postId === post.id);
        setCommentList(postComments);
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    };
    
    loadComments();
  }, [post]);
  
  // This is the fix for the error with the Type 'number | any[]'
  const handleLikeToggle = () => {
    if (isLiked) {
      // If already liked, decrease the count
      setLikeCount(typeof likeCount === 'number' ? likeCount - 1 : 0);
    } else {
      // If not liked, increase the count
      setLikeCount(typeof likeCount === 'number' ? likeCount + 1 : 1);
    }
    setIsLiked(!isLiked);
    
    // Update liked posts in localStorage
    try {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      if (isLiked) {
        const updatedLikes = likedPosts.filter((id: string) => id !== post?.id);
        localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
      } else {
        likedPosts.push(post?.id);
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      }
    } catch (error) {
      console.error('Error updating liked posts:', error);
    }
  };
  
  // Handle comment submission
  const handleCommentSubmit = (text: string) => {
    if (!post || !text.trim()) return;
    
    const currentUsername = localStorage.getItem('currentUsername') || 'Anonymous';
    const currentUserId = localStorage.getItem('currentUserId') || 'user-1';
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUserId,
      username: currentUsername,
      content: text,
      createdAt: new Date().toISOString(),
      likes: []
    };
    
    // Add to local state
    setCommentList([newComment, ...commentList]);
    
    // Save to localStorage
    try {
      const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
      allComments.push({...newComment, postId: post.id});
      localStorage.setItem('comments', JSON.stringify(allComments));
    } catch (error) {
      console.error('Error saving comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your comment. Please try again."
      });
    }
  };
  
  // Fix this function as well
  const handleCommentLikeToggle = (commentId: string) => {
    setCommentList(
      commentList.map(comment => {
        if (comment.id === commentId) {
          const currentLikes = typeof comment.likes === 'number' ? comment.likes : comment.likes?.length || 0;
          return {
            ...comment,
            likes: comment.isLiked ? currentLikes - 1 : currentLikes + 1,
            isLiked: !comment.isLiked
          };
        }
        return comment;
      })
    );
    
    // Update in localStorage
    try {
      const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
      const updatedComments = allComments.map((c: any) => {
        if (c.id === commentId) {
          const currentUserId = localStorage.getItem('currentUserId') || 'user-1';
          const userLiked = c.likes?.some((like: any) => like.userId === currentUserId);
          
          if (userLiked) {
            c.likes = c.likes.filter((like: any) => like.userId !== currentUserId);
          } else {
            c.likes = [...(c.likes || []), { userId: currentUserId }];
          }
        }
        return c;
      });
      
      localStorage.setItem('comments', JSON.stringify(updatedComments));
    } catch (error) {
      console.error('Error updating comment like:', error);
    }
  };
  
  // Handle post edit
  const handleSaveEdit = (updatedPost: Partial<ExtendedPost>) => {
    if (!post) return;
    
    // In a real app, this would be an API call
    toast({
      title: "Post updated",
      description: "Your changes have been saved."
    });
  };
  
  // Handle finding similar posts
  const handleFindSimilar = () => {
    if (!post) return;
    
    // In a real app, this would navigate to a search page with similar posts
    toast({
      title: "Finding similar posts",
      description: "This feature is coming soon!"
    });
  };
  
  // Handle post deletion
  const handleDeletePost = async () => {
    if (!post || !isAuthor) return;
    
    try {
      // In a real app, this would be an API call
      // For now, we'll just show a success message
      toast({
        title: "Post deleted",
        description: "Your post has been removed."
      });
      
      // Return true to indicate successful deletion
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post. Please try again."
      });
      return false;
    }
  };
  
  return {
    isLiked,
    likeCount,
    commentList,
    isAuthor,
    handleSaveEdit,
    handleLikeToggle,
    handleCommentLikeToggle,
    handleCommentSubmit,
    handleFindSimilar,
    handleDeletePost,
  };
};

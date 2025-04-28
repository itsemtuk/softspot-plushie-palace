import { ExtendedPost, Comment } from "@/types/marketplace";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

// Add openPostDialog as a standalone export function
let setCurrentPost: (post: ExtendedPost | null) => void = () => {};
let setDialogOpen: (open: boolean) => void = () => {};

export const openPostDialog = (post: ExtendedPost) => {
  setCurrentPost(post);
  setDialogOpen(true);
};

export const usePostDialog = (post: ExtendedPost | null = null) => {
  // State for the dialog visibility
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPostData, setCurrentPostData] = useState<ExtendedPost | null>(post);
  // Fix all the state definitions to match proper types
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(currentPostData?.likes || 0);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  
  // Set the references for the openPostDialog function
  useEffect(() => {
    setCurrentPost = setCurrentPostData;
    setDialogOpen = setIsDialogOpen;
  }, []);
  
  // Check if the current user is the author of the post
  useEffect(() => {
    if (!currentPostData) return;
    
    // Get current user ID from localStorage or auth context
    const currentUserId = localStorage.getItem('currentUserId');
    setIsAuthor(currentUserId === currentPostData.userId);
    
    // Check if the post is liked by the current user
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setIsLiked(likedPosts.includes(currentPostData.id));
    
    // Load comments for this post
    const loadComments = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data or localStorage
        const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
        const postComments = allComments.filter((c: any) => c.postId === currentPostData.id);
        setCommentList(postComments);
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    };
    
    loadComments();
  }, [currentPostData]);
  
  const handleLikeToggle = () => {
    if (isLiked) {
      // If already liked, decrease the count
      setLikeCount(likeCount - 1);
    } else {
      // If not liked, increase the count
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
    
    // Update liked posts in localStorage
    try {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      if (isLiked) {
        const updatedLikes = likedPosts.filter((id: string) => id !== currentPostData?.id);
        localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
      } else {
        likedPosts.push(currentPostData?.id);
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      }
    } catch (error) {
      console.error('Error updating liked posts:', error);
    }
  };
  
  // Handle comment submission
  const handleCommentSubmit = (text: string) => {
    if (!currentPostData || !text.trim()) return;
    
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
      allComments.push({...newComment, postId: currentPostData.id});
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
  
  // Fix commenting functionality
  const handleCommentLikeToggle = (commentId: string) => {
    setCommentList(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          // Create a proper likes array if it doesn't exist
          const currentLikes = comment.likes || [];
          const currentUserId = localStorage.getItem('currentUserId') || 'user-1';
          
          // Check if user has liked the comment
          const userLikeIndex = currentLikes.findIndex(like => like.userId === currentUserId);
          let updatedLikes = [...currentLikes];
          let isNowLiked = comment.isLiked || false;
          
          if (userLikeIndex >= 0) {
            // User already liked it, remove the like
            updatedLikes.splice(userLikeIndex, 1);
            isNowLiked = false;
          } else {
            // User hasn't liked it yet, add the like
            updatedLikes.push({ userId: currentUserId });
            isNowLiked = true;
          }
          
          return {
            ...comment,
            likes: updatedLikes,
            isLiked: isNowLiked
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
  
  // Handle post edit - Update to return a Promise<boolean>
  const handleSaveEdit = async (updatedPost: Partial<ExtendedPost>): Promise<boolean> => {
    if (!currentPostData) return false;
    
    try {
      // In a real app, this would be an API call
      toast({
        title: "Post updated",
        description: "Your changes have been saved."
      });
      
      return true;
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update post. Please try again."
      });
      
      return false;
    }
  };
  
  // Handle finding similar posts
  const handleFindSimilar = () => {
    if (!currentPostData) return;
    
    // In a real app, this would navigate to a search page with similar posts
    toast({
      title: "Finding similar posts",
      description: "This feature is coming soon!"
    });
  };
  
  // Handle post deletion
  const handleDeletePost = async (): Promise<boolean> => {
    if (!currentPostData || !isAuthor) return false;
    
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
    openPostDialog,
    currentPostData,
    isDialogOpen,
    setIsDialogOpen,
  };
};

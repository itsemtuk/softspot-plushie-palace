
import { ExtendedPost, Comment } from "@/types/marketplace";
import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { toast } from "@/components/ui/use-toast";

// Create a context for the post dialog
type PostDialogContextType = {
  openPostDialog: (post: ExtendedPost) => void;
  currentPostData: ExtendedPost | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
};

const PostDialogContext = createContext<PostDialogContextType | undefined>(undefined);

// Provider component to be used in App.tsx
export const PostDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPostData, setCurrentPostData] = useState<ExtendedPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const openPostDialog = useCallback((post: ExtendedPost) => {
    console.log("Opening post dialog for post:", post.id);
    setCurrentPostData(post);
    setIsDialogOpen(true);
  }, []);

  return (
    <PostDialogContext.Provider value={{ 
      openPostDialog, 
      currentPostData, 
      isDialogOpen, 
      setIsDialogOpen 
    }}>
      {children}
    </PostDialogContext.Provider>
  );
};

// Exported standalone function to open the dialog from anywhere
export const openPostDialog = (post: ExtendedPost) => {
  // This function will be replaced by the context-based approach
  console.warn("Using deprecated openPostDialog function. Please update to use the hook instead.");
  const event = new CustomEvent('openPostDialog', { detail: post });
  window.dispatchEvent(event);
};

// Add event listener in any component that needs to handle this event
if (typeof window !== 'undefined') {
  window.addEventListener('openPostDialog', ((e: CustomEvent) => {
    console.log("Event listener caught openPostDialog event");
    // The handler will be implemented by components that use usePostDialog
  }) as EventListener);
}

export const usePostDialog = (post: ExtendedPost | null = null) => {
  const context = useContext(PostDialogContext);
  
  // State for the dialog and post data
  const [currentPostData, setCurrentPostData] = useState<ExtendedPost | null>(post);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(currentPostData?.likes || 0);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);

  // If we're in a context, use that for dialog state
  useEffect(() => {
    if (context) {
      // Event handler for global openPostDialog events
      const handleOpenPostDialogEvent = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail) {
          context.openPostDialog(customEvent.detail);
        }
      };

      window.addEventListener('openPostDialog', handleOpenPostDialogEvent as EventListener);
      
      return () => {
        window.removeEventListener('openPostDialog', handleOpenPostDialogEvent as EventListener);
      };
    }
  }, [context]);

  // Use the post from props or context
  useEffect(() => {
    if (post) {
      setCurrentPostData(post);
    } else if (context?.currentPostData) {
      setCurrentPostData(context.currentPostData);
    }
  }, [post, context?.currentPostData]);
  
  // Check if the current user is the author of the post
  useEffect(() => {
    if (!currentPostData) return;
    
    // Get current user ID from localStorage or auth context
    const currentUserId = localStorage.getItem('currentUserId');
    setIsAuthor(currentUserId === currentPostData.userId);
    
    // Check if the post is liked by the current user
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setIsLiked(likedPosts.includes(currentPostData.id));
    
    // Set like count from post data
    setLikeCount(currentPostData.likes || 0);
    
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
  
  // Handle like toggle
  const handleLikeToggle = () => {
    if (!currentPostData) return;
    
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
      text: text,
      timestamp: new Date().toISOString(),
      likes: 0
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
  
  // Handle comment like toggle
  const handleCommentLikeToggle = (commentId: string) => {
    setCommentList(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          const currentUserId = localStorage.getItem('currentUserId') || 'user-1';
          
          // Convert any likes format to a number for consistency
          let likesCount = typeof comment.likes === 'number' ? comment.likes : 
                       Array.isArray(comment.likes) ? comment.likes.length : 0;
                       
          if (comment.isLiked) {
            // User already liked it, remove the like
            likesCount = Math.max(0, likesCount - 1);
          } else {
            // User hasn't liked it yet, add the like
            likesCount += 1;
          }
          
          return {
            ...comment,
            likes: likesCount,
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
          const isLiked = c.likedBy?.includes(currentUserId) || false;
          
          let likesCount = typeof c.likes === 'number' ? c.likes : 
                        Array.isArray(c.likes) ? c.likes.length : 0;
                        
          // Toggle like
          if (isLiked) {
            likesCount = Math.max(0, likesCount - 1);
            c.likedBy = (c.likedBy || []).filter((id: string) => id !== currentUserId);
          } else {
            likesCount += 1;
            c.likedBy = [...(c.likedBy || []), currentUserId];
          }
          
          return {
            ...c,
            likes: likesCount,
            isLiked: !isLiked
          };
        }
        return c;
      });
      
      localStorage.setItem('comments', JSON.stringify(updatedComments));
    } catch (error) {
      console.error('Error updating comment like:', error);
    }
  };
  
  // Handle post edit
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

  // Use the context if available, otherwise use local state
  const openCurrentPostDialog = useCallback((post: ExtendedPost) => {
    if (context) {
      context.openPostDialog(post);
    } else {
      setCurrentPostData(post);
      setIsDialogOpen(true);
    }
  }, [context]);
  
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
    openPostDialog: openCurrentPostDialog,
    currentPostData: context?.currentPostData || currentPostData,
    isDialogOpen: context?.isDialogOpen || isDialogOpen,
    setIsDialogOpen: context?.setIsDialogOpen || setIsDialogOpen,
  };
};

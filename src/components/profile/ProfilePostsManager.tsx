import { useState, useCallback } from 'react';
import { ExtendedPost } from '@/types/core';
import { deletePost } from '@/utils/posts/postManagement';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/clerk-react';

export const useProfilePostsManager = (initialPosts: ExtendedPost[]) => {
  const [posts, setPosts] = useState<ExtendedPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleDeletePost = useCallback(async (postId: string) => {
    if (!postId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid post ID",
      });
      return;
    }

    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to delete posts.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await deletePost(postId, user.id);
      
      if (result.success) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        toast({
          title: "Post deleted",
          description: "Your post has been successfully deleted.",
        });
      } else {
        throw new Error(result.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the post. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const refreshPosts = useCallback((newPosts: ExtendedPost[]) => {
    setPosts(newPosts);
  }, []);

  return {
    posts,
    isLoading,
    handleDeletePost,
    refreshPosts,
  };
};

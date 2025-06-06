
import { useState, useEffect, useCallback, useMemo } from "react";
import { ExtendedPost } from "@/types/core";
import { toast } from "@/components/ui/use-toast";
import { getAllPosts } from "@/utils/posts/postFetch";
import { getPosts } from "@/utils/postStorage";

export const useFeedData = () => {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allPostsResult, userPostsResult] = await Promise.allSettled([
        getAllPosts(),
        getPosts()
      ]);
      
      const allPosts = allPostsResult.status === 'fulfilled' ? allPostsResult.value : [];
      const userPosts = userPostsResult.status === 'fulfilled' ? userPostsResult.value : [];
      
      const postMap = new Map();
      [...allPosts, ...userPosts].forEach(post => {
        if (post.id && !postMap.has(post.id)) {
          postMap.set(post.id, post);
        }
      });
      
      setPosts(Array.from(postMap.values()));
    } catch (error) {
      console.error("Error fetching posts:", error);
      const errorMessage = "Failed to load posts. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    setPosts,
    isLoading,
    error,
    fetchPosts
  };
};

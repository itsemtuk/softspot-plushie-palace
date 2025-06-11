
import { useState, useEffect, useCallback } from "react";
import { ExtendedPost } from "@/types/core";
import { fetchPosts } from "@/utils/posts/postFetch";

export function useFeedData() {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(false);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts || []);
    } catch (err) {
      console.error("Error loading posts:", err);
      setError(true);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const updatePosts = useCallback((updatedPosts: ExtendedPost[]) => {
    setPosts(updatedPosts);
  }, []);

  return {
    posts,
    setPosts: updatePosts,
    isLoading,
    error,
    refetch: loadPosts
  };
}

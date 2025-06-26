
import { useState, useEffect, useCallback } from "react";
import { ExtendedPost } from "@/types/core";
import { supabase } from "@/integrations/supabase/client";

export function useFeedData() {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(false);
      
      // Fetch from feed_posts table instead of posts table
      const { data: feedPosts, error: feedError } = await supabase
        .from('feed_posts')
        .select(`
          *,
          users!feed_posts_user_id_fkey(username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (feedError) {
        console.error("Error fetching feed posts:", feedError);
        setPosts([]);
        return;
      }

      const formattedPosts: ExtendedPost[] = (feedPosts || []).map(post => ({
        id: post.id,
        userId: post.user_id,
        user_id: post.user_id,
        username: (post.users as any)?.username || 'User',
        image: post.image || '',
        title: post.title || '',
        description: post.description || '',
        content: post.content,
        tags: [],
        likes: 0,
        comments: 0,
        timestamp: post.created_at || '',
        createdAt: post.created_at || '',
        created_at: post.created_at || '',
        updatedAt: post.updated_at || post.created_at || '',
        location: '',
        forSale: false,
        sold: false
      }));

      setPosts(formattedPosts);
    } catch (err) {
      console.error("Error loading feed posts:", err);
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

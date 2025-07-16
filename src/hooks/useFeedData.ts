import { useState, useEffect, useCallback } from 'react';
import { ExtendedPost } from '@/types/core';
import { supabase } from '@/utils/supabase/client';
import { formatFeedPost } from '@/utils/posts/formatters';

export function useFeedData() {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      
      const { data: feedPosts, error: feedError } = await supabase
        .from('feed_posts')
        .select(`
          *,
          users!feed_posts_user_id_fkey(username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (feedError) {
        throw new Error(`Failed to fetch feed posts: ${feedError.message}`);
      }

      const formattedPosts = (feedPosts || []).map(post => 
        formatFeedPost(post as any, (post as any).users)
      );

      setPosts(formattedPosts);
      console.log("Feed posts loaded:", formattedPosts.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      console.error("Error fetching posts:", err);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refreshPosts = useCallback(async () => {
    setIsLoading(true);
    await fetchPosts();
  }, [fetchPosts]);

  const addPost = useCallback((newPost: ExtendedPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, []);

  return {
    posts,
    isLoading,
    error,
    refreshPosts,
    addPost,
    setPosts
  };
}
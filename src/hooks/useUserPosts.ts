import { useState, useEffect } from 'react';
import { ExtendedPost } from '@/types/core';
import { supabase, createAuthenticatedSupabaseClient } from '@/utils/supabase/client';
import { formatPost } from '@/utils/posts/formatters';
import { useAuth } from '@clerk/clerk-react';

export function useUserPosts(userId?: string, includeMarketplace = true) {
  const { getToken } = useAuth();
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [marketplacePosts, setMarketplacePosts] = useState<ExtendedPost[]>([]);
  const [archivedPosts, setArchivedPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get authenticated client if available
        const token = await getToken({ template: "supabase" });
        const client = token ? createAuthenticatedSupabaseClient(token) : supabase;

        // Fetch from both posts and feed_posts tables
        const [postsResponse, feedPostsResponse] = await Promise.all([
          client
            .from('posts')
            .select('*, users!posts_user_id_fkey(username, first_name, avatar_url)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false }),
          client
            .from('feed_posts')
            .select('*, users!feed_posts_user_id_fkey(username, first_name, avatar_url)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        ]);

        if (postsResponse.error) {
          throw new Error(`Failed to fetch posts: ${postsResponse.error.message}`);
        }

        if (feedPostsResponse.error) {
          throw new Error(`Failed to fetch feed posts: ${feedPostsResponse.error.message}`);
        }

        const allPosts: ExtendedPost[] = [];

        // Format posts from posts table
        if (postsResponse.data) {
          const formattedPosts = postsResponse.data.map(post => 
            formatPost(post, post.users)
          );
          allPosts.push(...formattedPosts);
        }

        // Format posts from feed_posts table
        if (feedPostsResponse.data) {
          const formattedFeedPosts = feedPostsResponse.data.map(post => 
            formatPost(post, post.users, { forSale: false })
          );
          allPosts.push(...formattedFeedPosts);
        }

        // Sort all posts by creation date
        allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Separate posts by type
        const regularPosts = allPosts.filter(post => !post.forSale && !post.archived);
        const marketplaceItems = allPosts.filter(post => post.forSale && !post.archived);
        const archived = allPosts.filter(post => post.archived);

        setPosts(regularPosts);
        setMarketplacePosts(marketplaceItems);
        setArchivedPosts(archived);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
        console.error('Error fetching user posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [userId, getToken]);

  return {
    posts,
    marketplacePosts,
    archivedPosts,
    isLoading,
    error,
    setPosts,
    setMarketplacePosts,
    setArchivedPosts
  };
}
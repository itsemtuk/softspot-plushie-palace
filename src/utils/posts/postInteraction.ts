
import { ExtendedPost } from "@/types/marketplace";
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { getLocalPosts, savePosts } from '../storage/localStorageUtils';

const POSTS_TABLE = 'posts';

/**
 * Toggle like on a post
 */
export const togglePostLike = async (postId: string): Promise<{ success: boolean, post?: ExtendedPost, error?: any }> => {
  if (!isSupabaseConfigured()) {
    try {
      const posts = getLocalPosts();
      const post = posts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      const updatedPost = {
        ...post,
        likes: post.likes + 1
      };
      
      savePosts(posts.map(p => p.id === postId ? updatedPost : p));
      return { success: true, post: updatedPost };
    } catch (error) {
      return { success: false, error };
    }
  }

  try {
    // First get the current post to get the current like count
    const { data: posts, error: fetchError } = await supabase!
      .from(POSTS_TABLE)
      .select('*')
      .eq('id', postId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const post = posts as ExtendedPost;
    const updatedPost = {
      ...post,
      likes: post.likes + 1
    };
    
    // Update the post with the new like count
    const { error: updateError } = await supabase!
      .from(POSTS_TABLE)
      .update({ likes: updatedPost.likes })
      .eq('id', postId);
      
    if (updateError) throw updateError;
    
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error('Error toggling post like:', error);
    return { success: false, error };
  }
};

/**
 * Share a post
 * This is a placeholder for future functionality
 */
export const sharePost = async (postId: string): Promise<{ success: boolean, url: string, error?: any }> => {
  try {
    // In a real implementation, this might track share analytics, generate special links, etc.
    return { 
      success: true, 
      url: window.location.origin + "/post/" + postId
    };
  } catch (error) {
    console.error('Error sharing post:', error);
    return { success: false, url: "", error };
  }
};

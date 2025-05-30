
import { ExtendedPost } from "@/types/marketplace";
import { supabase, isSupabaseConfigured, handleSupabaseError } from '../supabase/client';
import { getLocalPosts } from '../storage/localStorageUtils';
import { toast } from '@/components/ui/use-toast';

/**
 * Retrieves posts from storage
 */
export const getPosts = async (): Promise<ExtendedPost[]> => {
  if (!isSupabaseConfigured()) {
    return getLocalPosts();
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false }); // Fixed: Use created_at instead of timestamp
      
    if (error) {
      const errorDetails = handleSupabaseError(error);
      if (errorDetails.isCORSError) {
        toast({
          title: "Connection Issue",
          description: "Using local data due to connection issues."
        });
      }
      throw error;
    }
    return data as ExtendedPost[];
  } catch (error) {
    console.error('Error retrieving posts from Supabase:', error);
    return getLocalPosts();
  }
};

/**
 * Retrieves all public posts (accessible without login)
 */
export const getAllPublicPosts = async (): Promise<ExtendedPost[]> => {
  // For now, this is just an alias to getPosts
  // In the future, you might want to filter for public posts only
  return getPosts();
};

/**
 * Retrieves posts by a specific user
 */
export const getUserPosts = async (userId: string): Promise<ExtendedPost[]> => {
  if (!isSupabaseConfigured()) {
    return getLocalPosts().filter(post => post.userId === userId);
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('userId', userId)
      .order('created_at', { ascending: false }); // Fixed: Use created_at instead of timestamp
      
    if (error) {
      const errorDetails = handleSupabaseError(error);
      if (errorDetails.isCORSError) {
        toast({
          title: "Connection Issue",
          description: "Using local data due to connection issues."
        });
      }
      throw error;
    }
    return data as ExtendedPost[];
  } catch (error) {
    console.error('Error retrieving user posts from Supabase:', error);
    return getLocalPosts().filter(post => post.userId === userId);
  }
};

/**
 * Gets a single post by ID
 */
export const getPostById = async (postId: string): Promise<ExtendedPost | null> => {
  if (!isSupabaseConfigured()) {
    const posts = getLocalPosts();
    return posts.find(post => post.id === postId) || null;
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();
      
    if (error) {
      const errorDetails = handleSupabaseError(error);
      if (errorDetails.isCORSError) {
        toast({
          title: "Connection Issue",
          description: "Using local data due to connection issues."
        });
      }
      throw error;
    }
    return data as ExtendedPost;
  } catch (error) {
    console.error(`Error retrieving post ${postId} from Supabase:`, error);
    // Fall back to local storage
    const posts = getLocalPosts();
    return posts.find(post => post.id === postId) || null;
  }
};

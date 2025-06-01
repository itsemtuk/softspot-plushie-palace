
import { ExtendedPost } from "@/types/marketplace";
import { supabase, isSupabaseConfigured, handleSupabaseError } from '../supabase/client';
import { getLocalPosts } from '../storage/localStorageUtils';
import { toast } from '@/components/ui/use-toast';

/**
 * Retrieves posts from storage with enhanced error handling
 */
export const getPosts = async (): Promise<ExtendedPost[]> => {
  if (!isSupabaseConfigured()) {
    return getLocalPosts();
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      const errorDetails = handleSupabaseError(error);
      if (errorDetails.isCORSError) {
        console.warn("CORS issue detected, using local data");
        toast({
          title: "Connection Issue",
          description: "Using local data due to connection issues."
        });
      } else {
        console.error("Supabase query error:", error);
      }
      return getLocalPosts();
    }

    // Transform Supabase data to ExtendedPost format
    const transformedPosts: ExtendedPost[] = (data || []).map(item => {
      let content;
      try {
        content = typeof item.content === 'string' ? JSON.parse(item.content) : item.content;
      } catch {
        content = { title: '', description: item.content || '', image: '', tags: [] };
      }

      return {
        id: item.id,
        userId: item.user_id,
        user_id: item.user_id,
        username: content.username || 'User',
        image: content.image || '',
        title: content.title || '',
        description: content.description || '',
        content: content.description || '',
        tags: Array.isArray(content.tags) ? content.tags : [],
        likes: content.likes || 0,
        comments: content.comments || 0,
        timestamp: item.created_at,
        createdAt: item.created_at,
        created_at: item.created_at,
        updatedAt: item.created_at,
        location: content.location || "",
        forSale: content.forSale || false,
        price: content.price ? Number(content.price) : undefined,
        brand: content.brand || undefined,
        condition: content.condition || undefined,
        material: content.material || undefined,
        filling: content.filling || undefined,
        species: content.species || undefined,
        deliveryMethod: content.deliveryMethod || undefined,
        deliveryCost: content.deliveryCost ? Number(content.deliveryCost) : undefined,
        size: content.size || undefined,
      } as ExtendedPost;
    });

    return transformedPosts;
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

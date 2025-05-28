import { ExtendedPost } from "@/types/marketplace";
import { supabase, isSupabaseConfigured, safeQueryWithRetry } from '../supabase/client';
import { setCurrentUserContext } from '../supabase/rls';
import { getLocalPosts, savePosts, getCurrentUserId, updateSyncTimestamp } from '../storage/localStorageUtils';
import { uploadImage, deleteImage } from '../storage/imageStorage';
import { withRetry } from '../retry';

const POSTS_TABLE = 'posts';

/**
 * Gets posts from storage
 */
export const getStorage = (): ExtendedPost[] => {
  return getLocalPosts();
};

/**
 * Saves a post to storage with retry logic
 */
export const savePost = async (post: ExtendedPost | ExtendedPost[], userId?: string): Promise<{ success: boolean, error?: any }> => {
  // Handle both single post and array of posts
  if (Array.isArray(post)) {
    try {
      savePosts(post);
      updateSyncTimestamp();
      return { success: true };
    } catch (error) {
      console.error('Error saving posts array to localStorage:', error);
      return { success: false, error };
    }
  }
  
  if (!isSupabaseConfigured()) {
    // Fallback to local storage if Supabase is not configured
    try {
      const existingPosts = getLocalPosts();
      
      // Ensure the post has a userId
      const postWithUser = {
        ...post,
        userId: post.userId || userId || getCurrentUserId()
      };
      
      // Update existing post or add as new post
      const updatedPosts = existingPosts.filter(p => p.id !== post.id);
      updatedPosts.unshift(postWithUser);
      
      savePosts(updatedPosts);
      updateSyncTimestamp();
      return { success: true };
    } catch (error) {
      console.error('Error saving post to localStorage:', error);
      return { success: false, error };
    }
  }

  try {
    // Set user context for RLS if userId is provided
    if (userId) {
      await setCurrentUserContext(userId);
    }

    const result = await withRetry(async () => {
      const { error } = await supabase!
        .from(POSTS_TABLE)
        .upsert({
          id: post.id,
          user_id: post.userId || userId || getCurrentUserId(),
          content: JSON.stringify({
            image: post.image,
            title: post.title,
            description: post.description || '',
            tags: post.tags || [],
          }),
          created_at: post.createdAt || post.timestamp || new Date().toISOString(), // Use createdAt or timestamp
        }, { onConflict: 'id' });
        
      if (error) throw error;
      return { success: true };
    }, {
      maxAttempts: 3,
      delayMs: 1000,
      shouldRetry: (error) => !error.message?.includes('CORS')
    });
    
    updateSyncTimestamp();
    return result;
  } catch (error) {
    console.error('Error saving post to Supabase:', error);
    
    // Fallback to localStorage on failure
    try {
      const existingPosts = getLocalPosts();
      const postWithUser = {
        ...post,
        userId: post.userId || userId || getCurrentUserId()
      };
      const updatedPosts = existingPosts.filter(p => p.id !== post.id);
      updatedPosts.unshift(postWithUser);
      savePosts(updatedPosts);
      updateSyncTimestamp();
      return { success: true };
    } catch (localError) {
      return { success: false, error: localError };
    }
  }
};

/**
 * Adds a new post
 */
export const addPost = async (post: ExtendedPost, userId?: string): Promise<{ success: boolean, error?: any, post?: ExtendedPost }> => {
  try {
    // Ensure we have a timestamp
    if (!post.timestamp) {
      post.timestamp = new Date().toISOString();
    }
    
    // Ensure we have a userId
    const finalUserId = userId || post.userId || getCurrentUserId();
    post = { ...post, userId: finalUserId };
    
    // First, upload the image if it's a data URL
    if (post.image && post.image.startsWith('data:')) {
      const { imageUrl, error: uploadError } = await uploadImage(post.image, post.id);
      if (uploadError) {
        throw uploadError;
      }
      post = { ...post, image: imageUrl };
    }
    
    // Save the post
    const result = await savePost(post, finalUserId);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to save post');
    }
    
    return { success: true, post };
  } catch (error) {
    console.error('Error adding post:', error);
    return { success: false, error };
  }
};

export const updatePost = async (updatedPost: ExtendedPost, userId?: string): Promise<{ success: boolean, error?: any }> => {
  if (!isSupabaseConfigured()) {
    return savePost(updatedPost, userId);
  }

  try {
    // Set user context for RLS
    if (userId) {
      await setCurrentUserContext(userId);
    }

    // Check if the image is a data URL and needs to be uploaded
    if (updatedPost.image && updatedPost.image.startsWith('data:')) {
      const { imageUrl, error: uploadError } = await uploadImage(updatedPost.image, updatedPost.id);
      if (uploadError) {
        throw uploadError;
      }
      
      updatedPost = { ...updatedPost, image: imageUrl };
    }
    
    const { error } = await supabase!
      .from(POSTS_TABLE)
      .update({
        content: JSON.stringify({
          image: updatedPost.image,
          title: updatedPost.title,
          description: updatedPost.description || '',
          tags: updatedPost.tags || [],
        })
      })
      .eq('id', updatedPost.id);
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, error };
  }
};

/**
 * Deletes a post by ID
 */
export const deletePost = async (postId: string, userId?: string): Promise<{ success: boolean, error?: any }> => {
  try {
    // First, delete the image from storage
    try {
      await deleteImage(postId);
    } catch (error) {
      console.error('Error deleting post image:', error);
      // Continue with post deletion even if image deletion fails
    }
    
    if (!isSupabaseConfigured()) {
      const posts = getLocalPosts();
      savePosts(posts.filter(p => p.id !== postId));
      return { success: true };
    }
    
    // Set user context for RLS
    if (userId) {
      await setCurrentUserContext(userId);
    }
    
    const { error } = await supabase!
      .from(POSTS_TABLE)
      .delete()
      .eq('id', postId);
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error };
  }
};

export const getAllUserPosts = async (userId: string = getCurrentUserId()): Promise<ExtendedPost[]> => {
  if (!isSupabaseConfigured()) {
    return getLocalPosts().filter(post => post.userId === userId);
  }
  
  try {
    // Set user context for RLS
    await setCurrentUserContext(userId);
    
    const { data, error } = await supabase!
      .from(POSTS_TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // Fixed: Use created_at instead of timestamp
      
    if (error) throw error;
    
    // Transform Supabase data back to ExtendedPost format
    return (data || []).map(item => {
      const content = typeof item.content === 'string' ? JSON.parse(item.content) : item.content;
      return {
        id: item.id,
        userId: item.user_id,
        username: content.username || 'User',
        image: content.image || '',
        title: content.title || '',
        description: content.description || '',
        tags: content.tags || [],
        likes: content.likes || 0,
        comments: content.comments || 0,
        timestamp: item.created_at,
        createdAt: item.created_at,
        updatedAt: item.created_at,
        location: content.location || "",
        forSale: content.forSale || false,
      } as ExtendedPost;
    });
  } catch (error) {
    console.error('Error retrieving user posts:', error);
    return getLocalPosts().filter(post => post.userId === userId);
  }
};

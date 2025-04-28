
// Utility functions for post storage and retrieval using Supabase
import { ExtendedPost } from "@/types/marketplace";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have the required Supabase credentials
const hasValidSupabaseConfig = supabaseUrl !== 'https://your-project-url.supabase.co' && supabaseKey !== '';

// Create Supabase client only if we have valid credentials
const supabase = hasValidSupabaseConfig 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const POSTS_TABLE = 'posts';

// Helper function to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  if (!hasValidSupabaseConfig) {
    console.warn('Supabase is not properly configured. Using local storage fallback.');
    return false;
  }
  return true;
};

/**
 * Saves a post to Supabase
 */
export const savePost = async (post: ExtendedPost): Promise<{ success: boolean, error?: any }> => {
  if (!isSupabaseConfigured()) {
    // Fallback to local storage if Supabase is not configured
    try {
      const existingPosts = getLocalPosts();
      const updatedPosts = existingPosts.map(p => p.id === post.id ? post : p);
      if (!updatedPosts.some(p => p.id === post.id)) {
        updatedPosts.unshift(post);
      }
      savePosts(updatedPosts);
      return { success: true };
    } catch (error) {
      console.error('Error saving post to localStorage:', error);
      return { success: false, error };
    }
  }

  try {
    const { error } = await supabase!
      .from(POSTS_TABLE)
      .upsert({
        id: post.id,
        userId: post.userId,
        image: post.image,
        title: post.title,
        username: post.username,
        likes: post.likes,
        comments: post.comments,
        description: post.description || '',
        tags: post.tags || [],
        timestamp: post.timestamp,
      });
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving post to Supabase:', error);
    return { success: false, error };
  }
};

/**
 * Retrieves posts from Supabase
 */
export const getPosts = async (): Promise<ExtendedPost[]> => {
  if (!isSupabaseConfigured()) {
    // Fallback to local storage if Supabase is not configured
    return getLocalPosts();
  }

  try {
    const { data, error } = await supabase!
      .from(POSTS_TABLE)
      .select('*')
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    return data as ExtendedPost[];
  } catch (error) {
    console.error('Error retrieving posts from Supabase:', error);
    return getLocalPosts(); // Fallback to local storage
  }
};

/**
 * Retrieves posts by a specific user from Supabase
 */
export const getUserPosts = async (userId: string): Promise<ExtendedPost[]> => {
  if (!isSupabaseConfigured()) {
    // Fallback to local storage if Supabase is not configured
    return getLocalPosts().filter(post => post.userId === userId);
  }

  try {
    const { data, error } = await supabase!
      .from(POSTS_TABLE)
      .select('*')
      .eq('userId', userId)
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    return data as ExtendedPost[];
  } catch (error) {
    console.error('Error retrieving user posts from Supabase:', error);
    // Fallback to local storage
    return getLocalPosts().filter(post => post.userId === userId);
  }
};

/**
 * Adds a new post to Supabase
 */
export const addPost = async (post: ExtendedPost): Promise<{ success: boolean, error?: any }> => {
  try {
    // First, upload the image to Supabase Storage if it's a data URL
    if (post.image && post.image.startsWith('data:') && isSupabaseConfigured()) {
      const { imageUrl, error: uploadError } = await uploadImage(post.image, post.id);
      if (uploadError) {
        throw uploadError;
      }
      
      // Update the post with the new image URL
      post = { ...post, image: imageUrl };
    }
    
    return await savePost(post);
  } catch (error) {
    console.error('Error adding post to Supabase:', error);
    return { success: false, error };
  }
};

/**
 * Updates an existing post in Supabase
 */
export const updatePost = async (updatedPost: ExtendedPost): Promise<{ success: boolean, error?: any }> => {
  try {
    // Check if the image is a data URL and needs to be uploaded
    if (updatedPost.image && updatedPost.image.startsWith('data:')) {
      const { imageUrl, error: uploadError } = await uploadImage(updatedPost.image, updatedPost.id);
      if (uploadError) {
        throw uploadError;
      }
      
      // Update the post with the new image URL
      updatedPost = { ...updatedPost, image: imageUrl };
    }
    
    const { error } = await supabase
      .from(POSTS_TABLE)
      .update({
        title: updatedPost.title,
        description: updatedPost.description || '',
        tags: updatedPost.tags || [],
        image: updatedPost.image,
        likes: updatedPost.likes,
        comments: updatedPost.comments,
      })
      .eq('id', updatedPost.id);
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating post in Supabase:', error);
    return { success: false, error };
  }
};

/**
 * Deletes a post by ID from Supabase
 */
export const deletePost = async (postId: string): Promise<{ success: boolean, error?: any }> => {
  try {
    // First, delete the image from storage
    try {
      await deleteImage(postId);
    } catch (error) {
      console.error('Error deleting post image:', error);
      // Continue with post deletion even if image deletion fails
    }
    
    const { error } = await supabase
      .from(POSTS_TABLE)
      .delete()
      .eq('id', postId);
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting post from Supabase:', error);
    return { success: false, error };
  }
};

/**
 * Toggle like on a post in Supabase
 */
export const togglePostLike = async (postId: string): Promise<{ success: boolean, post?: ExtendedPost, error?: any }> => {
  try {
    // First get the current post to get the current like count
    const { data: posts, error: fetchError } = await supabase
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
    const { error: updateError } = await supabase
      .from(POSTS_TABLE)
      .update({ likes: updatedPost.likes })
      .eq('id', postId);
      
    if (updateError) throw updateError;
    
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error('Error toggling post like in Supabase:', error);
    return { success: false, error };
  }
};

/**
 * Uploads an image to Supabase Storage and returns the public URL
 */
export const uploadImage = async (dataUrl: string, imageId: string): Promise<{ imageUrl: string, error?: any }> => {
  if (!isSupabaseConfigured()) {
    // If Supabase is not configured, just return the original data URL
    return { imageUrl: dataUrl };
  }

  try {
    // Convert data URL to Blob
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    
    // Generate a unique file path
    const filePath = `posts/${imageId}/image.jpg`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase!
      .storage
      .from('images')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data } = supabase!
      .storage
      .from('images')
      .getPublicUrl(filePath);
      
    return { imageUrl: data.publicUrl };
  } catch (error) {
    console.error('Error uploading image to Supabase Storage:', error);
    
    // Return the original data URL if upload fails
    // This allows the app to continue working even if storage fails
    return { imageUrl: dataUrl, error };
  }
};

/**
 * Deletes an image from Supabase Storage
 */
export const deleteImage = async (imageId: string): Promise<{ success: boolean, error?: any }> => {
  if (!isSupabaseConfigured()) {
    return { success: true }; // Nothing to delete if not using Supabase
  }

  try {
    const filePath = `posts/${imageId}/image.jpg`;
    
    const { error } = await supabase!
      .storage
      .from('images')
      .remove([filePath]);
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting image from Supabase Storage:', error);
    return { success: false, error };
  }
};

// Fallback functions for backwards compatibility during migration
// These will use local storage as a backup in case of Supabase errors
// or for when offline functionality is needed

/**
 * Fallback: Saves posts to local storage
 */
export const savePosts = (posts: ExtendedPost[]): void => {
  try {
    localStorage.setItem('userPosts', JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving posts to local storage:', error);
  }
};

/**
 * Fallback: Retrieves posts from local storage
 */
export const getLocalPosts = (): ExtendedPost[] => {
  try {
    const storedPosts = localStorage.getItem('userPosts');
    return storedPosts ? JSON.parse(storedPosts) : [];
  } catch (error) {
    console.error('Error retrieving posts from local storage:', error);
    return [];
  }
};

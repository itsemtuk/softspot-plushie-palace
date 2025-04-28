
import { ExtendedPost } from "@/types/marketplace";
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { getLocalPosts, savePosts } from '../storage/localStorageUtils';
import { uploadImage, deleteImage } from '../storage/imageStorage';

const POSTS_TABLE = 'posts';

/**
 * Saves a post to storage
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
 * Adds a new post
 */
export const addPost = async (post: ExtendedPost): Promise<{ success: boolean, error?: any }> => {
  try {
    // First, upload the image if it's a data URL
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
    console.error('Error adding post:', error);
    return { success: false, error };
  }
};

/**
 * Updates an existing post
 */
export const updatePost = async (updatedPost: ExtendedPost): Promise<{ success: boolean, error?: any }> => {
  if (!isSupabaseConfigured()) {
    return savePost(updatedPost);
  }

  try {
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
      .update(updatedPost)
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
export const deletePost = async (postId: string): Promise<{ success: boolean, error?: any }> => {
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

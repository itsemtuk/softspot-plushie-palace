
// Utility functions for post storage and retrieval using Supabase
import { ExtendedPost } from "@/types/marketplace";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const POSTS_TABLE = 'posts';

/**
 * Saves a post to Supabase
 */
export const savePost = async (post: ExtendedPost): Promise<{ success: boolean, error?: any }> => {
  try {
    const { error } = await supabase
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
  try {
    const { data, error } = await supabase
      .from(POSTS_TABLE)
      .select('*')
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    return data as ExtendedPost[];
  } catch (error) {
    console.error('Error retrieving posts from Supabase:', error);
    return [];
  }
};

/**
 * Retrieves posts by a specific user from Supabase
 */
export const getUserPosts = async (userId: string): Promise<ExtendedPost[]> => {
  try {
    const { data, error } = await supabase
      .from(POSTS_TABLE)
      .select('*')
      .eq('userId', userId)
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    return data as ExtendedPost[];
  } catch (error) {
    console.error('Error retrieving user posts from Supabase:', error);
    return [];
  }
};

/**
 * Adds a new post to Supabase
 */
export const addPost = async (post: ExtendedPost): Promise<{ success: boolean, error?: any }> => {
  return await savePost(post);
};

/**
 * Updates an existing post in Supabase
 */
export const updatePost = async (updatedPost: ExtendedPost): Promise<{ success: boolean, error?: any }> => {
  try {
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


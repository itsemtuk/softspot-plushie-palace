
import { ExtendedPost } from "@/types/core";

const POSTS_STORAGE_KEY = 'userPosts';

export const getPosts = async (): Promise<ExtendedPost[]> => {
  try {
    const stored = localStorage.getItem(POSTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting posts from storage:', error);
    return [];
  }
};

export const savePost = async (post: ExtendedPost): Promise<{ success: boolean; error?: string }> => {
  try {
    const existingPosts = await getPosts();
    const updatedPosts = [post, ...existingPosts.filter(p => p.id !== post.id)];
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
    return { success: true };
  } catch (error) {
    console.error('Error saving post to storage:', error);
    return { success: false, error: 'Failed to save post' };
  }
};

export const deletePost = async (postId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const existingPosts = await getPosts();
    const updatedPosts = existingPosts.filter(post => post.id !== postId);
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
    return { success: true };
  } catch (error) {
    console.error('Error deleting post from storage:', error);
    return { success: false, error: 'Failed to delete post' };
  }
};

export const updatePost = async (postId: string, updates: Partial<ExtendedPost>): Promise<{ success: boolean; error?: string }> => {
  try {
    const existingPosts = await getPosts();
    const updatedPosts = existingPosts.map(post => 
      post.id === postId ? { ...post, ...updates, updatedAt: new Date().toISOString() } : post
    );
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
    return { success: true };
  } catch (error) {
    console.error('Error updating post in storage:', error);
    return { success: false, error: 'Failed to update post' };
  }
};

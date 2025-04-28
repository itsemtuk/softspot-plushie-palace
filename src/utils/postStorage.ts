
// Utility functions for post storage and retrieval
import { ExtendedPost } from "@/types/marketplace";

const POSTS_STORAGE_KEY = 'userPosts';

/**
 * Saves posts to local storage
 */
export const savePosts = (posts: ExtendedPost[]): void => {
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving posts to local storage:', error);
  }
};

/**
 * Retrieves posts from local storage
 */
export const getPosts = (): ExtendedPost[] => {
  try {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    return storedPosts ? JSON.parse(storedPosts) : [];
  } catch (error) {
    console.error('Error retrieving posts from local storage:', error);
    return [];
  }
};

/**
 * Adds a new post to storage
 */
export const addPost = (post: ExtendedPost): void => {
  const currentPosts = getPosts();
  savePosts([post, ...currentPosts]);
};

/**
 * Updates an existing post
 */
export const updatePost = (updatedPost: ExtendedPost): boolean => {
  const currentPosts = getPosts();
  const postIndex = currentPosts.findIndex(post => post.id === updatedPost.id);
  
  if (postIndex !== -1) {
    currentPosts[postIndex] = updatedPost;
    savePosts(currentPosts);
    return true;
  }
  return false;
};

/**
 * Deletes a post by ID
 */
export const deletePost = (postId: string): boolean => {
  const currentPosts = getPosts();
  const updatedPosts = currentPosts.filter(post => post.id !== postId);
  
  if (updatedPosts.length !== currentPosts.length) {
    savePosts(updatedPosts);
    return true;
  }
  return false;
};

/**
 * Toggle like on a post
 */
export const togglePostLike = (postId: string): { success: boolean, post?: ExtendedPost } => {
  const currentPosts = getPosts();
  const postIndex = currentPosts.findIndex(post => post.id === postId);
  
  if (postIndex !== -1) {
    const post = currentPosts[postIndex];
    const updatedPost = {
      ...post,
      likes: post.likes + 1
    };
    
    currentPosts[postIndex] = updatedPost;
    savePosts(currentPosts);
    
    return { success: true, post: updatedPost };
  }
  return { success: false };
};

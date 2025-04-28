
import { ExtendedPost } from "@/types/marketplace";

/**
 * Saves posts to local storage
 */
export const savePosts = (posts: ExtendedPost[]): void => {
  try {
    localStorage.setItem('userPosts', JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving posts to local storage:', error);
  }
};

/**
 * Retrieves posts from local storage
 */
export const getLocalPosts = (): ExtendedPost[] => {
  try {
    const storedPosts = localStorage.getItem('userPosts');
    const posts = storedPosts ? JSON.parse(storedPosts) : [];
    
    // Sort posts by timestamp (newest first)
    return posts.sort((a: ExtendedPost, b: ExtendedPost) => {
      const dateA = new Date(a.timestamp || 0).getTime();
      const dateB = new Date(b.timestamp || 0).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  } catch (error) {
    console.error('Error retrieving posts from local storage:', error);
    return [];
  }
};

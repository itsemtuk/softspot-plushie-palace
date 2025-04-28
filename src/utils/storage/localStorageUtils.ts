
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
    return storedPosts ? JSON.parse(storedPosts) : [];
  } catch (error) {
    console.error('Error retrieving posts from local storage:', error);
    return [];
  }
};


import { ExtendedPost } from "@/types/marketplace";

// Constants for storage keys
const POSTS_STORAGE_KEY = 'userPosts';
const MARKETPLACE_STORAGE_KEY = 'marketplaceListings';

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
export const getLocalPosts = (): ExtendedPost[] => {
  try {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
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

/**
 * Saves marketplace listings to local storage
 */
export const saveMarketplaceListings = (listings: any[]): void => {
  try {
    // Ensure userId is attached to each listing for sync purposes
    const userId = localStorage.getItem('currentUserId') || 'anonymous';
    const listingsWithUser = listings.map(listing => ({
      ...listing,
      userId: listing.userId || userId
    }));
    
    localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(listingsWithUser));
  } catch (error) {
    console.error('Error saving marketplace listings to local storage:', error);
  }
};

/**
 * Retrieves marketplace listings from local storage
 */
export const getMarketplaceListings = (): any[] => {
  try {
    const storedListings = localStorage.getItem(MARKETPLACE_STORAGE_KEY);
    const listings = storedListings ? JSON.parse(storedListings) : [];
    
    // Sort listings by timestamp (newest first)
    return listings.sort((a: any, b: any) => {
      const dateA = new Date(a.timestamp || 0).getTime();
      const dateB = new Date(b.timestamp || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error retrieving marketplace listings from local storage:', error);
    return [];
  }
};

/**
 * Sets the current user ID in local storage for syncing
 */
export const setCurrentUserId = (userId: string): void => {
  localStorage.setItem('currentUserId', userId);
};

/**
 * Gets the current user ID from local storage
 */
export const getCurrentUserId = (): string => {
  return localStorage.getItem('currentUserId') || 'anonymous';
};

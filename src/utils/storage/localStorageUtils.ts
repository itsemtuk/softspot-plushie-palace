
import { ExtendedPost, MarketplacePlushie } from "@/types/marketplace";

// Constants for storage keys
const POSTS_STORAGE_KEY = 'userPosts';
const MARKETPLACE_STORAGE_KEY = 'marketplaceListings';

/**
 * Saves posts to local storage
 */
export const savePosts = (posts: ExtendedPost[]): void => {
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    // Also store in sessionStorage for cross-tab syncing
    sessionStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving posts to local storage:', error);
  }
};

/**
 * Retrieves posts from local storage
 */
export const getLocalPosts = (): ExtendedPost[] => {
  try {
    // First check if there are newer posts in sessionStorage (from other tabs)
    const sessionPosts = sessionStorage.getItem(POSTS_STORAGE_KEY);
    const localPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    
    const storedPosts = sessionPosts || localPosts;
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
export const saveMarketplaceListings = (listings: MarketplacePlushie[]): void => {
  try {
    // Ensure userId is attached to each listing for sync purposes
    const userId = localStorage.getItem('currentUserId') || 'anonymous';
    const listingsWithUser = listings.map(listing => ({
      ...listing,
      userId: listing.userId || userId,
      timestamp: listing.timestamp || new Date().toISOString()
    }));
    
    localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(listingsWithUser));
    // Also store in sessionStorage for cross-tab syncing
    sessionStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(listingsWithUser));
  } catch (error) {
    console.error('Error saving marketplace listings to local storage:', error);
  }
};

/**
 * Retrieves marketplace listings from local storage
 */
export const getMarketplaceListings = (): MarketplacePlushie[] => {
  try {
    // First check if there are newer listings in sessionStorage (from other tabs)
    const sessionListings = sessionStorage.getItem(MARKETPLACE_STORAGE_KEY);
    const localListings = localStorage.getItem(MARKETPLACE_STORAGE_KEY);
    
    const storedListings = sessionListings || localListings;
    const listings = storedListings ? JSON.parse(storedListings) : [];
    
    // Sort listings by timestamp (newest first)
    return listings.sort((a: MarketplacePlushie, b: MarketplacePlushie) => {
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
  // Also store in sessionStorage for cross-tab syncing
  sessionStorage.setItem('currentUserId', userId);
};

/**
 * Gets the current user ID from local storage
 */
export const getCurrentUserId = (): string => {
  return localStorage.getItem('currentUserId') || sessionStorage.getItem('currentUserId') || 'anonymous';
};

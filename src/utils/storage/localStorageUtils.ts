
import { ExtendedPost, MarketplacePlushie } from "@/types/marketplace";

// Constants for storage keys
const POSTS_STORAGE_KEY = 'userPosts';
const MARKETPLACE_STORAGE_KEY = 'marketplaceListings';
const CURRENT_USER_KEY = 'currentUserId';
const USER_STATUS_KEY = 'userStatus';

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
    const userId = localStorage.getItem(CURRENT_USER_KEY) || 'anonymous';
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
  localStorage.setItem(CURRENT_USER_KEY, userId);
  // Also store in sessionStorage for cross-tab syncing
  sessionStorage.setItem(CURRENT_USER_KEY, userId);
};

/**
 * Gets the current user ID from local storage
 */
export const getCurrentUserId = (): string => {
  return localStorage.getItem(CURRENT_USER_KEY) || sessionStorage.getItem(CURRENT_USER_KEY) || 'anonymous';
};

/**
 * Sets the current user status in local storage
 */
export const setUserStatus = (status: "online" | "offline" | "away" | "busy"): void => {
  localStorage.setItem(USER_STATUS_KEY, status);
  sessionStorage.setItem(USER_STATUS_KEY, status);
};

/**
 * Gets the current user status from local storage
 */
export const getUserStatus = (): "online" | "offline" | "away" | "busy" => {
  return (localStorage.getItem(USER_STATUS_KEY) || 
          sessionStorage.getItem(USER_STATUS_KEY) || 
          'online') as "online" | "offline" | "away" | "busy";
};

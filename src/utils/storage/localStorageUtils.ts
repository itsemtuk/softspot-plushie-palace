
import { ExtendedPost, MarketplacePlushie } from "@/types/marketplace";

// Constants for storage keys
const POSTS_STORAGE_KEY = 'userPosts';
const MARKETPLACE_STORAGE_KEY = 'marketplaceListings';
const CURRENT_USER_KEY = 'currentUserId';
const USER_STATUS_KEY = 'userStatus';
const SYNC_TIMESTAMP_KEY = 'lastSyncTimestamp';

/**
 * Saves posts to local storage
 */
export const savePosts = (posts: ExtendedPost[]): void => {
  try {
    // Before saving, remove duplicates by ID
    const uniquePosts = removeDuplicatePosts(posts);
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(uniquePosts));
    // Also store in sessionStorage for cross-tab syncing
    sessionStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(uniquePosts));
    // Update sync timestamp
    updateSyncTimestamp();
  } catch (error) {
    console.error('Error saving posts to local storage:', error);
  }
};

/**
 * Updates the last sync timestamp
 */
export const updateSyncTimestamp = (): void => {
  const timestamp = new Date().toISOString();
  localStorage.setItem(SYNC_TIMESTAMP_KEY, timestamp);
  sessionStorage.setItem(SYNC_TIMESTAMP_KEY, timestamp);
};

/**
 * Gets the last sync timestamp
 */
export const getLastSyncTimestamp = (): string | null => {
  return localStorage.getItem(SYNC_TIMESTAMP_KEY) || sessionStorage.getItem(SYNC_TIMESTAMP_KEY);
};

/**
 * Removes duplicate posts by ID, keeping the most recent version
 */
const removeDuplicatePosts = (posts: ExtendedPost[]): ExtendedPost[] => {
  const postMap = new Map<string, ExtendedPost>();
  
  // Keep only the latest version of each post by ID
  posts.forEach(post => {
    if (!postMap.has(post.id) || 
        new Date(post.timestamp || 0) > new Date(postMap.get(post.id)!.timestamp || 0)) {
      postMap.set(post.id, post);
    }
  });
  
  return Array.from(postMap.values());
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
    
    // Remove duplicates before returning
    const uniquePosts = removeDuplicatePosts(posts);
    
    // Sort posts by timestamp (newest first)
    return uniquePosts.sort((a: ExtendedPost, b: ExtendedPost) => {
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
    
    // Remove any duplicates by ID
    const uniqueListings = removeDuplicateListings(listingsWithUser);
    
    localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(uniqueListings));
    // Also store in sessionStorage for cross-tab syncing
    sessionStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(uniqueListings));
  } catch (error) {
    console.error('Error saving marketplace listings to local storage:', error);
  }
};

/**
 * Removes duplicate listings by ID, keeping the most recent version
 */
const removeDuplicateListings = (listings: MarketplacePlushie[]): MarketplacePlushie[] => {
  const listingMap = new Map<string, MarketplacePlushie>();
  
  // Keep only the latest version of each listing by ID
  listings.forEach(listing => {
    if (!listingMap.has(listing.id) || 
        new Date(listing.timestamp || 0) > new Date(listingMap.get(listing.id)!.timestamp || 0)) {
      listingMap.set(listing.id, listing);
    }
  });
  
  return Array.from(listingMap.values());
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
    
    if (!storedListings) {
      console.log("No marketplace listings found in storage");
      return [];
    }
    
    let listings;
    try {
      listings = JSON.parse(storedListings);
    } catch (parseError) {
      console.error("Error parsing marketplace listings:", parseError);
      return [];
    }
    
    if (!Array.isArray(listings)) {
      console.error("Marketplace listings is not an array:", listings);
      return [];
    }
    
    // Remove duplicates before returning
    const uniqueListings = removeDuplicateListings(listings);
    
    // Sort listings by timestamp (newest first)
    return uniqueListings.sort((a: MarketplacePlushie, b: MarketplacePlushie) => {
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
  // Update sync timestamp when user changes
  updateSyncTimestamp();
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

/**
 * Cleans up duplicate posts and listings from storage
 */
export const cleanupStorage = (): void => {
  // Get all posts and save them back (which will remove duplicates)
  const posts = getLocalPosts();
  savePosts(posts);
  
  // Get all listings and save them back (which will remove duplicates)
  const listings = getMarketplaceListings();
  saveMarketplaceListings(listings);
  
  console.log("Storage cleanup completed");
};

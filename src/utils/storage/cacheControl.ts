
/**
 * Utilities for consistent cache control across environments
 */

// Cache control constants
const CACHE_VERSION_KEY = 'cacheVersion';
const SYNC_TIMESTAMP_KEY = 'lastSyncTimestamp';

// Current cache version - increment when making breaking changes to the cache structure
const CURRENT_CACHE_VERSION = '1.0.1';

/**
 * Initialize the cache control system
 */
export const initCacheControl = (forceClearCache = false) => {
  try {
    const storedVersion = localStorage.getItem(CACHE_VERSION_KEY);
    
    // Check if cache version has changed or force clear is requested
    if (storedVersion !== CURRENT_CACHE_VERSION || forceClearCache) {
      console.log(`Cache version changed or force clear requested. Old: ${storedVersion}, New: ${CURRENT_CACHE_VERSION}`);
      clearAllCaches();
      localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
    }
    
    // Set or update timestamp
    updateSyncTimestamp();
    
    return true;
  } catch (error) {
    console.error("Error initializing cache control:", error);
    return false;
  }
};

/**
 * Clear all caches, including localStorage and sessionStorage
 */
export const clearAllCaches = () => {
  try {
    // Make a list of keys to preserve
    const keysToPreserve = [
      'usingClerk', // Keep Clerk configuration
      'clerkLoaded', // Keep Clerk state
      'authStatus', // Keep auth status
      'currentUserId', // Keep user ID
      'currentUsername', // Keep username
    ];
    
    // Preserve important values
    const preservedValues = keysToPreserve.reduce((acc, key) => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    // Clear storages
    localStorage.clear();
    sessionStorage.clear();
    
    // Restore preserved values
    Object.entries(preservedValues).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    console.log("All caches cleared while preserving auth state");
    return true;
  } catch (error) {
    console.error("Error clearing caches:", error);
    return false;
  }
};

/**
 * Update the last sync timestamp
 */
export const updateSyncTimestamp = () => {
  const timestamp = new Date().toISOString();
  localStorage.setItem(SYNC_TIMESTAMP_KEY, timestamp);
  sessionStorage.setItem(SYNC_TIMESTAMP_KEY, timestamp);
};

/**
 * Get the last sync timestamp
 */
export const getLastSyncTimestamp = (): string | null => {
  return localStorage.getItem(SYNC_TIMESTAMP_KEY) || sessionStorage.getItem(SYNC_TIMESTAMP_KEY);
};

// Initialize cache control when this module is imported
initCacheControl();

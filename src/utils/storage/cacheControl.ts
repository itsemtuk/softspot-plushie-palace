
/**
 * Cache control utility to manage storage invalidation and synchronization
 */

const CACHE_VERSION_KEY = 'cacheVersion';
const CACHE_TIMESTAMP_KEY = 'lastSyncTimestamp';
const CURRENT_CACHE_VERSION = '1.0';

/**
 * Initializes the cache with the current version
 */
export const initializeCache = (): void => {
  try {
    const storedVersion = localStorage.getItem(CACHE_VERSION_KEY);
    
    // If there's a version mismatch or no version stored, clear cache
    if (storedVersion !== CURRENT_CACHE_VERSION) {
      console.log(`Cache version mismatch or not set. Clearing cache. Old: ${storedVersion}, New: ${CURRENT_CACHE_VERSION}`);
      clearAllCache();
      localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
    }
    
    // Always update the timestamp
    updateCacheTimestamp();
  } catch (error) {
    console.error("Error initializing cache:", error);
  }
};

/**
 * Updates the last sync timestamp
 */
export const updateCacheTimestamp = (): void => {
  const timestamp = new Date().toISOString();
  localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp);
  sessionStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp);
};

/**
 * Clears all cache data from localStorage and sessionStorage
 */
export const clearAllCache = (): void => {
  try {
    // Clear all data except the cache version itself
    const cacheVersion = localStorage.getItem(CACHE_VERSION_KEY);
    
    // Clear storages
    localStorage.clear();
    sessionStorage.clear();
    
    // Restore cache version
    if (cacheVersion) {
      localStorage.setItem(CACHE_VERSION_KEY, cacheVersion);
    }
    
    console.log("Cache cleared successfully");
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

/**
 * Checks if the cache is stale based on time threshold
 * @param hoursThreshold Number of hours before cache is considered stale
 */
export const isCacheStale = (hoursThreshold = 24): boolean => {
  try {
    const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!timestampStr) {
      return true;
    }
    
    const timestamp = new Date(timestampStr).getTime();
    const now = new Date().getTime();
    const hoursSinceUpdate = (now - timestamp) / (1000 * 60 * 60);
    
    return hoursSinceUpdate > hoursThreshold;
  } catch (error) {
    console.error("Error checking cache staleness:", error);
    return true; // If error, assume cache is stale
  }
};

/**
 * Clears cache if it's stale
 * @param hoursThreshold Number of hours before cache is cleared
 */
export const clearStaleCache = (hoursThreshold = 24): void => {
  if (isCacheStale(hoursThreshold)) {
    console.log(`Cache is stale (older than ${hoursThreshold} hours). Clearing.`);
    clearAllCache();
  }
};

// Initialize cache when the module is imported
initializeCache();

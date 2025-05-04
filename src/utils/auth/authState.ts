
/**
 * Centralized authentication state management
 * This ensures consistent auth state across the application
 */

// Constants for storage keys
const AUTH_STATUS_KEY = 'authStatus';
const USER_ID_KEY = 'currentUserId';
const USERNAME_KEY = 'currentUsername';
const USER_STATUS_KEY = 'userStatus';
const AUTH_VERSION_KEY = 'authVersion';
const AUTH_PROVIDER_KEY = 'authProvider';

// Current version of the auth storage schema
const CURRENT_AUTH_VERSION = '1.0.0';

/**
 * Initialize the authentication state
 */
export const initAuthState = () => {
  try {
    // Check version to handle schema migrations
    const storedVersion = localStorage.getItem(AUTH_VERSION_KEY) || '0';
    
    if (storedVersion !== CURRENT_AUTH_VERSION) {
      // Clear auth-related data if version mismatch
      clearAuthState();
      localStorage.setItem(AUTH_VERSION_KEY, CURRENT_AUTH_VERSION);
    }
    
    return isAuthenticated();
  } catch (error) {
    console.error("Error initializing auth state:", error);
    return false;
  }
};

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  try {
    const authStatus = localStorage.getItem(AUTH_STATUS_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);
    return authStatus === 'authenticated' && !!userId;
  } catch {
    return false;
  }
};

/**
 * Set authenticated user data
 */
export const setAuthenticatedUser = (data: {
  userId: string;
  username: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  provider?: 'email' | 'google' | 'apple' | 'facebook' | 'clerk';
}): void => {
  try {
    localStorage.setItem(AUTH_STATUS_KEY, 'authenticated');
    localStorage.setItem(USER_ID_KEY, data.userId);
    localStorage.setItem(USERNAME_KEY, data.username);
    
    if (data.status) {
      localStorage.setItem(USER_STATUS_KEY, data.status);
    } else {
      localStorage.setItem(USER_STATUS_KEY, 'online');
    }
    
    if (data.provider) {
      localStorage.setItem(AUTH_PROVIDER_KEY, data.provider);
    }
    
    // Also store in session storage for cross-tab syncing
    sessionStorage.setItem(AUTH_STATUS_KEY, 'authenticated');
    sessionStorage.setItem(USER_ID_KEY, data.userId);
    sessionStorage.setItem(USERNAME_KEY, data.username);
    
    // Dispatch storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: AUTH_STATUS_KEY,
      newValue: 'authenticated'
    }));
    
    console.log('User authenticated:', data.userId);
  } catch (error) {
    console.error('Error setting authenticated user:', error);
  }
};

/**
 * Clear authentication state
 */
export const clearAuthState = (): void => {
  try {
    localStorage.removeItem(AUTH_STATUS_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.setItem(USER_STATUS_KEY, 'offline');
    
    // Also clear from session storage
    sessionStorage.removeItem(AUTH_STATUS_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    
    // Dispatch storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: AUTH_STATUS_KEY,
      newValue: null
    }));
    
    console.log('Auth state cleared');
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
};

/**
 * Get current user information
 */
export const getCurrentUser = () => {
  try {
    if (!isAuthenticated()) {
      return null;
    }
    
    return {
      id: localStorage.getItem(USER_ID_KEY) || '',
      username: localStorage.getItem(USERNAME_KEY) || 'User',
      status: (localStorage.getItem(USER_STATUS_KEY) || 'online') as 'online' | 'offline' | 'away' | 'busy',
      provider: localStorage.getItem(AUTH_PROVIDER_KEY) || 'email'
    };
  } catch {
    return null;
  }
};

// Initialize auth state immediately
initAuthState();

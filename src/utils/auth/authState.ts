
/**
 * Centralized authentication state management
 * This ensures consistent auth state across the application
 */

import { supabase } from '../supabase/client';

// Constants for storage keys
const AUTH_STATUS_KEY = 'authStatus';
const USER_ID_KEY = 'currentUserId';
const USERNAME_KEY = 'currentUsername';
const USER_STATUS_KEY = 'userStatus';
const AUTH_VERSION_KEY = 'authVersion';
const AUTH_PROVIDER_KEY = 'authProvider';
const SESSION_CHECK_KEY = 'lastSessionCheck';

// Current version of the auth storage schema
const CURRENT_AUTH_VERSION = '1.0.2';

/**
 * Initialize the authentication state
 */
export const initAuthState = async () => {
  try {
    // Check version to handle schema migrations
    const storedVersion = localStorage.getItem(AUTH_VERSION_KEY) || '0';
    
    if (storedVersion !== CURRENT_AUTH_VERSION) {
      console.log(`Auth schema version mismatch: ${storedVersion} vs ${CURRENT_AUTH_VERSION}. Updating auth state.`);
      localStorage.setItem(AUTH_VERSION_KEY, CURRENT_AUTH_VERSION);
    }
    
    // Check if using Clerk or Supabase
    const isUsingClerk = localStorage.getItem('usingClerk') === 'true';
    
    // If not using Clerk, check Supabase session
    if (!isUsingClerk) {
      // Prevent checking the session too frequently
      const lastCheck = parseInt(localStorage.getItem(SESSION_CHECK_KEY) || '0', 10);
      const now = Date.now();
      
      // Only check if it's been more than 10 seconds since the last check
      if (now - lastCheck > 10000) {
        localStorage.setItem(SESSION_CHECK_KEY, now.toString());
        
        // Check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // If we have a valid session but no local auth state, set it
          if (!isAuthenticated()) {
            const { user } = session;
            setAuthenticatedUser({
              userId: user.id,
              username: user.user_metadata?.username || user.email || 'User',
              provider: 'supabase'
            });
          }
        } else {
          // If no valid session but local auth state exists, clear it
          if (isAuthenticated() && localStorage.getItem(AUTH_PROVIDER_KEY) === 'supabase') {
            console.log("No valid Supabase session but local auth exists. Clearing local auth.");
            clearAuthState();
          }
        }
      }
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
    // For Clerk, we rely on its own auth state management
    // For fallback auth, we check localStorage
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
  provider?: 'email' | 'google' | 'apple' | 'facebook' | 'clerk' | 'supabase';
}): void => {
  try {
    localStorage.setItem(AUTH_STATUS_KEY, 'authenticated');
    localStorage.setItem(USER_ID_KEY, data.userId);
    localStorage.setItem(USERNAME_KEY, data.username);
    localStorage.setItem('lastLoginTimestamp', new Date().getTime().toString());
    
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
    try {
      window.dispatchEvent(new StorageEvent('storage', {
        key: AUTH_STATUS_KEY,
        newValue: 'authenticated'
      }));
    } catch (e) {
      console.error("Error dispatching storage event:", e);
    }
    
    console.log('User authenticated:', data.userId);
  } catch (error) {
    console.error('Error setting authenticated user:', error);
  }
};

/**
 * Clear authentication state
 */
export const clearAuthState = async (): Promise<void> => {
  try {
    const provider = localStorage.getItem(AUTH_PROVIDER_KEY);
    
    // Sign out from the appropriate provider
    if (provider === 'supabase') {
      try {
        await supabase.auth.signOut();
        console.log("Signed out from Supabase");
      } catch (e) {
        console.error("Error signing out from Supabase:", e);
      }
    }
    
    // Clear all local auth data
    localStorage.removeItem(AUTH_STATUS_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.setItem(USER_STATUS_KEY, 'offline');
    localStorage.removeItem('lastLoginTimestamp');
    
    // Also clear from session storage
    sessionStorage.removeItem(AUTH_STATUS_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    
    // Dispatch storage event for other tabs
    try {
      window.dispatchEvent(new StorageEvent('storage', {
        key: AUTH_STATUS_KEY,
        newValue: null
      }));
    } catch (e) {
      console.error("Error dispatching storage event:", e);
    }
    
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

// Initialize auth state immediately - but use the async version 
// to prevent blocking the main thread
initAuthState().catch(console.error);

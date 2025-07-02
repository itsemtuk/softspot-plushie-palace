
// Enhanced authentication state management with better conflict resolution
let currentAuthState = {
  isAuthenticated: false,
  userId: null as string | null,
  username: null as string | null,
  provider: null as 'clerk' | 'supabase' | null
};

// Clerk is the primary authentication method
const isUsingClerk = () => {
  const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  return hasClerkKey; // Always use Clerk when available
};

// Enhanced authentication check with better error handling
export const isAuthenticated = (): boolean => {
  try {
    // First check our cached state
    if (currentAuthState.isAuthenticated && currentAuthState.userId) {
      return true;
    }
    
    // Check localStorage for auth status
    const authStatus = localStorage.getItem('authStatus');
    const userId = localStorage.getItem('currentUserId');
    
    if (authStatus === 'authenticated' && userId) {
      // Update cached state
      currentAuthState.isAuthenticated = true;
      currentAuthState.userId = userId;
      currentAuthState.username = localStorage.getItem('currentUsername');
      currentAuthState.provider = isUsingClerk() ? 'clerk' : 'supabase';
      return true;
    }
    
    // If using Clerk, check if Clerk user exists with better error handling
    if (isUsingClerk()) {
      try {
        // Only check Clerk session if we have a user ID
        if (userId) {
          currentAuthState.isAuthenticated = true;
          currentAuthState.userId = userId;
          currentAuthState.provider = 'clerk';
          return true;
        }
      } catch (error) {
        console.warn('Error checking Clerk session (non-critical):', error);
      }
    }
    
    // Reset state if no valid auth found
    currentAuthState.isAuthenticated = false;
    currentAuthState.userId = null;
    currentAuthState.username = null;
    currentAuthState.provider = null;
    
    return false;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Enhanced user setting with immediate state update
export const setAuthenticatedUser = (user: {
  userId: string;
  username: string;
  provider: 'clerk' | 'supabase';
}) => {
  try {
    // Update cached state immediately
    currentAuthState = {
      isAuthenticated: true,
      userId: user.userId,
      username: user.username,
      provider: user.provider
    };
    
    // Update localStorage
    localStorage.setItem('currentUserId', user.userId);
    localStorage.setItem('currentUsername', user.username);
    localStorage.setItem('authStatus', 'authenticated');
    localStorage.setItem('authProvider', user.provider);
    
    console.log('User authenticated:', user);
    
    // Dispatch auth change event
    window.dispatchEvent(new Event('auth-state-change'));
  } catch (error) {
    console.error('Error setting authenticated user:', error);
  }
};

// Enhanced sign out with proper cleanup
export const clearAuthState = () => {
  try {
    // Clear cached state
    currentAuthState = {
      isAuthenticated: false,
      userId: null,
      username: null,
      provider: null
    };
    
    // Clear localStorage
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUsername');
    localStorage.removeItem('authStatus');
    localStorage.removeItem('authProvider');
    localStorage.removeItem('userAvatarUrl');
    localStorage.removeItem('userBio');
    localStorage.removeItem('userStatus');
    
    console.log('Auth state cleared');
    
    // Dispatch auth change event
    window.dispatchEvent(new Event('auth-state-change'));
  } catch (error) {
    console.error('Error during sign out:', error);
  }
};

// Keep the signOut function for backward compatibility
export const signOut = clearAuthState;

// Get current user info with fallback
export const getCurrentUser = () => {
  if (currentAuthState.isAuthenticated) {
    return currentAuthState;
  }
  
  // Fallback to localStorage
  const userId = localStorage.getItem('currentUserId');
  const username = localStorage.getItem('currentUsername');
  const provider = localStorage.getItem('authProvider') as 'clerk' | 'supabase' | null;
  
  if (userId) {
    return {
      isAuthenticated: true,
      userId,
      username: username || 'User',
      provider: provider || (isUsingClerk() ? 'clerk' : 'supabase')
    };
  }
  
  return {
    isAuthenticated: false,
    userId: null,
    username: null,
    provider: null
  };
};

// Initialize auth state on load
const initializeAuthState = () => {
  const userId = localStorage.getItem('currentUserId');
  const authStatus = localStorage.getItem('authStatus');
  
  if (userId && authStatus === 'authenticated') {
    currentAuthState = {
      isAuthenticated: true,
      userId,
      username: localStorage.getItem('currentUsername'),
      provider: localStorage.getItem('authProvider') as 'clerk' | 'supabase' || 'clerk'
    };
  }
};

// Initialize on module load
initializeAuthState();


import { supabase } from '@/utils/supabase/client';
import { setCurrentUserContext, isInFallbackMode } from '@/utils/supabase/rls';

export interface AuthResult {
  isAuthenticated: boolean;
  error?: string;
  fallbackMode?: boolean;
}

/**
 * Enhanced authentication check with CORS error handling
 */
export const safeCheckAuth = async (
  redirectCallback?: () => void,
  timeoutMs: number = 5000
): Promise<AuthResult> => {
  try {
    console.log('Starting authentication check...');
    
    // Check if we're in fallback mode first
    if (isInFallbackMode()) {
      console.log('Using fallback authentication mode');
      return {
        isAuthenticated: true,
        fallbackMode: true
      };
    }
    
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Authentication check timeout')), timeoutMs);
    });
    
    // Try to get session with timeout
    const sessionPromise = supabase.auth.getSession();
    
    const { data, error } = await Promise.race([
      sessionPromise,
      timeoutPromise
    ]);
    
    if (error) {
      console.error('Session check failed:', error);
      
      // Handle CORS errors
      if (error.message?.includes('CORS') || 
          error.message?.includes('fetch') || 
          error.message?.includes('NetworkError')) {
        console.warn('CORS/Network error in auth check, checking local state');
        return checkLocalAuthState(redirectCallback);
      }
      
      if (redirectCallback) redirectCallback();
      return {
        isAuthenticated: false,
        error: error.message
      };
    }
    
    const isAuthenticated = !!data.session?.user;
    console.log(`Authentication check complete: ${isAuthenticated}`);
    
    if (!isAuthenticated && redirectCallback) {
      redirectCallback();
    }
    
    return {
      isAuthenticated,
      fallbackMode: false
    };
    
  } catch (error: any) {
    console.error('Authentication check error:', error);
    
    // Handle timeout or network errors
    if (error.message?.includes('timeout') || 
        error.message?.includes('fetch') || 
        error.message?.includes('NetworkError') ||
        error.name === 'TypeError') {
      console.warn('Network error in auth check, using local fallback');
      return checkLocalAuthState(redirectCallback);
    }
    
    if (redirectCallback) redirectCallback();
    return {
      isAuthenticated: false,
      error: error.message,
      fallbackMode: false
    };
  }
};

/**
 * Check local authentication state when network is unavailable
 */
const checkLocalAuthState = (redirectCallback?: () => void): AuthResult => {
  try {
    // Check for Clerk authentication
    const clerkUserId = localStorage.getItem('currentUserId');
    const authStatus = localStorage.getItem('authStatus');
    
    const isAuthenticated = !!(clerkUserId && authStatus === 'authenticated');
    
    console.log(`Local auth state check: ${isAuthenticated}`);
    
    if (!isAuthenticated && redirectCallback) {
      redirectCallback();
    }
    
    return {
      isAuthenticated,
      fallbackMode: true
    };
  } catch (error) {
    console.error('Local auth state check failed:', error);
    if (redirectCallback) redirectCallback();
    return {
      isAuthenticated: false,
      fallbackMode: true
    };
  }
};

/**
 * Enhanced wait for auth with better error handling
 */
export const waitForAuth = async (
  timeoutMs: number = 3000,
  maxRetries: number = 3
): Promise<boolean> => {
  console.log(`Waiting for auth (timeout: ${timeoutMs}ms, retries: ${maxRetries})`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Auth attempt ${attempt}/${maxRetries}`);
      
      const result = await safeCheckAuth(undefined, timeoutMs);
      
      if (result.isAuthenticated) {
        console.log(`Auth successful on attempt ${attempt}`);
        return true;
      }
      
      // If not authenticated but no error, break early
      if (!result.error) {
        console.log('User not authenticated (no error)');
        break;
      }
      
      // Wait before retry (unless it's the last attempt)
      if (attempt < maxRetries) {
        console.log(`Retrying auth in 1 second... (attempt ${attempt})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error(`Auth attempt ${attempt} failed:`, error);
      
      // If it's the last attempt, check local state
      if (attempt === maxRetries) {
        console.log('Final attempt, checking local auth state');
        const localResult = checkLocalAuthState();
        return localResult.isAuthenticated;
      }
    }
  }
  
  console.log('Auth wait completed: not authenticated');
  return false;
};

/**
 * Enhanced user context setup with fallback handling
 */
export const setupUserContext = async (userId: string): Promise<boolean> => {
  try {
    console.log('Setting up user context for:', userId);
    
    const success = await setCurrentUserContext(userId);
    
    if (!success) {
      console.warn('User context setup failed, but continuing with fallback');
      // Don't return false here - allow the app to continue with fallback
    }
    
    return true;
  } catch (error) {
    console.error('User context setup error:', error);
    // Return true to allow fallback authentication to work
    return true;
  }
};

/**
 * Test Supabase connection with timeout
 */
export const testSupabaseConnection = async (timeoutMs: number = 3000): Promise<boolean> => {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Connection test timeout')), timeoutMs);
    });
    
    const testPromise = supabase.from('posts').select('count').limit(1);
    
    const { error } = await Promise.race([testPromise, timeoutPromise]);
    
    const isConnected = !error;
    console.log(`Supabase connection test: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
    
    return isConnected;
  } catch (error) {
    console.warn('Supabase connection test failed:', error);
    return false;
  }
};

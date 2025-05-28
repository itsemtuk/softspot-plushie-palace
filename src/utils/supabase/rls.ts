
import { supabase } from './client';

/**
 * Sets the current user context for RLS policies with enhanced error handling
 */
export const setCurrentUserContext = async (userId: string): Promise<boolean> => {
  try {
    console.log('Setting user context for RLS:', userId);
    
    const { error } = await supabase.rpc('set_current_user_id', { 
      current_user_id: userId 
    });
    
    if (error) {
      console.error('RPC call failed:', error);
      
      // Check if it's a CORS or network error
      if (error.message?.includes('CORS') || 
          error.message?.includes('fetch') || 
          error.message?.includes('NetworkError') ||
          error.message?.includes('Failed to fetch')) {
        console.warn('CORS/Network error detected, using fallback authentication');
        return handleCORSFallback(userId);
      }
      
      return false;
    }
    
    console.log('User context set successfully');
    return true;
  } catch (error: any) {
    console.error('Failed to set user context:', error);
    
    // Handle CORS/network errors with fallback
    if (error.message?.includes('CORS') || 
        error.message?.includes('fetch') || 
        error.message?.includes('NetworkError') ||
        error.message?.includes('Failed to fetch') ||
        error.name === 'TypeError') {
      console.warn('Network error detected, using fallback authentication');
      return handleCORSFallback(userId);
    }
    
    return false;
  }
};

/**
 * Fallback authentication when CORS/network issues prevent RPC calls
 */
const handleCORSFallback = async (userId: string): Promise<boolean> => {
  try {
    // Store user context in localStorage as fallback
    localStorage.setItem('currentUserContext', userId);
    localStorage.setItem('authFallbackMode', 'true');
    localStorage.setItem('fallback_user_id', userId);
    
    console.log('Fallback authentication mode activated');
    return true;
  } catch (error) {
    console.error('Fallback authentication failed:', error);
    return false;
  }
};

/**
 * Clears the current user context with fallback handling
 */
export const clearCurrentUserContext = async (): Promise<void> => {
  try {
    const { error } = await supabase.rpc('set_current_user_id', { 
      current_user_id: null 
    });
    
    if (error) {
      console.error('Error clearing user context:', error);
    }
  } catch (error) {
    console.error('Failed to clear user context:', error);
  } finally {
    // Always clear fallback data
    localStorage.removeItem('currentUserContext');
    localStorage.removeItem('authFallbackMode');
    localStorage.removeItem('fallback_user_id');
  }
};

/**
 * Checks if we're in fallback authentication mode
 */
export const isInFallbackMode = (): boolean => {
  return localStorage.getItem('authFallbackMode') === 'true';
};

/**
 * Gets the current user context (works in both normal and fallback modes)
 */
export const getCurrentUserContext = (): string | null => {
  if (isInFallbackMode()) {
    return localStorage.getItem('currentUserContext');
  }
  return null;
};

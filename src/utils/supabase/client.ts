
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the provided credentials
const supabaseUrl = 'https://evsamjzmqzbynwkuzsm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c2FtanptcXpieW53a3VzenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzgwMTEsImV4cCI6MjA2MDQxNDAxMX0.rkYcUyq7tMf3om2doHkWt85bdAHinEceuH43Hwn1knw';

// Create and export the Supabase client with proper configuration options
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit'
  }
});

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase is not properly configured. Using local storage fallback.');
    return false;
  }
  return true;
};

// Helper function to handle common Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  // Check if it's a CORS error
  if (error.message && (
    error.message.includes('NetworkError') || 
    error.message.includes('Failed to fetch') ||
    error.message.includes('CORS')
  )) {
    console.warn('Possible CORS issue detected. Falling back to local storage.');
    return {
      isCORSError: true,
      message: 'Network error: Unable to connect to the database. Using local data instead.'
    };
  }
  
  return {
    isCORSError: false,
    message: error.message || 'An unknown error occurred'
  };
};

// Implement retry logic for network requests
export const fetchWithRetry = async <T>(
  fn: () => Promise<T>, 
  retries = 3, 
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (err: any) {
    if (retries > 0) {
      console.log(`Request failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(fn, retries - 1, delay * 1.5);
    }
    
    console.error('Request failed after multiple retries:', err);
    throw err;
  }
};

// Helper to safely execute Supabase queries with retries and error handling
export const safeQueryWithRetry = async <T>(
  queryFn: () => Promise<{data: T | null, error: any}>,
  fallbackData: T | null = null
): Promise<{data: T | null, error: any}> => {
  try {
    // First try with retries
    return await fetchWithRetry(queryFn);
  } catch (error: any) {
    // Handle error and provide fallback
    const handledError = handleSupabaseError(error);
    
    return {
      data: fallbackData,
      error: handledError
    };
  }
};

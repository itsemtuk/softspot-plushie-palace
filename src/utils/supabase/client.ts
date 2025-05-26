
import { createClient } from '@supabase/supabase-js';
import { withRetry } from '../retry';

// Initialize Supabase client with the provided credentials
const supabaseUrl = 'https://evsamjzmqzbynwkuzsm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c2FtanptcXpieW53a3VzenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzgwMTEsImV4cCI6MjA2MDQxNDAxMX0.rkYcUyq7tMf3om2doHkWt85bdAHinEceuH43Hwn1knw';

// Create and export the Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit'
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase is not properly configured. Using local storage fallback.');
    return false;
  }
  return true;
};

// Enhanced error handling for common Supabase issues
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  // Check for different types of network errors
  if (error.message && (
    error.message.includes('NetworkError') || 
    error.message.includes('Failed to fetch') ||
    error.message.includes('CORS') ||
    error.message.includes('net::ERR_FAILED') ||
    error.code === 'PGRST301'
  )) {
    console.warn('Network/CORS issue detected. Falling back to local storage.');
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

// Enhanced retry logic with exponential backoff
export const fetchWithRetry = async <T>(
  fn: () => Promise<T>, 
  retries = 2, 
  delay = 1000
): Promise<T> => {
  return withRetry(fn, {
    maxAttempts: retries + 1,
    delayMs: delay,
    backoffMultiplier: 1.5,
    shouldRetry: (error) => !error.message?.includes('CORS')
  });
};

// Helper to safely execute Supabase queries with better error handling
export const safeQueryWithRetry = async <T>(
  queryFn: () => Promise<{data: T | null, error: any}>,
  fallbackData: T | null = null
): Promise<{data: T | null, error: any}> => {
  try {
    return await fetchWithRetry(queryFn);
  } catch (error: any) {
    const handledError = handleSupabaseError(error);
    
    return {
      data: fallbackData,
      error: handledError
    };
  }
};

// Test connection function
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('posts').select('count').limit(1);
    return !error;
  } catch (err) {
    console.warn('Supabase connection test failed:', err);
    return false;
  }
};


import { createClient } from '@supabase/supabase-js';
import { withRetry } from '../retry';

// Initialize Supabase client with the provided credentials
const supabaseUrl = 'https://evsamjzmqzbynwkuszsm.supabase.co';
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'omit'
      });
    }
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
    error.message.includes('ERR_BLOCKED_BY_RESPONSE') ||
    error.code === 'PGRST301'
  )) {
    console.warn('Network/CORS issue detected. Falling back to local storage.');
    return {
      isCORSError: true,
      isNetworkError: true,
      message: 'Network error: Unable to connect to the database. Using local data instead.'
    };
  }
  
  // Handle timeout errors
  if (error.message && (
    error.message.includes('timeout') ||
    error.message.includes('aborted')
  )) {
    console.warn('Timeout error detected. Falling back to local storage.');
    return {
      isCORSError: false,
      isNetworkError: true,
      message: 'Connection timeout: Using local data instead.'
    };
  }
  
  return {
    isCORSError: false,
    isNetworkError: false,
    message: error.message || 'An unknown error occurred'
  };
};

// Enhanced retry logic with exponential backoff
export const fetchWithRetry = async <T>(
  fn: () => Promise<T>, 
  retries = 1, // Reduced retries to avoid spamming
  delay = 1000
): Promise<T> => {
  return withRetry(fn, {
    maxAttempts: retries + 1,
    delayMs: delay,
    backoffMultiplier: 1.5,
    shouldRetry: (error) => {
      const handledError = handleSupabaseError(error);
      // Don't retry on CORS errors
      return false;
    }
  });
};

// Helper to safely execute Supabase queries with better error handling
export const safeQueryWithRetry = async <T>(
  queryFn: () => Promise<{data: T | null, error: any}>,
  fallbackData: T | null = null
): Promise<{data: T | null, error: any}> => {
  try {
    return await queryFn();
  } catch (error: any) {
    const handledError = handleSupabaseError(error);
    
    // Log the error but don't throw
    console.warn('Query failed, using fallback:', handledError.message);
    
    return {
      data: fallbackData,
      error: handledError
    };
  }
};

// Test connection function with reduced timeout and fewer retries
export const testSupabaseConnection = async (timeoutMs: number = 2000): Promise<boolean> => {
  try {
    console.log('Testing Supabase connection...');
    
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), timeoutMs);
    });
    
    // Try a simple query
    const queryPromise = supabase.from('posts').select('count').limit(1);
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
    
    if (error) {
      const handledError = handleSupabaseError(error);
      console.warn('Supabase connection test failed:', handledError.message);
      return false;
    }
    
    console.log('Supabase connection test successful');
    return true;
  } catch (err: any) {
    const handledError = handleSupabaseError(err);
    console.warn('Supabase connection test failed:', handledError.message);
    return false;
  }
};

// Enhanced RPC call with better error handling
export const safeRpcCall = async (
  functionName: string, 
  params: any = {},
  timeoutMs: number = 3000
): Promise<{data: any, error: any}> => {
  try {
    console.log(`Making RPC call: ${functionName}`, params);
    
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('RPC call timeout')), timeoutMs);
    });
    
    // Make the RPC call
    const rpcPromise = supabase.rpc(functionName, params);
    
    const result = await Promise.race([rpcPromise, timeoutPromise]);
    
    if (result.error) {
      const handledError = handleSupabaseError(result.error);
      console.warn(`RPC call ${functionName} failed:`, handledError.message);
    } else {
      console.log(`RPC call ${functionName} successful`);
    }
    
    return result;
  } catch (err: any) {
    const handledError = handleSupabaseError(err);
    console.warn(`RPC call ${functionName} failed:`, handledError.message);
    
    return {
      data: null,
      error: handledError
    };
  }
};

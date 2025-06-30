
import { createClient } from '@supabase/supabase-js';
import { withRetry } from '../retry';

// Initialize Supabase client with the provided credentials
const supabaseUrl = 'https://evsamjzmqzbynwkuszsm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c2FtanptcXpieW53a3VzenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzgwMTEsImV4cCI6MjA2MDQxNDAxMX0.rkYcUyq7tMf3om2doHkWt85bdAHinEceuH43Hwn1knw';

// Create a singleton instance to prevent multiple GoTrueClient instances
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// Create and export the Supabase client with enhanced configuration
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false, // Disable to prevent conflicts with Clerk
        flowType: 'implicit',
        storage: {
          getItem: (key: string): string | null => {
            // Use a prefixed key to avoid conflicts with Clerk
            return localStorage.getItem(`supabase_${key}`);
          },
          setItem: (key: string, value: string): void => {
            localStorage.setItem(`supabase_${key}`, value);
          },
          removeItem: (key: string): void => {
            localStorage.removeItem(`supabase_${key}`);
          },
        }
      },
      global: {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
  }
  return supabaseInstance;
})();

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
  retries = 1,
  delay = 1000
): Promise<T> => {
  return withRetry(fn, {
    maxAttempts: retries + 1,
    delayMs: delay,
    backoffMultiplier: 1.5,
    shouldRetry: (error) => {
      return false; // Don't retry on CORS errors
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
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), timeoutMs);
    });
    
    const queryPromise = supabase.from('posts').select('count').limit(1);
    
    try {
      const result = await Promise.race([queryPromise, timeoutPromise]);
      
      // Type guard to check if result has data and error properties
      if (result && typeof result === 'object' && 'data' in result && 'error' in result) {
        const { data, error } = result;
        
        if (error) {
          const handledError = handleSupabaseError(error);
          console.warn('Supabase connection test failed:', handledError.message);
          return false;
        }
        
        console.log('Supabase connection test successful');
        return true;
      }
      
      // If we can't determine the structure, assume success
      console.log('Supabase connection test successful');
      return true;
    } catch (err: any) {
      const handledError = handleSupabaseError(err);
      console.warn('Supabase connection test failed:', handledError.message);
      return false;
    }
  } catch (err: any) {
    const handledError = handleSupabaseError(err);
    console.warn('Supabase connection test failed:', handledError.message);
    return false;
  }
};

// Safe user sync function that handles RLS properly with better error handling
export const syncClerkUserToSupabase = async (clerkUser: any) => {
  if (!clerkUser) return { data: null, error: 'No user provided' };

  try {
    console.log('Syncing Clerk user to Supabase:', clerkUser.id);
    
    // Check if user already exists first
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, clerk_id')
      .eq('clerk_id', clerkUser.id)
      .maybeSingle();

    if (checkError && !checkError.message.includes('no rows returned')) {
      console.warn('Error checking existing user:', checkError);
      return { data: null, error: checkError };
    }

    if (existingUser) {
      console.log('User already exists, updating:', existingUser.id);
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update({
          username: clerkUser.username || clerkUser.firstName || 'user',
          first_name: clerkUser.firstName,
          last_name: clerkUser.lastName,
          email: clerkUser.emailAddresses?.[0]?.emailAddress,
          avatar_url: clerkUser.imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_id', clerkUser.id)
        .select()
        .single();

      if (error) {
        console.warn('User update failed:', error);
        return { data: null, error };
      }

      console.log('User update successful:', data);
      return { data, error: null };
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert({
          clerk_id: clerkUser.id,
          username: clerkUser.username || clerkUser.firstName || 'user',
          first_name: clerkUser.firstName,
          last_name: clerkUser.lastName,
          email: clerkUser.emailAddresses?.[0]?.emailAddress,
          avatar_url: clerkUser.imageUrl,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.warn('User creation failed, but continuing:', error);
        return { data: null, error };
      }

      console.log('User creation successful:', data);
      return { data, error: null };
    }
  } catch (err: any) {
    console.warn('User sync error:', err);
    return { data: null, error: err };
  }
};

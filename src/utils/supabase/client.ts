
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
    // Add CORS headers via fetch options
    flowType: 'implicit'
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
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

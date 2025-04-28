
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have the required Supabase credentials
const hasValidSupabaseConfig = supabaseUrl !== 'https://your-project-url.supabase.co' && supabaseKey !== '';

// Create Supabase client only if we have valid credentials
export const supabase = hasValidSupabaseConfig 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseConfigured = () => {
  if (!hasValidSupabaseConfig) {
    console.warn('Supabase is not properly configured. Using local storage fallback.');
    return false;
  }
  return true;
};

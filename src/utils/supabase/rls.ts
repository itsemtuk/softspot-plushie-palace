
import { supabase } from './client';

/**
 * Sets the current user context for RLS policies
 */
export const setCurrentUserContext = async (userId: string) => {
  try {
    const { error } = await supabase.rpc('set_current_user_id', { 
      user_id_param: userId 
    });
    
    if (error) {
      console.error('Error setting user context:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to set user context:', error);
    return false;
  }
};

/**
 * Clears the current user context
 */
export const clearCurrentUserContext = async () => {
  try {
    const { error } = await supabase.rpc('set_current_user_id', { 
      user_id_param: null 
    });
    
    if (error) {
      console.error('Error clearing user context:', error);
    }
  } catch (error) {
    console.error('Failed to clear user context:', error);
  }
};

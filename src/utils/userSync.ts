import { supabase, createAuthenticatedSupabaseClient } from "@/integrations/supabase/client";
import type { UserResource } from "@clerk/types";

export interface UserSyncResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export const syncUserProfile = async (clerkUser: UserResource, token?: string): Promise<UserSyncResult> => {
  try {
    const client = token ? createAuthenticatedSupabaseClient(token) : supabase;

    // First check if user already exists
    const { data: existingUser, error: checkError } = await client
      .from('users')
      .select('id, username, first_name, last_name, email, avatar_url')
      .eq('clerk_id', clerkUser.id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing user:', checkError);
      return { success: false, error: checkError.message };
    }

    const userData = {
      clerk_id: clerkUser.id,
      username: clerkUser.username || clerkUser.firstName || 'user',
      first_name: clerkUser.firstName,
      last_name: clerkUser.lastName,
      email: clerkUser.emailAddresses?.[0]?.emailAddress,
      avatar_url: clerkUser.imageUrl,
      updated_at: new Date().toISOString()
    };

    if (existingUser) {
      // Update existing user
      const { data, error } = await client
        .from('users')
        .update(userData)
        .eq('id', existingUser.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        return { success: false, error: error.message };
      }

      return { success: true, userId: data.id };
    } else {
      // Create new user
      const { data, error } = await client
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return { success: false, error: error.message };
      }

      // Create default profile
      await client
        .from('profiles')
        .insert([{
          user_uuid: data.id,
          bio: '',
          is_private: false,
          hide_from_search: false,
          show_activity_status: true,
          show_collection: true,
          show_wishlist: true,
          favorite_brands: [],
          favorite_types: []
        }]);

      return { success: true, userId: data.id };
    }
  } catch (error) {
    console.error('Unexpected error in user sync:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

export const getSupabaseUserId = async (clerkUserId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single();

    if (error || !data) {
      console.warn('Could not find Supabase user for Clerk ID:', clerkUserId);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error getting Supabase user ID:', error);
    return null;
  }
};
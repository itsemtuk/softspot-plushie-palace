import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface ProfileData {
  full_name?: string;
  phone_number?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  bio?: string;
  website?: string;
  location?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  is_private?: boolean;
  hide_from_search?: boolean;
  show_activity_status?: boolean;
  show_collection?: boolean;
  show_wishlist?: boolean;
  receive_email_updates?: boolean;
  receive_marketing_emails?: boolean;
  receive_wishlist_alerts?: boolean;
  new_release_alerts?: boolean;
  favorite_brands?: string[];
  favorite_types?: string[];
}

export const useSupabaseProfile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userSyncError, setUserSyncError] = useState<string | null>(null);

  // Get Supabase user ID from users table, with retry for sync
  const getSupabaseUserId = async (clerkId: string, retryCount = 0) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error getting Supabase user ID:', error);
        return null;
      }

      if (!data && retryCount < 3) {
        // User not found, try to sync from Clerk using the safe function
        console.log('User not found in Supabase, attempting sync...');
        await syncClerkUser(clerkId);
        
        // Retry after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getSupabaseUserId(clerkId, retryCount + 1);
      }
      
      return data?.id || null;
    } catch (error) {
      console.error('Error in getSupabaseUserId:', error);
      return null;
    }
  };

  // Sync Clerk user to Supabase users table using the safe RPC function
  const syncClerkUser = async (clerkId: string) => {
    if (!user) return;

    try {
      const userData = {
        clerk_id: clerkId,
        email: user.emailAddresses?.[0]?.emailAddress || null,
        first_name: user.firstName || null,
        last_name: user.lastName || null,
        username: user.username || user.firstName || 'User',
        avatar_url: user.imageUrl || null
      };

      // Try to create user with service role bypass using rpc
      const { data: newUser, error: createError } = await supabase.rpc('create_user_safe', {
        user_data: userData
      });

      if (createError) {
        console.error('RPC create user failed:', createError);
        
        // Check if it's a duplicate key error (user already exists)
        if (createError.code === '23505' || createError.message?.includes('duplicate key')) {
          console.log('User already exists during sync - this is expected');
          return; // This is success, user already exists
        }
        
        // For other errors, try to check if user exists anyway
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', clerkId)
          .maybeSingle();
          
        if (!existingUser) {
          throw new Error('User creation failed and user not found');
        }
      } else {
        // Add null checks for TypeScript
        if (newUser && Array.isArray(newUser) && newUser.length > 0 && newUser[0]?.id) {
          console.log('Created user via RPC:', newUser[0].id);
        } else {
          console.log('User creation returned empty result - user may already exist');
        }
      }
    } catch (error) {
      console.error('Failed to sync Clerk user:', error);
      throw error;
    }
  };

  // Load profile data
  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setUserSyncError(null);
      
      const supabaseUserId = await getSupabaseUserId(user.id);
      
      if (!supabaseUserId) {
        setUserSyncError('Unable to sync your account. Please try refreshing the page.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_uuid', supabaseUserId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create initial profile if it doesn't exist
        const newProfile = { 
          user_uuid: supabaseUserId,
          user_id: 1 // Temporary value, will be auto-generated
        };
        const { data: created, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          setProfile(created);
        }
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
      setUserSyncError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  // Save profile data
  const saveProfile = async (updates: ProfileData) => {
    if (!user) return false;
    
    try {
      setSaving(true);
      const supabaseUserId = await getSupabaseUserId(user.id);
      
      if (!supabaseUserId) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Unable to save profile. User sync required.'
        });
        return false;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_uuid', supabaseUserId)
        .select()
        .single();

      if (error) {
        console.error('Error saving profile:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to save profile changes.'
        });
        return false;
      }

      setProfile(data);
      toast({
        title: 'Success',
        description: 'Profile updated successfully!'
      });
      return true;
    } catch (error) {
      console.error('Error in saveProfile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.'
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  return {
    profile,
    loading,
    saving,
    userSyncError,
    saveProfile,
    refreshProfile: loadProfile
  };
};

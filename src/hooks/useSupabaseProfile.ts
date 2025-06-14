
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

  // Get Supabase user ID from users table
  const getSupabaseUserId = async (clerkId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single();
    
    if (error) {
      console.error('Error getting Supabase user ID:', error);
      return null;
    }
    
    return data?.id;
  };

  // Load profile data
  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const supabaseUserId = await getSupabaseUserId(user.id);
      
      if (!supabaseUserId) {
        console.warn('No Supabase user ID found');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUserId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create initial profile if it doesn't exist - need to provide user_uuid
        const newProfile = { 
          user_id: parseInt(supabaseUserId), // Convert to number for user_id
          user_uuid: supabaseUserId // Also set user_uuid as string
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
        console.error('No Supabase user ID found');
        return false;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', parseInt(supabaseUserId)) // Convert to number for comparison
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
    saveProfile,
    refreshProfile: loadProfile
  };
};

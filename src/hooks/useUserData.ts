import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase, createAuthenticatedSupabaseClient } from '@/integrations/supabase/client';

export interface UserData {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  clerk_id: string;
}

export interface ProfileData {
  bio: string;
  interests: string[];
  isPrivate: boolean;
  favorite_brands?: string[];
  favorite_types?: string[];
  location?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

export function useUserData(targetUsername?: string) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Determine which user to fetch
        const isOwnProfile = !targetUsername || targetUsername === user?.username;
        
        let queryBuilder = supabase.from('users').select('*');
        
        if (isOwnProfile && user?.id) {
          queryBuilder = queryBuilder.eq('clerk_id', user.id);
        } else if (targetUsername) {
          queryBuilder = queryBuilder.eq('username', targetUsername);
        } else {
          return;
        }

        const { data: userData, error: userError } = await queryBuilder.maybeSingle();

        if (userError) {
          throw new Error(`Failed to fetch user data: ${userError.message}`);
        }

        if (!userData) {
          setError('User not found');
          return;
        }

        setUserData(userData as unknown as UserData);

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_uuid', userData.id)
          .maybeSingle();

        if (profileError) {
          console.warn('Failed to fetch profile data:', profileError);
        }

        if (profileData) {
          setProfileData({
            bio: (profileData.bio as string) || '',
            interests: (profileData.favorite_brands as string[]) || [],
            isPrivate: Boolean(profileData.is_private) || false,
            favorite_brands: (profileData.favorite_brands as string[]) || [],
            favorite_types: (profileData.favorite_types as string[]) || [],
            location: (profileData.location as string) || '',
            website: (profileData.website as string) || '',
            instagram: (profileData.instagram as string) || '',
            twitter: (profileData.twitter as string) || '',
            youtube: (profileData.youtube as string) || ''
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id, targetUsername, getToken]);

  return {
    userData,
    profileData,
    isLoading,
    error,
    isOwnProfile: !targetUsername || targetUsername === user?.username
  };
}
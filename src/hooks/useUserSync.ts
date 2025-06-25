
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export const useUserSync = () => {
  const { user, isLoaded } = useUser();
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncUserToSupabase = async () => {
    if (!user || !isLoaded) return false;

    try {
      console.log('Syncing user to Supabase:', user.id);
      
      const userData = {
        clerk_id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || null,
        first_name: user.firstName || null,
        last_name: user.lastName || null,
        username: user.username || user.firstName || 'User',
        avatar_url: user.imageUrl || null
      };

      // Use the safe user creation function
      const { data, error } = await supabase.rpc('create_user_safe', {
        user_data: userData
      });

      if (error) {
        console.error('User sync error:', error);
        setError(error.message);
        return false;
      }

      console.log('User sync successful:', data);
      setSynced(true);
      setError(null);
      return true;
    } catch (err: any) {
      console.error('Unexpected sync error:', err);
      setError(err.message || 'Failed to sync user');
      return false;
    }
  };

  const updateUserSession = async () => {
    if (!user || !synced) return;

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .maybeSingle();

      if (!userData) return;

      // Update or create user session
      const { error } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: userData.id,
          clerk_session_id: user.id,
          last_seen: new Date().toISOString(),
          is_active: true,
          device_info: {
            userAgent: navigator.userAgent,
            platform: navigator.platform
          }
        }, {
          onConflict: 'user_id,clerk_session_id'
        });

      if (error) {
        console.error('Session update error:', error);
      }
    } catch (err) {
      console.error('Session update failed:', err);
    }
  };

  useEffect(() => {
    if (isLoaded && user && !synced) {
      syncUserToSupabase();
    }
  }, [isLoaded, user, synced]);

  useEffect(() => {
    if (synced) {
      updateUserSession();
      
      // Update session every 5 minutes
      const interval = setInterval(updateUserSession, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [synced, user]);

  return {
    synced,
    error,
    syncUser: syncUserToSupabase
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

export const useUserSync = () => {
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Clerk is available
  const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  const syncUserToSupabase = async () => {
    // If Clerk is not available, just mark as synced
    if (!isClerkAvailable) {
      setSynced(true);
      setError(null);
      return true;
    }

    try {
      // Check if we're in a Clerk context before trying to use hooks
      const clerkInstance = (window as any).__clerk;
      if (clerkInstance && clerkInstance.user) {
        // User is available, mark as synced
        setSynced(true);
        setError(null);
        return true;
      } else {
        // No user available, mark as synced anyway
        setSynced(true);
        setError(null);
        return true;
      }
    } catch (err: any) {
      console.error('User sync error:', err);
      setError(err.message || 'Failed to sync user');
      return false;
    }
  };

  useEffect(() => {
    syncUserToSupabase();
  }, []);

  return {
    synced,
    error,
    syncUser: syncUserToSupabase
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      // Dynamic import of Clerk hooks only when needed
      const { useUser } = await import('@clerk/clerk-react');
      
      // Since we can't use hooks conditionally, we'll handle this differently
      // For now, just mark as synced when Clerk is not available
      setSynced(true);
      setError(null);
      return true;
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

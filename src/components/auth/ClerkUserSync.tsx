import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { syncClerkUserToSupabase } from '@/utils/supabase/client';
import { setAuthenticatedUser } from '@/utils/auth/authState';

export const ClerkUserSync = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user to Supabase and update auth state
      const syncUser = async () => {
        try {
          await syncClerkUserToSupabase(user);
          
          // Update centralized auth state
          setAuthenticatedUser({
            userId: user.id,
            username: user.username || user.firstName || 'User',
            provider: 'clerk'
          });

          // Store user info for components that can't access Clerk context
          localStorage.setItem('userAvatarUrl', user.imageUrl || '');
          localStorage.setItem('currentUserId', user.id);
          localStorage.setItem('authStatus', 'authenticated');
          localStorage.setItem('currentUsername', user.username || user.firstName || 'User');
          
          // Dispatch auth change event
          window.dispatchEvent(new Event('clerk-auth-change'));
        } catch (error) {
          console.warn('User sync failed (non-critical):', error);
        }
      };

      syncUser();
    } else if (isLoaded && !user) {
      // User signed out
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('authStatus');
      localStorage.removeItem('currentUsername');
      localStorage.removeItem('userAvatarUrl');
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('clerk-auth-change'));
    }
  }, [user, isLoaded]);

  return null; // This component doesn't render anything
};
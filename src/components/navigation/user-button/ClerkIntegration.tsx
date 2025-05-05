
import { useUser, useClerk } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useClerkSync } from '@/hooks/useClerkSync';

export const ClerkButtonComponent = () => {
  // Safely access Clerk hooks
  let userValue;
  let clerkValue;
  let clerkSyncValue;
  
  try {
    // These hooks will throw an error if used outside ClerkProvider
    userValue = useUser();
    clerkValue = useClerk();
    clerkSyncValue = useClerkSync();
    
    // If we successfully get the hooks, store their values in localStorage for components
    // that don't have direct access to Clerk context
    useEffect(() => {
      if (userValue?.user && userValue.isSignedIn) {
        // Store basic user info for components that can't access Clerk context
        localStorage.setItem('userAvatarUrl', userValue.user.imageUrl || '');
        localStorage.setItem('currentUserId', userValue.user.id);
        localStorage.setItem('authStatus', 'authenticated');
        
        // Dispatch event to notify components of auth state change
        window.dispatchEvent(new Event('clerk-auth-change'));
      }
    }, [userValue?.user, userValue?.isSignedIn]);
  } catch (error) {
    // Silently handle the error when used outside ClerkProvider
    console.warn("ClerkButtonComponent: Error accessing Clerk hooks outside ClerkProvider", error);
  }
  
  // This component doesn't render anything visible
  return null;
};

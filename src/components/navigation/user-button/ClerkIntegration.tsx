
import { useUser, useClerk } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useClerkSync } from '@/hooks/useClerkSync';
import { toast } from '@/components/ui/use-toast';

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
    
    // Debug Clerk status on load
    useEffect(() => {
      console.log("ClerkButtonComponent mounted: ", {
        isLoaded: userValue?.isLoaded,
        isSignedIn: userValue?.isSignedIn,
        user: userValue?.user?.id
      });
    }, []);
    
    // If we successfully get the hooks, store their values in localStorage for components
    // that don't have direct access to Clerk context
    useEffect(() => {
      if (userValue?.user && userValue.isSignedIn) {
        console.log("Clerk user signed in:", userValue.user);
        
        // Store basic user info for components that can't access Clerk context
        localStorage.setItem('userAvatarUrl', userValue.user.imageUrl || '');
        localStorage.setItem('currentUserId', userValue.user.id);
        localStorage.setItem('authStatus', 'authenticated');
        localStorage.setItem('currentUsername', userValue.user.username || userValue.user.firstName || 'User');
        
        // Notify user of successful sign-in if this is a new session
        const lastNotifiedSignIn = localStorage.getItem('lastNotifiedSignIn');
        const currentTime = new Date().getTime();
        if (!lastNotifiedSignIn || (currentTime - parseInt(lastNotifiedSignIn)) > 300000) { // 5 minutes
          toast({
            title: "Signed in successfully",
            description: `Welcome back, ${userValue.user.firstName || userValue.user.username || 'User'}!`
          });
          localStorage.setItem('lastNotifiedSignIn', currentTime.toString());
        }
        
        // Dispatch event to notify components of auth state change
        window.dispatchEvent(new Event('clerk-auth-change'));
      } else if (userValue?.isLoaded && !userValue?.isSignedIn) {
        // Handle sign-out or unauthenticated state
        console.log("User not signed in with Clerk");
      }
    }, [userValue?.user, userValue?.isSignedIn, userValue?.isLoaded]);
    
    // Debug Clerk state changes
    useEffect(() => {
      console.log("Clerk authentication state changed:", {
        isLoaded: userValue?.isLoaded,
        isSignedIn: userValue?.isSignedIn,
        user: userValue?.user ? {
          id: userValue.user.id,
          firstName: userValue.user.firstName,
          username: userValue.user.username,
          imageUrl: userValue.user.imageUrl
        } : null
      });
    }, [userValue?.isLoaded, userValue?.isSignedIn, userValue?.user]);
    
    // Handle social auth redirects and sign-in events
    useEffect(() => {
      // Check if we're returning from a social auth redirect
      const isAuthCallback = 
        window.location.href.includes('__clerk_status=') || 
        window.location.href.includes('/sign-up') ||
        window.location.href.includes('/sign-in');
      
      if (isAuthCallback) {
        console.log("Detected auth callback in URL");
      }
    }, []);
    
  } catch (error) {
    // Silently handle the error when used outside ClerkProvider
    console.warn("ClerkButtonComponent: Error accessing Clerk hooks outside ClerkProvider", error);
  }
  
  // This component doesn't render anything visible
  return null;
};

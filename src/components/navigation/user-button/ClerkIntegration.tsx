
import { useUser, useClerk } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useClerkSync } from '@/hooks/useClerkSync';
import { useToast } from '@/components/ui/use-toast';
import { setAuthenticatedUser } from '@/utils/auth/authState';
import { getUserStatus, setUserStatus } from '@/utils/storage/localStorageUtils';

export const ClerkButtonComponent = () => {
  // Safely access Clerk hooks
  let userValue;
  let clerkValue;
  let clerkSyncValue;
  const { toast } = useToast();
  
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
      
      // Mark that we're using Clerk for authentication
      localStorage.setItem('usingClerk', 'true');
    }, []);
    
    // If we successfully get the hooks, store their values in localStorage for components
    // that don't have direct access to Clerk context
    useEffect(() => {
      if (userValue?.user && userValue.isSignedIn) {
        console.log("Clerk user signed in:", userValue.user);
        
        // Update centralized auth state
        setAuthenticatedUser({
          userId: userValue.user.id,
          username: userValue.user.username || userValue.user.firstName || 'User',
          provider: 'clerk'
        });
        
        // Store basic user info for components that can't access Clerk context
        localStorage.setItem('userAvatarUrl', userValue.user.imageUrl || '');
        localStorage.setItem('currentUserId', userValue.user.id);
        localStorage.setItem('authStatus', 'authenticated');
        localStorage.setItem('currentUsername', userValue.user.username || userValue.user.firstName || 'User');
        
        // Store profile data for synchronization
        localStorage.setItem('userBio', userValue.user.unsafeMetadata?.bio as string || '');
        
        // Sync status from localStorage to Clerk if it exists
        const currentStatus = getUserStatus();
        if (currentStatus && userValue.user.unsafeMetadata?.status !== currentStatus) {
          clerkSyncValue?.updateUserStatus(currentStatus);
        }
        
        // Or sync status from Clerk to localStorage if it exists
        const clerkStatus = userValue.user.unsafeMetadata?.status as string;
        if (clerkStatus && clerkStatus !== getUserStatus()) {
          setUserStatus(clerkStatus as "online" | "offline" | "away" | "busy");
        }
        
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
        
        // Listen for profileImageUrl changes
        const checkForAvatarChanges = () => {
          const storedAvatarUrl = localStorage.getItem('userAvatarUrl');
          if (storedAvatarUrl !== userValue?.user?.imageUrl) {
            localStorage.setItem('userAvatarUrl', userValue?.user?.imageUrl || '');
            // Dispatch event to notify components of profile image change
            window.dispatchEvent(new Event('profile-image-change'));
          }
        };
        
        // Listen for status changes
        const checkForStatusChanges = () => {
          const storedStatus = localStorage.getItem('userStatus');
          const clerkStatus = userValue?.user?.unsafeMetadata?.status as string;
          
          if (storedStatus !== clerkStatus && clerkStatus) {
            setUserStatus(clerkStatus as "online" | "offline" | "away" | "busy");
          }
        };
        
        // Check for profile changes every 15 seconds
        const intervalId = setInterval(() => {
          checkForAvatarChanges();
          checkForStatusChanges();
        }, 15000);
        
        return () => clearInterval(intervalId);
      } else if (userValue?.isLoaded && !userValue?.isSignedIn) {
        // Handle sign-out or unauthenticated state
        console.log("User not signed in with Clerk");
      }
    }, [userValue?.user, userValue?.isSignedIn, userValue?.isLoaded, toast, clerkSyncValue]);
    
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

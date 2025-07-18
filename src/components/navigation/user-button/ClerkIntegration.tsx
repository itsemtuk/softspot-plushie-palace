
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
    
    // Debug Clerk status on load with reduced logging
    useEffect(() => {
      if (userValue?.isLoaded) {
        console.log("Clerk authentication loaded successfully");
        
        // Mark that we're using Clerk for authentication
        localStorage.setItem('usingClerk', 'true');
      }
    }, [userValue?.isLoaded]);
    
    // Handle user authentication state
    useEffect(() => {
      if (userValue?.user && userValue.isSignedIn) {
        console.log("User authenticated with Clerk");
        
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
        
        // Sync status with reduced conflict potential
        const currentStatus = getUserStatus();
        if (currentStatus && userValue.user.unsafeMetadata?.status !== currentStatus) {
          clerkSyncValue?.updateUserStatus(currentStatus).catch(err => {
            console.warn('Status sync failed (non-critical):', err);
          });
        }
        
        // Or sync status from Clerk to localStorage if it exists
        const clerkStatus = userValue.user.unsafeMetadata?.status as string;
        if (clerkStatus && clerkStatus !== getUserStatus()) {
          setUserStatus(clerkStatus as "online" | "offline" | "away" | "busy");
        }
        
        // Dispatch event to notify components of auth state change
        window.dispatchEvent(new Event('clerk-auth-change'));
        
      } else if (userValue?.isLoaded && !userValue?.isSignedIn) {
        // Handle sign-out or unauthenticated state with reduced logging
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('authStatus');
        localStorage.removeItem('currentUsername');
        localStorage.removeItem('userAvatarUrl');
        localStorage.removeItem('userBio');
        
        // Dispatch event to notify components of auth state change
        window.dispatchEvent(new Event('clerk-auth-change'));
      }
    }, [userValue?.user, userValue?.isSignedIn, userValue?.isLoaded, clerkSyncValue]);
    
  } catch (error) {
    // Silently handle the error when used outside ClerkProvider
    console.warn("Clerk integration not available:", error.message);
  }
  
  // This component doesn't render anything visible
  return null;
};

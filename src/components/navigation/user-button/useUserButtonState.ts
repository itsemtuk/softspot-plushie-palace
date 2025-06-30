
import { useState, useEffect } from "react";
import { getUserStatus, setUserStatus } from "@/utils/storage/localStorageUtils";
import { isAuthenticated, clearAuthState, getCurrentUser } from "@/utils/auth/authState";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const useUserButtonState = () => {
  const navigate = useNavigate();
  const [userStatus, setUserStatusState] = useState<"online" | "offline" | "away" | "busy">("online");
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [signOut, setSignOut] = useState<(() => Promise<void>) | null>(null);
  const [updateClerkProfile, setUpdateClerkProfile] = useState<((data: any) => Promise<any>) | null>(null);
  const [username, setUsername] = useState<string>("Anonymous");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  
  // Get user info from centralized auth state and update when changed
  useEffect(() => {
    const updateUserInfo = () => {
      const currentUser = getCurrentUser();
      setUsername(currentUser?.username || "Anonymous");
      setAvatarUrl(localStorage.getItem('userAvatarUrl') || "");
      setUserStatusState(getUserStatus());
    };
    
    updateUserInfo();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      updateUserInfo();
    };
    
    window.addEventListener('clerk-auth-change', handleAuthChange);
    window.addEventListener('profile-image-change', handleAuthChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'userAvatarUrl' || e.key === 'currentUsername' || 
          e.key === 'userStatus' || e.key === 'authStatus' ||
          e.key === 'currentUserId') {
        updateUserInfo();
      }
    });
    
    return () => {
      window.removeEventListener('clerk-auth-change', handleAuthChange);
      window.removeEventListener('profile-image-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Load Clerk components dynamically if configured and available
  useEffect(() => {
    if (isClerkConfigured) {
      // Check if we're actually in a Clerk context
      const clerkInstance = (window as any).__clerk;
      if (clerkInstance) {
        setIsClerkLoaded(true);
        setSignOut(() => async () => {
          await clerkInstance.signOut();
        });
      } else {
        console.warn("Clerk is configured but not available in this context");
        setIsClerkLoaded(false);
      }
    }
  }, [isClerkConfigured]);

  const handleChangeStatus = async (newStatus: "online" | "offline" | "away" | "busy") => {
    setUserStatusState(newStatus);
    
    // Update local storage
    setUserStatus(newStatus);
    
    // Update Clerk if available
    if (isClerkConfigured && user && updateClerkProfile) {
      try {
        await updateClerkProfile({
          status: newStatus
        });
      } catch (error) {
        console.error("Failed to update status", error);
      }
    }
  };

  const handleProfileClick = () => {
    console.log("Navigating to profile page");
    // Ensure we're actually navigating - using setTimeout to break current execution context
    setTimeout(() => {
      navigate('/profile');
    }, 0);
  };

  const handleSignOut = async () => {
    try {
      // First, sign out from Clerk if available
      if (isClerkConfigured && signOut) {
        await signOut();
      }
      
      // Clear auth state
      clearAuthState();
      
      // Navigate to home page
      navigate('/');
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was a problem signing out. Please try again."
      });
    }
  };

  return {
    userStatus,
    isClerkLoaded,
    isClerkConfigured,
    username,
    avatarUrl,
    handleChangeStatus,
    handleProfileClick,
    handleSignOut
  };
};

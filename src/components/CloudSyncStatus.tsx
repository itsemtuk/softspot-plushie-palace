
import { useState, useEffect } from "react";
import { isSupabaseConfigured } from "@/utils/supabase/client";
import { Wifi, WifiOff, CloudOff, Cloud } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

// Check if Clerk is configured
const isClerkConfigured = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_') && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_valid-test-key-for-dev-only";

// Simple function to check if user is signed in without requiring Clerk
function isUserSignedIn() {
  return !!localStorage.getItem('currentUserId');
}

// Add type declaration for Clerk's frontend API
declare global {
  interface Window {
    __clerk_frontend_api?: {
      sessions?: { userId: string }[];
    }
  }
}

export function CloudSyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isCloudEnabled, setIsCloudEnabled] = useState(isSupabaseConfigured());
  const [isSignedIn, setIsSignedIn] = useState(isUserSignedIn());
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (isCloudEnabled && isSignedIn) {
        toast({
          title: "Online",
          description: "Connection restored. Your data will sync to the cloud.",
          duration: 3000,
        });
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      if (isCloudEnabled) {
        toast({
          variant: "destructive",
          title: "Offline",
          description: "You are offline. Changes will be saved locally until connection is restored.",
          duration: 5000,
        });
      }
    };
    
    // Check sign-in status
    const checkSignInStatus = () => {
      setIsSignedIn(isUserSignedIn());
    };
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    // Update sign-in status if localStorage changes
    window.addEventListener("storage", checkSignInStatus);
    
    // Initial check for user status
    checkSignInStatus();
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("storage", checkSignInStatus);
    };
  }, [isCloudEnabled, isSignedIn]);
  
  // Don't show any notification on mobile if there's issues
  const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Show sync status on initial load only if not on mobile
  useEffect(() => {
    if (isMobileDevice) return;
    
    if (isCloudEnabled && isSignedIn) {
      toast({
        title: "Cloud Sync Enabled",
        description: "Your posts and data will be synced across all your devices.",
        duration: 3000,
      });
    } else if (isSignedIn && !isCloudEnabled) {
      toast({
        variant: "default",
        title: "Local Storage Only",
        description: "Your data is only stored on this device. Enable Supabase integration for cloud sync.",
        duration: 5000,
        action: (
          <Button size="sm" variant="outline" onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}>
            Learn How
          </Button>
        ),
      });
    }
  }, [isCloudEnabled, isSignedIn, isMobileDevice]);
  
  // Return null as this is just a notification controller with no UI
  return null;
}

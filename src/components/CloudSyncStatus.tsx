
import { useState, useEffect } from "react";
import { isSupabaseConfigured } from "@/utils/supabase/client";
import { Wifi, WifiOff, CloudOff, Cloud } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

// Check if Clerk is configured
const isClerkConfigured = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_') && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_valid-test-key-for-dev-only";

// Create a safe version of useUser that works with or without Clerk
function useSafeUser() {
  if (!isClerkConfigured) {
    // If Clerk is not configured, return a default value
    return { isSignedIn: !!localStorage.getItem('currentUserId') };
  }
  
  try {
    // Safely import and use Clerk's useUser
    // This dynamic import pattern works better with build systems
    const { useUser } = require('@clerk/clerk-react');
    if (typeof useUser === 'function') {
      return useUser();
    } else {
      console.warn("Clerk's useUser is not available, using fallback");
      return { isSignedIn: !!localStorage.getItem('currentUserId') };
    }
  } catch (error) {
    console.error("Failed to use Clerk's useUser:", error);
    return { isSignedIn: !!localStorage.getItem('currentUserId') };
  }
}

export function CloudSyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isCloudEnabled, setIsCloudEnabled] = useState(isSupabaseConfigured());
  
  // Use our safe version of useUser instead of direct Clerk import
  const { isSignedIn } = useSafeUser();
  
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
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isCloudEnabled, isSignedIn]);
  
  // Show sync status on initial load
  useEffect(() => {
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
  }, [isCloudEnabled, isSignedIn]);
  
  // Return null as this is just a notification controller with no UI
  return null;
}

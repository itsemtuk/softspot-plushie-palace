
import { useState, useEffect } from "react";
import { isSupabaseConfigured } from "@/utils/supabase/client";
import { toast } from "./ui/use-toast";

// Simple function to check if user is signed in without requiring Clerk
function isUserSignedIn() {
  return !!localStorage.getItem('currentUserId');
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
    
    // Check if Supabase is configured
    setIsCloudEnabled(isSupabaseConfigured());
    
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
    
    // Ensure Supabase status is correctly reported
    const supabaseEnabled = isSupabaseConfigured();
    
    if (isSignedIn) {
      if (supabaseEnabled) {
        toast({
          title: "Cloud Sync Enabled",
          description: "Connected to Supabase. Your data will be synced across devices.",
          duration: 3000,
        });
      } else {
        toast({
          variant: "default",
          title: "Local Storage Only",
          description: "Your data is only stored on this device.",
          duration: 5000,
        });
      }
    }
  }, [isSignedIn, isMobileDevice]);
  
  // Return null as this is just a notification controller with no UI
  return null;
}

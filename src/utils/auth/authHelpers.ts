
import { toast } from "@/components/ui/use-toast";
import { isAuthenticated, getCurrentUser } from "./authState";
import { safeQueryWithRetry, supabase } from "../supabase/client";

/**
 * Helper to safely check authentication with better error handling
 * @param redirectCallback Optional callback to handle redirect if not authenticated
 * @param showToast Whether to show a toast message if not authenticated
 * @returns Object containing authentication status and user data
 */
export const safeCheckAuth = async (
  redirectCallback?: () => void,
  showToast = true
) => {
  try {
    const isAuth = isAuthenticated();
    
    // If not authenticated and redirect callback provided
    if (!isAuth) {
      if (showToast) {
        toast({
          title: "Authentication Required",
          description: "You must be signed in to access this feature.",
          variant: "destructive"
        });
      }
      
      if (redirectCallback) {
        redirectCallback();
      }
      
      return { isAuthenticated: false, user: null };
    }
    
    // Get current user info
    const user = getCurrentUser();
    
    if (!user?.id) {
      if (showToast) {
        toast({
          title: "User Profile Error",
          description: "Unable to retrieve your profile information.",
          variant: "destructive"
        });
      }
      
      return { isAuthenticated: true, user: null };
    }
    
    return { isAuthenticated: true, user };
  } catch (error) {
    console.error("Auth check error:", error);
    
    if (showToast) {
      toast({
        title: "Authentication Error",
        description: "There was a problem checking your authentication status.",
        variant: "destructive"
      });
    }
    
    return { isAuthenticated: false, user: null };
  }
};

/**
 * Check if user is authenticated with Supabase
 * @returns Promise resolving to boolean indicating auth status
 */
export const checkSupabaseAuth = async (): Promise<boolean> => {
  try {
    const { data } = await safeQueryWithRetry(() => supabase.auth.getSession());
    return !!data?.session;
  } catch (error) {
    console.error("Supabase auth error:", error);
    return false;
  }
};

/**
 * Wait for authentication to be ready
 * Useful for components that need to wait for auth before rendering
 * @param maxWaitMs Maximum time to wait in milliseconds
 * @returns Promise resolving when auth check is complete
 */
export const waitForAuth = async (maxWaitMs = 2000): Promise<boolean> => {
  const startTime = Date.now();
  
  // Check initially
  if (isAuthenticated()) {
    return true;
  }
  
  // Poll until authenticated or timeout
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (isAuthenticated()) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - startTime > maxWaitMs) {
        clearInterval(interval);
        resolve(false);
      }
    }, 100);
  });
};


import { toast } from "@/components/ui/use-toast";
import { isAuthenticated, getCurrentUser } from "./authState";
import { safeQueryWithRetry, supabase, testSupabaseConnection } from "../supabase/client";

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
    
    if (!user || !user.userId) {
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
 * Check if user is authenticated with Supabase with better error handling
 * @returns Promise resolving to boolean indicating auth status
 */
export const checkSupabaseAuth = async (): Promise<boolean> => {
  try {
    if (!supabase) {
      console.error("Supabase client not initialized");
      return false;
    }
    
    // Test connection first
    const connectionWorking = await testSupabaseConnection();
    if (!connectionWorking) {
      console.warn("Supabase connection failed, skipping auth check");
      return false;
    }
    
    const { data } = await safeQueryWithRetry(() => supabase.auth.getSession());
    return !!data?.session;
  } catch (error) {
    console.error("Supabase auth error:", error);
    return false;
  }
};

/**
 * Wait for authentication to be ready with improved timeout handling
 * Useful for components that need to wait for auth before rendering
 * @param maxWaitMs Maximum time to wait in milliseconds
 * @returns Promise resolving when auth check is complete
 */
export const waitForAuth = async (maxWaitMs = 3000): Promise<boolean> => {
  const startTime = Date.now();
  
  // Check initially
  if (isAuthenticated()) {
    return true;
  }
  
  // Check Supabase auth as a backup (but don't wait too long)
  try {
    const hasSupabaseSession = await Promise.race([
      checkSupabaseAuth(),
      new Promise<boolean>(resolve => setTimeout(() => resolve(false), 2000))
    ]);
    if (hasSupabaseSession) return true;
  } catch (err) {
    console.log("Supabase auth check failed, continuing with local checks");
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

/**
 * Initialize auth state and check for existing sessions
 */
export const initializeAuth = async (): Promise<void> => {
  try {
    // Check local auth first
    const localAuth = isAuthenticated();
    if (localAuth) {
      console.log("Local authentication found");
      return;
    }
    
    // Try to restore from Supabase if available
    const supabaseAuth = await checkSupabaseAuth();
    if (supabaseAuth) {
      console.log("Supabase session found, syncing to local state");
      // Here you could sync the Supabase session to local state if needed
    }
  } catch (error) {
    console.error("Error initializing auth:", error);
  }
};

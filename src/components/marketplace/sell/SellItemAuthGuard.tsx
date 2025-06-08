
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";
import { toast } from "@/components/ui/use-toast";
import { waitForAuth, safeCheckAuth } from "@/utils/auth/authHelpers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SellItemAuthGuardProps {
  children: React.ReactNode;
  onAuthReady: () => void;
}

export const SellItemAuthGuard = ({ children, onAuthReady }: SellItemAuthGuardProps) => {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { supabaseUserId, isLoading: isUserSyncLoading, error: syncError } = useClerkSupabaseUser(clerkUser);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isClerkLoaded) return;
        
        if (!clerkUser?.id) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue.",
            variant: "destructive"
          });
          navigate('/sign-in');
          return;
        }
        
        // Wait for user sync to complete
        if (isUserSyncLoading) return;
        
        // Auth is ready even if Supabase sync failed
        onAuthReady();
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem checking your authentication status.",
          variant: "destructive"
        });
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate, isClerkLoaded, clerkUser, onAuthReady, isUserSyncLoading]);

  // Show loading while checking auth or syncing user
  if (isAuthChecking || isUserSyncLoading || !isClerkLoaded) {
    return null; // Let parent handle loading state
  }

  // Check if user exists - critical authentication check
  if (!clerkUser?.id) {
    return (
      <div className="flex justify-center items-center h-[60vh] flex-col">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="mb-4">Please sign in to list your items for sale.</p>
              <button 
                className="bg-softspot-500 text-white px-4 py-2 rounded-md hover:bg-softspot-600 transition-colors"
                onClick={() => navigate('/sign-in')}
              >
                Sign In
              </button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show sync error as warning but allow access
  if (syncError) {
    console.warn("Supabase sync error (continuing with local auth):", syncError);
  }

  return <>{children}</>;
};

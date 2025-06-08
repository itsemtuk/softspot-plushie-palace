
import MainLayout from "@/components/layout/MainLayout";
import { SellItemFormWrapper } from "@/components/marketplace/sell/SellItemFormWrapper";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@clerk/clerk-react";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const SellItemPage = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { supabaseUserId, isLoading: isUserSyncLoading, error: userSyncError } = useClerkSupabaseUser(clerkUser);

  useEffect(() => {
    const initializePage = async () => {
      try {
        console.log("SellItemPage: Initializing", { isClerkLoaded, clerkUser: !!clerkUser, isUserSyncLoading });
        
        // Wait for Clerk to load
        if (!isClerkLoaded) {
          return;
        }
        
        // Check if user exists
        if (!clerkUser) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue.",
            variant: "destructive"
          });
          navigate('/sign-in');
          return;
        }
        
        // Wait for user sync to complete (but don't block on failure)
        if (isUserSyncLoading) {
          return;
        }

        // Check for user sync errors (but don't block - warn instead)
        if (userSyncError) {
          console.warn("User sync error (non-blocking):", userSyncError);
          toast({
            title: "Sync Warning",
            description: "There was an issue syncing your profile, but you can still create listings.",
            variant: "default"
          });
        }
        
        console.log("SellItemPage: Ready to show form", { supabaseUserId });
        setIsReady(true);
        setError(null);
        
      } catch (err) {
        console.error("Sell page initialization error:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize page");
      }
    };

    initializePage();
  }, [isClerkLoaded, clerkUser, isUserSyncLoading, userSyncError, navigate, supabaseUserId]);

  // Loading state
  if (!isClerkLoaded || isUserSyncLoading || !isReady) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <Spinner size="lg" />
          <p className="ml-3 text-gray-600 dark:text-gray-400 mt-4">
            {!isClerkLoaded ? "Loading authentication..." : 
             isUserSyncLoading ? "Syncing your account..." : 
             "Preparing form..."}
          </p>
        </div>
      </MainLayout>
    );
  }

  // Error state (only for critical errors)
  if (error) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-6">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-sm underline hover:no-underline"
                >
                  Refresh page
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  // Not authenticated
  if (!clerkUser) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center max-w-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Authentication Required</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">Please sign in to list your items for sale.</p>
            <button 
              className="bg-softspot-500 text-white px-4 py-2 rounded-md hover:bg-softspot-600 transition-colors"
              onClick={() => navigate('/sign-in')}
            >
              Sign In
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-6">
        {/* Offline mode indicator */}
        {!navigator.onLine && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
            <WifiOff className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <strong>Offline Mode:</strong> You're working offline. Your listing will be saved locally and synced when you reconnect.
            </AlertDescription>
          </Alert>
        )}
        
        <SellItemFormWrapper supabaseUserId={supabaseUserId} />
      </div>
    </MainLayout>
  );
};

export default SellItemPage;

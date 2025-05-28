
import MainLayout from "@/components/layout/MainLayout";
import { SellItemImageUploader } from "@/components/marketplace/sell/SellItemImageUploader";
import { SellItemFormFields } from "@/components/marketplace/sell/SellItemFormFields";
import { SellItemFormActions } from "@/components/marketplace/sell/SellItemFormActions";
import { useSellItemForm } from "@/hooks/useSellItemForm";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { safeCheckAuth, setupUserContext, testSupabaseConnection } from "@/utils/auth/authHelpers";
import { isInFallbackMode } from "@/utils/supabase/rls";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useUser } from "@clerk/clerk-react";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";

const SellItemPage = () => {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'fallback'>('checking');
  
  // Get Clerk user with proper null handling
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  
  // Sync Clerk user to Supabase and get Supabase user ID with null safety
  const { supabaseUserId, isLoading: isUserSyncLoading } = useClerkSupabaseUser(clerkUser);
  
  // Get form values with null safety
  const formValues = useSellItemForm();
  
  // Check if formValues exists before destructuring
  const { 
    imageUrl = "", 
    isSubmitting = false, 
    register = null, 
    errors = {}, 
    handleSubmit = null,
    onSubmit = null, 
    handleImageSelect = null,
    handleSelectChange = null 
  } = formValues || {};

  // Enhanced authentication check with better error handling
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('SellItemPage: Starting authentication check');
        
        // Wait for Clerk to load first
        if (!isClerkLoaded) {
          console.log('SellItemPage: Waiting for Clerk to load');
          return;
        }
        
        // Check if user exists
        if (!clerkUser) {
          console.log('SellItemPage: No Clerk user found');
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue.",
            variant: "destructive"
          });
          navigate('/sign-in');
          return;
        }
        
        console.log('SellItemPage: Clerk user found, checking connection');
        
        // Test Supabase connection
        const isConnected = await testSupabaseConnection(2000);
        setConnectionStatus(isConnected ? 'connected' : 'fallback');
        
        // Check authentication state
        const authResult = await safeCheckAuth(() => {
          navigate('/sign-in');
        }, 3000);
        
        if (!authResult.isAuthenticated) {
          console.log('SellItemPage: User not authenticated');
          return; // Navigate will happen in the callback
        }
        
        console.log('SellItemPage: User authenticated, setting up context');
        
        // Setup user context (with fallback handling)
        if (clerkUser.id) {
          await setupUserContext(clerkUser.id);
        }
        
        // Set form as loaded after auth check is complete
        setIsFormLoaded(true);
        console.log('SellItemPage: Authentication complete');
        
      } catch (error) {
        console.error("SellItemPage: Auth check error:", error);
        
        // Don't show error for network issues - just use fallback
        if (error.message?.includes('CORS') || 
            error.message?.includes('fetch') || 
            error.message?.includes('NetworkError')) {
          console.warn('SellItemPage: Network error detected, using fallback mode');
          setConnectionStatus('fallback');
          setIsFormLoaded(true);
        } else {
          toast({
            title: "Authentication Error",
            description: "There was a problem checking your authentication status.",
            variant: "destructive"
          });
        }
      } finally {
        // Always set auth checking to false when done
        setIsAuthChecking(false);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, isClerkLoaded, clerkUser]);

  // Show loading state while checking authentication or syncing user
  if (isAuthChecking || isUserSyncLoading || !isClerkLoaded || loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <Spinner size="lg" />
          <p className="ml-3 text-gray-600 mt-4">
            {isAuthChecking ? "Checking authentication..." : "Preparing your account..."}
          </p>
          {connectionStatus === 'checking' && (
            <p className="text-sm text-gray-500 mt-2">Testing connection...</p>
          )}
        </div>
      </MainLayout>
    );
  }

  // Check if user is authenticated
  if (!clerkUser) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center max-w-md">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="mb-4">Please sign in to list your items for sale.</p>
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

  // Show loading state while form is initializing
  if (!isFormLoaded || !register || !handleSubmit || !onSubmit) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Loading form...</p>
        </div>
      </MainLayout>
    );
  }

  // Create a properly typed form submit handler with explicit React.FormEventHandler type
  const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    if (handleSubmit && onSubmit) {
      // Call the handleSubmit function with onSubmit as its argument, then call the resulting function with the event
      handleSubmit(onSubmit as any)(e);
    } else {
      e.preventDefault();
      console.error("Form submission failed: handleSubmit or onSubmit is not initialized");
      toast({
        title: "Error",
        description: "Unable to process form submission at this time. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="max-w-2xl mx-auto py-6">
          {/* Connection status indicator */}
          {connectionStatus === 'fallback' && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <WifiOff className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Offline Mode:</strong> You're working offline. Your listing will be saved locally and synced when you reconnect.
              </AlertDescription>
            </Alert>
          )}
          
          {isInFallbackMode() && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <Wifi className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Fallback Mode:</strong> Using local storage due to connection issues. Data will sync when connection is restored.
              </AlertDescription>
            </Alert>
          )}
          
          <Card className="rounded-xl bg-white shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100">
              <CardTitle className="text-2xl font-bold">Sell Your Plushie</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={formSubmitHandler} className="space-y-6">
                <SellItemImageUploader 
                  imageUrl={imageUrl} 
                  onImageSelect={handleImageSelect || (() => {})} 
                />

                <SellItemFormFields
                  register={register}
                  errors={errors}
                  onSelectChange={handleSelectChange || (() => {})}
                />

                <SellItemFormActions 
                  isSubmitting={isSubmitting} 
                  supabaseUserId={supabaseUserId}
                />
              </form>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    </MainLayout>
  );
};

export default SellItemPage;

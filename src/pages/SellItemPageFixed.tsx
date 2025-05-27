
import MainLayout from "@/components/layout/MainLayout";
import { SellItemImageUploader } from "@/components/marketplace/sell/SellItemImageUploader";
import { SellItemFormFields } from "@/components/marketplace/sell/SellItemFormFields";
import { SellItemFormActions } from "@/components/marketplace/sell/SellItemFormActions";
import { useSellItemFormFixed } from "@/hooks/useSellItemFormFixed";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { waitForAuth, safeCheckAuth } from "@/utils/auth/authHelpers";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";
import { useUser } from "@clerk/clerk-react";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { ConnectionStatusIndicator } from "@/components/ui/connection-status";

const SellItemPageFixed = () => {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { supabaseUserId, isLoading: isUserSyncLoading } = useClerkSupabaseUser(clerkUser);
  
  console.log("SellItemPageFixed: Rendering, user loaded:", isClerkLoaded, "user:", clerkUser?.id);
  
  // Get form data with comprehensive error handling
  const formValues = useSellItemFormFixed();
  
  // Safe destructuring with extensive null checks
  const { 
    imageUrl = "", 
    isSubmitting = false, 
    register, 
    errors = {}, 
    handleSubmit,
    onSubmit, 
    handleImageSelect,
    handleSelectChange 
  } = formValues || {};

  console.log("SellItemPageFixed: Form values:", { 
    hasRegister: !!register, 
    hasHandleSubmit: !!handleSubmit, 
    hasOnSubmit: !!onSubmit,
    formValues: !!formValues,
    registerType: typeof register,
    handleSubmitType: typeof handleSubmit
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("SellItemPageFixed: Starting auth check");
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
        
        const isAuthReady = await waitForAuth(2000);
        
        if (!isAuthReady) {
          const { isAuthenticated } = await safeCheckAuth(() => {
            navigate('/sign-in');
          });
          
          if (!isAuthenticated) return;
        }
        
        console.log("SellItemPageFixed: Auth check complete");
      } catch (error) {
        console.error("Auth check error:", error);
        setFormError("Authentication error occurred. Please try refreshing the page.");
        toast({
          title: "Authentication Error",
          description: "There was a problem checking your authentication status.",
          variant: "destructive"
        });
      } finally {
        setIsAuthChecking(false);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, isClerkLoaded, clerkUser]);

  // Show loading while checking auth or syncing user
  if (isAuthChecking || isUserSyncLoading || !isClerkLoaded || loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Spinner size="lg" />
          <p className="ml-3 text-gray-600">
            {isAuthChecking ? "Checking authentication..." : "Preparing your account..."}
          </p>
        </div>
      </MainLayout>
    );
  }

  // Check if user exists - critical authentication check
  if (!clerkUser?.id) {
    return (
      <MainLayout>
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
      </MainLayout>
    );
  }

  // Enhanced form validation with detailed error logging
  if (!formValues) {
    console.error("SellItemPageFixed: formValues is null/undefined");
    setFormError("Form initialization failed. Please refresh the page.");
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Form Error</h2>
                <p className="mb-4">Unable to initialize the form. Please refresh the page and try again.</p>
                <button 
                  className="bg-softspot-500 text-white px-4 py-2 rounded-md hover:bg-softspot-600 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  if (!register || typeof register !== 'function') {
    console.error("SellItemPageFixed: register is not a function", { register, type: typeof register });
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <Alert variant="warning" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-500">Initializing form registration...</p>
                <p className="text-sm text-gray-400 mt-2">
                  If this persists, please refresh the page.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  if (!handleSubmit || typeof handleSubmit !== 'function') {
    console.error("SellItemPageFixed: handleSubmit is not a function", { handleSubmit, type: typeof handleSubmit });
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <Alert variant="warning" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-500">Initializing form handlers...</p>
                <p className="text-sm text-gray-400 mt-2">
                  If this persists, please refresh the page.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  if (!onSubmit || typeof onSubmit !== 'function') {
    console.error("SellItemPageFixed: onSubmit is not a function", { onSubmit, type: typeof onSubmit });
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <Alert variant="warning" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-500">Initializing submission handler...</p>
                <p className="text-sm text-gray-400 mt-2">
                  If this persists, please refresh the page.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  // Safe form submit handler with enhanced error handling
  const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    console.log("SellItemPageFixed: Form submit triggered");
    e.preventDefault();
    
    try {
      // Double-check all required functions exist before calling
      if (!handleSubmit || typeof handleSubmit !== 'function') {
        throw new Error("Form submission handler not available");
      }
      
      if (!onSubmit || typeof onSubmit !== 'function') {
        throw new Error("Form submission callback not available");
      }

      // Execute the form submission
      const submitFunction = handleSubmit(onSubmit);
      if (!submitFunction || typeof submitFunction !== 'function') {
        throw new Error("Form submission function creation failed");
      }
      
      submitFunction(e);
    } catch (error) {
      console.error("Form submission error:", error);
      setFormError(`Form submission failed: ${error.message}`);
      toast({
        title: "Submission Error", 
        description: "Unable to process form submission. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <EnhancedErrorBoundary>
        <div className="max-w-2xl mx-auto py-6">
          {/* Connection status indicator */}
          <ConnectionStatusIndicator />
          
          {/* Form error display */}
          {formError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
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
      </EnhancedErrorBoundary>
    </MainLayout>
  );
};

export default SellItemPageFixed;

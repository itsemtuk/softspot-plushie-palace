
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

const SellItemPageFixed = () => {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { supabaseUserId, isLoading: isUserSyncLoading } = useClerkSupabaseUser(clerkUser);
  
  console.log("SellItemPageFixed: Rendering, user loaded:", isClerkLoaded, "user:", clerkUser?.id);
  
  // Get form data - this should never return null values now
  const formValues = useSellItemFormFixed();
  
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
    register: !!register, 
    handleSubmit: !!handleSubmit, 
    onSubmit: !!onSubmit 
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

  if (!clerkUser?.id) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center max-w-md">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="mb-4">Please sign in to list your items for sale.</p>
            <button 
              className="bg-softspot-500 text-white px-4 py-2 rounded-md"
              onClick={() => navigate('/sign-in')}
            >
              Sign In
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Enhanced form validation
  if (!register || !handleSubmit || !onSubmit) {
    console.error("SellItemPageFixed: Form methods not ready", { register: !!register, handleSubmit: !!handleSubmit, onSubmit: !!onSubmit });
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Initializing form...</p>
        </div>
      </MainLayout>
    );
  }

  const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    console.log("SellItemPageFixed: Form submit triggered");
    e.preventDefault();
    
    if (!handleSubmit || !onSubmit) {
      console.error("Form submission failed: methods not available");
      toast({
        title: "Error",
        description: "Form is not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }

    try {
      handleSubmit(onSubmit)(e);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Unable to process form submission. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <EnhancedErrorBoundary>
        <div className="max-w-2xl mx-auto py-6">
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

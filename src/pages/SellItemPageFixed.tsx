
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
import ErrorBoundary from "@/components/ui/error-boundary";
import { useUser } from "@clerk/clerk-react";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";

const SellItemPageFixed = () => {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { supabaseUserId, isLoading: isUserSyncLoading } = useClerkSupabaseUser(clerkUser);
  
  const formValues = useSellItemFormFixed();
  
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
        
        const isAuthReady = await waitForAuth(2000);
        
        if (!isAuthReady) {
          const { isAuthenticated } = await safeCheckAuth(() => {
            navigate('/sign-in');
          });
          
          if (!isAuthenticated) return;
        }
        
        setIsFormLoaded(true);
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

  const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (handleSubmit && onSubmit) {
      handleSubmit(onSubmit)(e);
    } else {
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

export default SellItemPageFixed;

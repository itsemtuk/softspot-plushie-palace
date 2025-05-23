
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
import { waitForAuth, safeCheckAuth } from "@/utils/auth/authHelpers";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useUser } from "@clerk/clerk-react";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";

const SellItemPage = () => {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  
  // Get Clerk user
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  
  // Sync Clerk user to Supabase and get Supabase user ID
  const { supabaseUserId, isLoading: isUserSyncLoading } = useClerkSupabaseUser(clerkUser);
  
  // Get form values with null safety
  const formValues = useSellItemForm();
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

  // Check if user is authenticated with improved error handling
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for Clerk to load first
        if (!isClerkLoaded) {
          return;
        }
        
        // Wait for auth to be ready with a timeout
        const isAuthReady = await waitForAuth(2000);
        
        // If auth is not ready after waiting, do a manual check
        if (!isAuthReady) {
          const { isAuthenticated } = await safeCheckAuth(() => {
            navigate('/sign-in');
          });
          
          if (!isAuthenticated) {
            return; // Navigate will happen in the callback
          }
        }
        
        // Set form as loaded after auth check is complete
        setIsFormLoaded(true);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem checking your authentication status.",
          variant: "destructive"
        });
      } finally {
        // Always set auth checking to false when done
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate, isClerkLoaded]);

  // Show loading state while checking authentication or syncing user
  if (isAuthChecking || isUserSyncLoading || !isClerkLoaded) {
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
      handleSubmit(onSubmit)(e);
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
          <Card className="rounded-xl shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50">
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

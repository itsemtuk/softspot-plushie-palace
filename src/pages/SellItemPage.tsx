
import MainLayout from "@/components/layout/MainLayout";
import { SellItemImageUploader } from "@/components/marketplace/sell/SellItemImageUploader";
import { SellItemFormFields } from "@/components/marketplace/sell/SellItemFormFields";
import { SellItemFormActions } from "@/components/marketplace/sell/SellItemFormActions";
import { useSellItemForm } from "@/hooks/useSellItemForm";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { waitForAuth, safeCheckAuth } from "@/utils/auth/authHelpers";

const SellItemPage = () => {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  
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
  }, [navigate]);

  // Show loading state while checking authentication
  if (isAuthChecking) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Spinner size="lg" />
          <p className="ml-3 text-gray-600">Checking authentication...</p>
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

  // Only render form when everything is properly initialized
  const safeHandleSubmit = handleSubmit || (() => console.error("handleSubmit not initialized"));
  const safeOnSubmit = onSubmit || (() => console.error("onSubmit not initialized"));
  const safeHandleImageSelect = handleImageSelect || (() => console.error("handleImageSelect not initialized"));
  const safeHandleSelectChange = handleSelectChange || (() => console.error("handleSelectChange not initialized"));

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Sell Your Plushie</h1>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={safeHandleSubmit(safeOnSubmit)} className="space-y-6">
              <SellItemImageUploader 
                imageUrl={imageUrl} 
                onImageSelect={safeHandleImageSelect} 
              />

              <SellItemFormFields
                register={register}
                errors={errors}
                onSelectChange={safeHandleSelectChange}
              />

              <SellItemFormActions isSubmitting={isSubmitting} />
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SellItemPage;

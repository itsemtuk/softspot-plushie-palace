
import MainLayout from "@/components/layout/MainLayout";
import { SellItemImageUploader } from "@/components/marketplace/sell/SellItemImageUploader";
import { SellItemFormFields } from "@/components/marketplace/sell/SellItemFormFields";
import { SellItemFormActions } from "@/components/marketplace/sell/SellItemFormActions";
import { useSellItemForm } from "@/hooks/useSellItemForm";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/auth/authState";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const SellItemPage = () => {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // Use optional chaining for form values to prevent null errors
  const { 
    imageUrl, 
    isSubmitting, 
    register, 
    errors, 
    handleSubmit,
    onSubmit, 
    handleImageSelect,
    handleSelectChange 
  } = useSellItemForm() || {}; // Provide fallback empty object

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = isAuthenticated();
        setIsAuthChecking(false);
        
        if (!auth) {
          toast({
            title: "Authentication Required",
            description: "You must be signed in to sell items."
          });
          navigate('/sign-in');
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthChecking(false);
        toast({
          title: "Authentication Error",
          description: "There was a problem checking your authentication status.",
          variant: "destructive"
        });
      }
    };
    
    // Increased delay to ensure auth state is properly loaded
    const timer = setTimeout(checkAuth, 300);
    return () => clearTimeout(timer);
  }, [navigate]);

  // Show loading state while checking authentication
  if (isAuthChecking) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!register || !handleSubmit || !onSubmit) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Loading form...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Sell Your Plushie</h1>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <SellItemImageUploader 
                imageUrl={imageUrl || ""} 
                onImageSelect={handleImageSelect || (() => {})} 
              />

              <SellItemFormFields
                register={register}
                errors={errors || {}}
                onSelectChange={handleSelectChange || (() => {})}
              />

              <SellItemFormActions isSubmitting={isSubmitting || false} />
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SellItemPage;

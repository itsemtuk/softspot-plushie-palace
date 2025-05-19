
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { SellItemImageUploader } from "@/components/marketplace/sell/SellItemImageUploader";
import { SellItemFormFields } from "@/components/marketplace/sell/SellItemFormFields";
import { SellItemFormActions } from "@/components/marketplace/sell/SellItemFormActions";
import { useSellItemForm } from "@/hooks/useSellItemForm";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { isAuthenticated } from "@/utils/auth/authState";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const SellItemPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { 
    imageUrl, 
    isSubmitting, 
    register, 
    errors, 
    handleSubmit,
    onSubmit, 
    handleImageSelect,
    handleSelectChange 
  } = useSellItemForm();

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to sell items."
      });
      navigate('/sign-in');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isMobile ? <MobileNav /> : <Navbar />}
      <main className="container mx-auto px-4 py-8 pt-20 flex-grow">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Sell Your Plushie</h1>
          
          <Card className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <SellItemImageUploader 
                imageUrl={imageUrl} 
                onImageSelect={handleImageSelect} 
              />

              <SellItemFormFields
                register={register}
                errors={errors}
                onSelectChange={handleSelectChange}
              />

              <SellItemFormActions isSubmitting={isSubmitting} />
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellItemPage;

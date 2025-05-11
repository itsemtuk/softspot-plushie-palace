
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { SellItemImageUploader } from "@/components/marketplace/sell/SellItemImageUploader";
import { SellItemFormFields } from "@/components/marketplace/sell/SellItemFormFields";
import { SellItemFormActions } from "@/components/marketplace/sell/SellItemFormActions";
import { useSellItemForm } from "@/hooks/useSellItemForm";

const SellItemPage = () => {
  const isMobile = useIsMobile();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      <main className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Sell Your Plushie</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellItemPage;

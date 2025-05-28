
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SellItemImageUploader } from "./SellItemImageUploader";
import { SellItemFormFields } from "./SellItemFormFields";
import { SellItemFormActions } from "./SellItemFormActions";
import { SellItemErrorDisplay } from "./SellItemErrorDisplay";
import { useSellItemForm } from "@/hooks/useSellItemForm";
import { Spinner } from "@/components/ui/spinner";

interface SellItemFormWrapperProps {
  supabaseUserId?: string | null;
}

export const SellItemFormWrapper = ({ supabaseUserId }: SellItemFormWrapperProps) => {
  const formValues = useSellItemForm();

  // Show loading while form is initializing
  if (!formValues) {
    return (
      <Card className="rounded-xl bg-white shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100">
          <CardTitle className="text-2xl font-bold">Sell Your Plushie</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="flex justify-center items-center p-8">
            <Spinner size="md" />
            <span className="ml-3 text-sm text-gray-500">Loading form...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { 
    imageUrl, 
    isSubmitting, 
    register,
    errors, 
    handleSubmit,
    onSubmit, 
    handleImageSelect,
    handleSelectChange 
  } = formValues;

  // Safe form submit handler
  const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    
    if (handleSubmit && onSubmit) {
      const submitFunction = handleSubmit(onSubmit);
      submitFunction(e);
    }
  };

  return (
    <Card className="rounded-xl bg-white shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100">
        <CardTitle className="text-2xl font-bold">Sell Your Plushie</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={formSubmitHandler} className="space-y-6">
          <SellItemImageUploader 
            imageUrl={imageUrl || ""} 
            onImageSelect={handleImageSelect || (() => {})} 
          />

          <SellItemFormFields
            register={register}
            errors={errors || {}}
            onSelectChange={handleSelectChange || (() => {})}
          />

          <SellItemFormActions 
            isSubmitting={isSubmitting || false} 
            supabaseUserId={supabaseUserId}
          />
        </form>
      </CardContent>
    </Card>
  );
};

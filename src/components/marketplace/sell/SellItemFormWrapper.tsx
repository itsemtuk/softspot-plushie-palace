
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
  console.log("SellItemFormWrapper: Rendering with supabaseUserId:", supabaseUserId);
  
  const formValues = useSellItemForm();

  console.log("SellItemFormWrapper: Form values received:", {
    hasFormValues: !!formValues,
    formKeys: formValues ? Object.keys(formValues) : []
  });

  // Show loading while form is initializing
  if (!formValues) {
    console.log("SellItemFormWrapper: No form values, showing loading");
    return (
      <Card className="rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100 dark:from-purple-900 dark:to-softspot-900">
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

  console.log("SellItemFormWrapper: Destructured form values:", {
    hasRegister: !!register,
    hasHandleSubmit: !!handleSubmit,
    hasOnSubmit: !!onSubmit,
    hasErrors: !!errors,
    imageUrl: imageUrl?.substring(0, 50) + "..."
  });

  // Additional null checks for safety
  if (!register || !handleSubmit || !onSubmit) {
    console.log("SellItemFormWrapper: Missing critical form methods");
    return (
      <Card className="rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100 dark:from-purple-900 dark:to-softspot-900">
          <CardTitle className="text-2xl font-bold">Sell Your Plushie</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <SellItemErrorDisplay 
            error="Form is not properly initialized. Please refresh the page and try again." 
          />
        </CardContent>
      </Card>
    );
  }

  // Safe form submit handler
  const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log("SellItemFormWrapper: Form submitted");
    
    try {
      if (handleSubmit && onSubmit) {
        const submitFunction = handleSubmit(onSubmit);
        if (typeof submitFunction === 'function') {
          submitFunction(e);
        }
      } else {
        console.error("SellItemFormWrapper: Missing handleSubmit or onSubmit");
      }
    } catch (error) {
      console.error("SellItemFormWrapper: Form submission error:", error);
    }
  };

  return (
    <Card className="rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100 dark:from-purple-900 dark:to-softspot-900">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Sell Your Plushie</CardTitle>
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

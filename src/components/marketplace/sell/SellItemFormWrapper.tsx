
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { SellItemImageUploader } from "./SellItemImageUploader";
import { SellItemFormFields } from "./SellItemFormFields";
import { SellItemFormActions } from "./SellItemFormActions";
import { SellItemErrorDisplay } from "./SellItemErrorDisplay";
import { useSellItemForm } from "@/hooks/useSellItemForm";

interface SellItemFormWrapperProps {
  supabaseUserId?: string | null;
}

// Local interface that matches the form fields exactly
interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  deliveryCost: string;
  condition: string;
  material: string;
  color: string;
  brand: string;
  species: string;
  size: string;
  filling: string;
  tags: string[];
  location: string;
  deliveryMethod: string;
}

export const SellItemFormWrapper = ({ supabaseUserId }: SellItemFormWrapperProps) => {
  const [formError, setFormError] = useState<string | null>(null);
  
  const formValues = useSellItemForm();

  // Enhanced null checking with specific guards
  const isFormReady = formValues && 
                     typeof formValues.register === 'function' && 
                     typeof formValues.handleSubmit === 'function' && 
                     typeof formValues.onSubmit === 'function';

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

  // Enhanced form validation - wait for form to be completely ready
  if (!isFormReady) {
    return null; // Let parent handle loading state
  }

  // Safe form submit handler with enhanced error handling
  const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    
    try {
      // Triple-check all required functions exist before calling
      if (!handleSubmit || typeof handleSubmit !== 'function') {
        throw new Error("Form submission handler not available");
      }
      
      if (!onSubmit || typeof onSubmit !== 'function') {
        throw new Error("Form submission callback not available");
      }

      // Execute the form submission - onSubmit already has correct type
      const submitFunction = handleSubmit(onSubmit as any);
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
    <Card className="rounded-xl bg-white shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100">
        <CardTitle className="text-2xl font-bold">Sell Your Plushie</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        {/* Form error display */}
        {formError && (
          <SellItemErrorDisplay 
            error={formError} 
            onDismiss={() => setFormError(null)} 
          />
        )}
        
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
  );
};

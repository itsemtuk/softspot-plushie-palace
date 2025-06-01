import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafeComponentWrapper } from "@/components/ui/safe-component-wrapper";
import { SellItemImageUploader } from "./SellItemImageUploader";
import { SellItemFormFields } from "./SellItemFormFields";
import { SellItemFormActions } from "./SellItemFormActions";
import { useSellItemForm } from "@/hooks/useSellItemForm";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { SellItemFormValidation } from "./SellItemFormValidation";

interface SafeSellItemFormProps {
  supabaseUserId?: string | null;
}

export const SafeSellItemForm: React.FC<SafeSellItemFormProps> = ({ supabaseUserId }) => {
  const formValues = useSellItemForm();

  // Loading state
  if (!formValues) {
    return (
      <Card className="rounded-xl bg-white shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100">
          <CardTitle className="text-2xl font-bold">Sell Your Plushie</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center p-8">
            <Spinner size="md" />
            <span className="ml-3 text-sm text-gray-500">Initializing form...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    imageUrl = "",
    isSubmitting = false,
    register,
    errors = {},
    handleSubmit,
    onSubmit,
    handleImageSelect,
    handleSelectChange
  } = formValues;

  // Validate required form methods
  if (!register || !handleSubmit || !onSubmit) {
    return (
      <Card className="rounded-xl bg-white shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100">
          <CardTitle className="text-2xl font-bold">Sell Your Plushie</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Form is not properly initialized. Please refresh the page and try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Safe form submit handler
  const formSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    
    try {
      if (handleSubmit && onSubmit && typeof handleSubmit === 'function') {
        const submitFunction = handleSubmit(onSubmit);
        if (typeof submitFunction === 'function') {
          submitFunction(e);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Card className="rounded-xl bg-white shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100">
        <CardTitle className="text-2xl font-bold">Sell Your Plushie</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <SafeComponentWrapper resetKeys={[supabaseUserId]}>
          <form onSubmit={formSubmitHandler} className="space-y-6">
            <SellItemFormValidation errors={errors} isSubmitting={isSubmitting} />
            
            <SafeComponentWrapper>
              <SellItemImageUploader 
                imageUrl={imageUrl} 
                onImageSelect={handleImageSelect || (() => {})} 
              />
            </SafeComponentWrapper>

            <SafeComponentWrapper>
              <SellItemFormFields
                register={register}
                errors={errors}
                onSelectChange={handleSelectChange || (() => {})}
              />
            </SafeComponentWrapper>

            <SafeComponentWrapper>
              <SellItemFormActions 
                isSubmitting={isSubmitting} 
                supabaseUserId={supabaseUserId}
              />
            </SafeComponentWrapper>
          </form>
        </SafeComponentWrapper>
      </CardContent>
    </Card>
  );
};

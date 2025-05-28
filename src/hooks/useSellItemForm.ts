
import { useSellItemFormSetup } from "./sell-item/useSellItemFormSetup";
import { useSellItemImage } from "./sell-item/useSellItemImage";
import { useSellItemSubmission } from "./sell-item/useSellItemSubmission";
import { SellItemFormData } from "@/types/sellItemForm";

export const useSellItemForm = () => {
  const {
    formInitialized,
    formError,
    register,
    handleSubmit,
    errors,
    handleSelectChange
  } = useSellItemFormSetup();

  const { imageUrl, handleImageSelect } = useSellItemImage();
  const { isSubmitting, handleSubmit: submitForm } = useSellItemSubmission();

  const onSubmit = async (data: SellItemFormData) => {
    await submitForm(data);
  };

  // Enhanced return with comprehensive validation
  if (formError) {
    console.error("SellItemForm: Form error:", formError);
    return null;
  }

  if (!formInitialized || !register || !handleSubmit) {
    console.log("SellItemForm: Form not yet initialized", { 
      formInitialized, 
      hasRegister: !!register, 
      hasHandleSubmit: !!handleSubmit
    });
    return null;
  }

  // Return form methods with type safety
  return {
    imageUrl,
    isSubmitting,
    register,
    errors,
    handleSubmit,
    onSubmit,
    handleImageSelect,
    handleSelectChange
  };
};

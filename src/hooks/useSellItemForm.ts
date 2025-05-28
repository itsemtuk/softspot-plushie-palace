
import { useSellItemFormSetup } from "./sell-item/useSellItemFormSetup";
import { useSellItemImage } from "./sell-item/useSellItemImage";
import { useSellItemSubmission } from "./sell-item/useSellItemSubmission";

// Use the interface from marketplace types to match the submission hook
interface SellItemFormData {
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
    // Convert the form data to match the submission interface
    const submissionData = {
      ...data,
      imageUrl: imageUrl || data.imageUrl || '',
      tags: data.tags || [],
      location: data.location || '',
      size: data.size || 'medium'
    };
    await submitForm(submissionData);
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

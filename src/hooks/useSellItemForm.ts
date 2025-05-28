
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

  // Return null/loading state if form is not ready
  if (!formInitialized || formError || !register || !handleSubmit) {
    console.log("useSellItemForm: Form not ready", { 
      formInitialized, 
      formError,
      hasRegister: !!register, 
      hasHandleSubmit: !!handleSubmit
    });
    return null;
  }

  const onSubmit = async (data: SellItemFormData) => {
    // Ensure all required fields are present with proper defaults
    const submissionData: SellItemFormData = {
      title: data.title || '',
      description: data.description || '',
      image: imageUrl || data.image || '',
      imageUrl: imageUrl || data.imageUrl || '',
      price: data.price || 0,
      deliveryCost: data.deliveryCost || 0,
      condition: data.condition || 'good',
      material: data.material || 'plush',
      color: data.color || '',
      brand: data.brand || '',
      species: data.species || 'other',
      size: data.size || 'medium',
      filling: data.filling || 'polyester',
      tags: data.tags || [],
      location: data.location || '',
      deliveryMethod: data.deliveryMethod || 'shipping'
    };
    
    await submitForm(submissionData);
  };

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

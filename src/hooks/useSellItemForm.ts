
import { useSellItemFormSetup } from "./sell-item/useSellItemFormSetup";
import { useSellItemImage } from "./sell-item/useSellItemImage";
import { useSellItemSubmission } from "./sell-item/useSellItemSubmission";
import { SellItemFormData } from "@/types/sellItemForm";

export const useSellItemForm = () => {
  console.log("useSellItemForm: Initializing main hook");
  
  const setupResult = useSellItemFormSetup();
  const imageResult = useSellItemImage();
  const submissionResult = useSellItemSubmission();

  console.log("useSellItemForm: Hook results", { 
    setupResult: !!setupResult, 
    imageResult: !!imageResult, 
    submissionResult: !!submissionResult 
  });

  // Early return with null check
  if (!setupResult || !imageResult || !submissionResult) {
    console.log("useSellItemForm: One or more hooks not ready");
    return null;
  }

  const {
    formInitialized,
    formError,
    register,
    handleSubmit,
    errors,
    handleSelectChange
  } = setupResult;

  const { imageUrl, handleImageSelect } = imageResult;
  const { isSubmitting, handleSubmit: submitForm } = submissionResult;

  // Return null/loading state if form is not ready
  if (!formInitialized || formError) {
    console.log("useSellItemForm: Form not ready", { 
      formInitialized, 
      formError
    });
    return null;
  }

  // Additional safety check for form methods
  if (!register || !handleSubmit) {
    console.log("useSellItemForm: Form methods not available", { 
      hasRegister: !!register, 
      hasHandleSubmit: !!handleSubmit
    });
    return null;
  }

  const onSubmit = async (data: SellItemFormData) => {
    console.log("useSellItemForm: Submitting form", data);
    
    // Ensure all required fields are present with proper defaults
    const submissionData: SellItemFormData = {
      title: data.title || '',
      description: data.description || '',
      image: imageUrl || data.image || '',
      imageUrl: imageUrl || data.imageUrl || '',
      price: data.price || 0,
      deliveryCost: data.deliveryCost || 0,
      condition: data.condition || 'new',
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
    errors: errors || {},
    handleSubmit,
    onSubmit,
    handleImageSelect,
    handleSelectChange
  };
};

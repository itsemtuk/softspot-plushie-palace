
import { useSellItemFormSetup } from "./sell-item/useSellItemFormSetup";
import { useSellItemImage } from "./sell-item/useSellItemImage";
import { useSellItemSubmission } from "./sell-item/useSellItemSubmission";

// Unified interface that matches what the submission hook expects
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
    // Ensure all required fields are present with proper defaults
    const submissionData: SellItemFormData = {
      title: data.title || '',
      description: data.description || '',
      imageUrl: imageUrl || data.imageUrl || '',
      price: data.price || '0',
      deliveryCost: data.deliveryCost || '0',
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

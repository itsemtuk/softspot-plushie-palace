
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ExtendedPost, MarketplacePlushie } from '@/types/marketplace';
import { getLocalPosts, getMarketplaceListings, saveMarketplaceListings } from '@/utils/storage/localStorageUtils';

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

export const useSellItemSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: SellItemFormData): Promise<void> => {
    setIsSubmitting(true);
    try {
      console.log('Submitting sell item form:', formData);
      
      // Create a unique ID for the new post
      const newId = `post-${Date.now()}`;
      
      // Prepare the post data according to ExtendedPost interface
      const newPost: ExtendedPost = {
        id: newId,
        userId: "current-user",
        user_id: "current-user", // Added for compatibility
        username: "Current User",
        content: formData.description || '', // Added required content field
        image: formData.imageUrl || '',
        title: formData.title,
        description: formData.description,
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(), // Added for compatibility
        updatedAt: new Date().toISOString(),
        location: formData.location || '',
        forSale: true,
        tags: formData.tags || [],
        condition: formData.condition || '',
        material: formData.material || '',
        color: formData.color || '',
        price: parseFloat(formData.price) || 0,
        deliveryCost: parseFloat(formData.deliveryCost) || 0,
        sold: false // Added marketplace functionality
      };

      // Create marketplace plushie data with all required fields
      const marketplacePlushie: MarketplacePlushie = {
        ...newPost,
        name: formData.title, // Added required name field
        imageUrl: formData.imageUrl, // Added required imageUrl field
        description: formData.description || '', // Ensure description is required
        condition: formData.condition || '', // Ensure condition is included
        species: formData.species || 'other',
        size: formData.size || 'medium',
        filling: formData.filling || 'polyester',
        brand: formData.brand || '',
        deliveryMethod: formData.deliveryMethod || 'shipping',
        price: parseFloat(formData.price) || 0 // Ensure price is explicitly set
      };

      // Save to local storage
      const existingListings = getMarketplaceListings();
      const updatedListings = [marketplacePlushie, ...existingListings];
      saveMarketplaceListings(updatedListings);

      // Show success message
      toast({
        title: "Success!",
        description: "Your plushie has been listed in the marketplace.",
      });

      // Navigate to marketplace
      navigate('/marketplace');
    } catch (error) {
      console.error('Error submitting sell item form:', error);
      toast({
        title: "Error",
        description: "Failed to list your plushie. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    submitForm: handleSubmit
  };
};

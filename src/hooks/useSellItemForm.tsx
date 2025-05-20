
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { 
  ImageUploadResult, 
  PlushieCondition,
  PlushieMaterial,
  PlushieFilling,
  PlushieSpecies,
  DeliveryMethod,
  ExtendedPost
} from "@/types/marketplace";
import { saveMarketplaceListings, getMarketplaceListings, getCurrentUserId, setCurrentUserId } from "@/utils/storage/localStorageUtils";
import { addPost } from "@/utils/posts/postManagement";

export interface SellItemFormData {
  title: string;
  price: number;
  description: string;
  condition: PlushieCondition;
  material: PlushieMaterial;
  filling: PlushieFilling;
  species: PlushieSpecies;
  brand: string;
  deliveryMethod: DeliveryMethod;
  deliveryCost: number;
  color: string;
  image: string;
}

export const useSellItemForm = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SellItemFormData>();

  // Get current user ID safely
  const currentUserId = getCurrentUserId();
  
  // Store current user ID for syncing if available
  if (currentUserId) {
    setCurrentUserId(currentUserId);
  }

  const handleImageSelect = (result: ImageUploadResult) => {
    if (result.success && result.url) {
      setImageUrl(result.url);
    } else {
      toast({
        title: "Upload failed",
        description: result.error || "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  const handleSelectChange = (field: keyof SellItemFormData, value: any) => {
    setValue(field, value);
  };

  const onSubmit = async (data: SellItemFormData) => {
    // Set submission state to prevent multiple clicks
    setIsSubmitting(true);
    
    // Check for required image
    if (!imageUrl) {
      toast({
        title: "Image required",
        description: "Please upload an image of your plushie.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Add the image URL to the form data
      const listingData = { ...data, image: imageUrl };
      
      // Get existing listings
      const listings = getMarketplaceListings();
      
      // Get user info safely
      const userId = currentUserId || 'anonymous-user';
      const username = 'Anonymous User';
      const timestamp = new Date().toISOString();
      
      const newListing: ExtendedPost = {
        ...listingData,
        id: `listing-${Date.now()}`,
        userId: userId,
        username: username,
        likes: 0,
        comments: 0,
        timestamp: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
        location: "",
        forSale: true,
        tags: [],
        condition: data.condition,
        material: data.material,
        color: data.color,
        deliveryCost: data.deliveryCost || 0
      };
      
      console.log("Creating new listing:", newListing);
      
      // Add the new listing and save
      listings.unshift(newListing as any); // Use type assertion to bypass the type check
      saveMarketplaceListings(listings);
      
      // Also add to regular posts to make it appear in profile
      await addPost({
        ...newListing,
        id: `post-${Date.now()}`,
      });
      
      // Show success message
      toast({
        title: "Listing created!",
        description: "Your item has been listed for sale.",
      });
      
      // Directly navigate instead of using setTimeout
      navigate('/marketplace');
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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


import { useState, useEffect } from "react";
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
import { useUser } from "@clerk/clerk-react";

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

export const useSellItemFormFixed = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  
  // Initialize form immediately - don't wait for user
  const form = useForm<SellItemFormData>({
    mode: "onChange",
    defaultValues: {
      title: '',
      price: 0,
      description: '',
      deliveryCost: 0,
      color: '',
      condition: 'new' as PlushieCondition,
      material: 'plush' as PlushieMaterial,
      filling: 'polyester' as PlushieFilling,
      species: 'bear' as PlushieSpecies,
      brand: 'other',
      deliveryMethod: 'shipping' as DeliveryMethod,
      image: '',
    }
  });

  const { register, handleSubmit, setValue, formState, reset } = form;
  const errors = formState?.errors || {};
  
  useEffect(() => {
    console.log("SellItemForm: Initializing form, user loaded:", isClerkLoaded, "user:", clerkUser?.id);
    
    try {
      // Handle user ID when available
      const currentUserId = clerkUser?.id || getCurrentUserId();
      if (currentUserId) {
        setCurrentUserId(currentUserId);
      }
    } catch (error) {
      console.error("Error in form initialization:", error);
      toast({
        variant: "destructive",
        title: "Form Error",
        description: "There was an issue initializing the form. Please refresh the page.",
      });
    }
  }, [clerkUser, isClerkLoaded]);

  const handleImageSelect = (result: ImageUploadResult) => {
    console.log("SellItemForm: Image selected:", result);
    if (!result) return;
    
    if (result?.success && result?.url) {
      setImageUrl(result.url);
    } else {
      toast({
        title: "Upload failed",
        description: (result?.error) || "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  const handleSelectChange = (field: keyof SellItemFormData, value: any) => {
    console.log("SellItemForm: Select change:", field, value);
    if (!setValue || !field || value === undefined) return;
    
    try {
      setValue(field, value);
    } catch (error) {
      console.error("Error setting form value:", error);
    }
  };

  const onSubmit = async (data: SellItemFormData) => {
    console.log("SellItemForm: Submit started", data);
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!imageUrl) {
        toast({
          title: "Image required",
          description: "Please upload an image of your plushie.",
          variant: "destructive"
        });
        return;
      }
      
      // Check authentication
      if (!clerkUser?.id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a listing.",
          variant: "destructive"
        });
        navigate('/sign-in');
        return;
      }
      
      // Create listing data
      const listingData = { ...data, image: imageUrl };
      const listings = getMarketplaceListings() || [];
      
      const userId = clerkUser.id;
      const username = clerkUser.username || clerkUser.firstName || 'Anonymous User';
      const timestamp = new Date().toISOString();
      
      const newListing: ExtendedPost = {
        ...listingData,
        id: `listing-${Date.now()}`,
        userId: userId,
        username: username as string,
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
        color: data.color || '',
        deliveryCost: data.deliveryCost || 0
      };
      
      console.log("Creating new listing:", newListing);
      
      // Save listing
      listings.unshift(newListing as any);
      saveMarketplaceListings(listings);
      
      // Add to posts
      await addPost({
        ...newListing,
        id: `post-${Date.now()}`,
      });
      
      toast({
        title: "Listing created!",
        description: "Your item has been listed for sale.",
      });
      
      // Navigate to marketplace
      setTimeout(() => {
        navigate('/marketplace');
      }, 100);
      
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

  // Always return valid form methods - never null
  return {
    imageUrl,
    isSubmitting,
    register: register || (() => {}),
    errors,
    handleSubmit: handleSubmit || (() => () => {}),
    onSubmit,
    handleImageSelect,
    handleSelectChange
  };
};

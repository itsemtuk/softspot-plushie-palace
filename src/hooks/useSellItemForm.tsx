
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

export const useSellItemForm = () => {
  try {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormInitialized, setIsFormInitialized] = useState(false);
    // Add Clerk user
    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
    
    // Initialize form with safe defaults
    const form = useForm<SellItemFormData>({
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

    const { register, handleSubmit, setValue, formState } = form;
    const errors = formState?.errors || {};
    
    useEffect(() => {
      // Wait for Clerk to load before initializing form
      if (!isClerkLoaded) {
        return;
      }
      
      // Mark form as initialized after first render
      setIsFormInitialized(true);
      
      // Get current user ID safely - prefer Clerk user ID if available
      const currentUserId = clerkUser?.id || getCurrentUserId();
      
      // Store current user ID for syncing if available
      if (currentUserId) {
        setCurrentUserId(currentUserId);
      }
    }, [clerkUser, isClerkLoaded]);

    // If form is not initialized or Clerk is not loaded, return empty object with defaults
    if (!isFormInitialized || !isClerkLoaded) {
      return {
        imageUrl: "",
        isSubmitting: false,
        register: null,
        errors: {},
        handleSubmit: null, 
        onSubmit: null,
        handleImageSelect: null,
        handleSelectChange: null
      };
    }

    const handleImageSelect = (result: ImageUploadResult) => {
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
      if (!setValue || !field || value === undefined) return;
      setValue(field, value);
    };

    const onSubmit = async (data: SellItemFormData) => {
      // Set submission state to prevent multiple clicks
      setIsSubmitting(true);
      
      try {
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
        
        // Check for authenticated user
        if (!clerkUser) {
          toast({
            title: "Authentication required",
            description: "Please sign in to create a listing.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          navigate('/sign-in');
          return;
        }
        
        // Add the image URL to the form data
        const listingData = { ...data, image: imageUrl };
        
        // Get existing listings
        const listings = getMarketplaceListings() || [];
        
        // Get user info safely - prefer Clerk user if available
        const userId = clerkUser?.id || getCurrentUserId() || 'anonymous-user';
        const username = clerkUser?.username || clerkUser?.firstName || 'Anonymous User';
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
        
        // Navigate after a short delay
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
  } catch (error) {
    console.error("Error in useSellItemForm:", error);
    // Return safe defaults if hook initialization fails
    return {
      imageUrl: "",
      isSubmitting: false,
      register: null,
      errors: {},
      handleSubmit: null,
      onSubmit: null, 
      handleImageSelect: null,
      handleSelectChange: null
    };
  }
};

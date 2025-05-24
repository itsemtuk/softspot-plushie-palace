
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
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  
  // Initialize form with proper error handling
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
    // Wait for Clerk to load and initialize form properly
    if (!isClerkLoaded) {
      return;
    }
    
    try {
      // Reset form to ensure clean state
      reset({
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
      });
      
      // Mark form as initialized
      setIsFormInitialized(true);
      
      // Handle user ID
      const currentUserId = clerkUser?.id || getCurrentUserId();
      if (currentUserId) {
        setCurrentUserId(currentUserId);
      }
    } catch (error) {
      console.error("Error initializing form:", error);
      toast({
        variant: "destructive",
        title: "Form Error",
        description: "There was an issue initializing the form. Please refresh the page.",
      });
    }
  }, [clerkUser, isClerkLoaded, reset]);

  // Return loading state if not ready
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
    
    try {
      setValue(field, value);
    } catch (error) {
      console.error("Error setting form value:", error);
    }
  };

  const onSubmit = async (data: SellItemFormData) => {
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

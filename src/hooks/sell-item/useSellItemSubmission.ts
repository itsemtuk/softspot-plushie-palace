
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { SellItemFormData } from "@/types/sellItemForm";
import { ExtendedPost } from "@/types/marketplace";
import { saveMarketplaceListings, getMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { addPost } from "@/utils/posts/postManagement";

export const useSellItemSubmission = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: clerkUser } = useUser();

  const submitForm = async (data: SellItemFormData, imageUrl: string) => {
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
      
      // Save listing to marketplace
      listings.unshift(newListing as any);
      saveMarketplaceListings(listings);
      
      // Add to posts with proper user context
      await addPost({
        ...newListing,
        id: `post-${Date.now()}`,
      }, userId);
      
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
    isSubmitting,
    submitForm
  };
};

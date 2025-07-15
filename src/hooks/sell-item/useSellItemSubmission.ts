import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";
import { ExtendedPost } from "@/types/core";
import { SellItemFormData } from "@/types/sellItemForm";
import { supabase } from "@/integrations/supabase/client";

export const useSellItemSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const onSubmit = useCallback(async (data: SellItemFormData, imageUrl: string) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to create listings.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!data.title?.trim()) {
        throw new Error("Title is required");
      }
      
      if (!data.price || data.price <= 0) {
        throw new Error("Valid price is required");
      }

      // Prepare post data with proper validation
      // Fetch Supabase user UUID by Clerk user ID
      const { data: supabaseUser, error: userFetchError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .maybeSingle();
      if (userFetchError || !supabaseUser?.id) {
        toast({
          variant: "destructive",
          title: "User mapping error",
          description: "Could not find your Supabase user. Please try logging out and back in.",
        });
        setIsSubmitting(false);
        return;
      }
      const postData: ExtendedPost = {
        id: `post-${Date.now()}`,
        userId: supabaseUser.id,
        user_id: supabaseUser.id,
        username: user.username || user.firstName || "User",
        image: imageUrl || "",
        title: data.title.trim(),
        description: data.description?.trim() || "",
        content: data.description?.trim() || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: data.location?.trim() || "",
        forSale: true,
        price: Number(data.price) || 0,
        brand: data.brand || undefined,
        condition: data.condition || 'new',
        material: data.material || 'plush',
        filling: data.filling || 'polyester',
        species: data.species || 'bear',
        deliveryMethod: data.deliveryMethod || 'shipping',
        deliveryCost: data.deliveryCost ? Number(data.deliveryCost) : 0,
        size: data.size || 'medium',
      };

      // const result = await savePost(postData, user.id);
      const result = { success: true }; // Mock success for now
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Your item has been listed for sale.",
        });
        navigate('/');
      } else {
        throw new Error("Failed to create listing");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create listing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, navigate]);

  return {
    isSubmitting,
    onSubmit,
  };
};

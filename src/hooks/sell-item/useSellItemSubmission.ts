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

  const onSubmit = useCallback(
  async (data: SellItemFormData, imageFile?: File) => {
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

      // Upload image file if provided
      let imageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `sellitem-${user.id}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(fileName, imageFile);
        if (uploadError) {
          throw new Error('Image upload failed: ' + uploadError.message);
        }
        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(fileName);
        imageUrl = publicUrlData?.publicUrl || '';
      }

      // Prepare post data
      const postData = {
        content: `${data.title}\n\n${data.description}`,
        user_id: supabaseUser.id,
        title: data.title,
        description: data.description,
        image: imageUrl,
        price: data.price,
        brand: data.brand || null,
        condition: data.condition,
        material: data.material || null,
        filling: data.filling || null,
        species: data.species || null,
        delivery_method: data.deliveryMethod,
        delivery_cost: data.deliveryCost || null,
        size: data.size || null,
        color: data.color || null,
        for_sale: true,
        tags: [],
        created_at: new Date().toISOString(),
      };

      // Insert post into Supabase
      const { data: result, error } = await supabase
        .from('posts')
        .insert([postData])
        .select();

      if (error) {
        throw new Error(error.message || 'Failed to create listing');
      }

      toast({
        title: 'Item listed successfully!',
        description: 'Your plushie has been added to the marketplace.',
      });
      navigate('/marketplace');
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

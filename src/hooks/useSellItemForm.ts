
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { uploadImage } from "@/utils/storage/imageStorage";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";

const sellItemSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  brand: z.string().optional(),
  condition: z.enum(["new", "used", "like new"]),
  material: z.string().optional(),
  filling: z.string().optional(),
  species: z.string().optional(),
  deliveryMethod: z.enum(["shipping", "local pickup", "both"]),
  deliveryCost: z.number().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
});

export type SellItemFormData = z.infer<typeof sellItemSchema>;

export const useSellItemForm = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const { supabaseUserId } = useClerkSupabaseUser(user);
  const navigate = useNavigate();

  const form = useForm<SellItemFormData>({
    resolver: zodResolver(sellItemSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      brand: "",
      condition: "new",
      material: "",
      filling: "",
      species: "",
      deliveryMethod: "shipping",
      deliveryCost: 0,
      size: "",
      color: "",
    },
  });

  const handleImageSelect = async (file: File | null) => {
    if (!file) {
      setImageUrl("");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          const imageId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const result = await uploadImage(dataUrl, imageId);
          if (result.imageUrl) {
            setImageUrl(result.imageUrl);
          } else {
            toast({
              variant: "destructive",
              title: "Upload failed",
              description: result.error || "Failed to upload image",
            });
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload error",
        description: "An unexpected error occurred while uploading the image",
      });
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    form.setValue(field as keyof SellItemFormData, value);
  };

  const onSubmit: SubmitHandler<SellItemFormData> = async (data) => {
    if (!user || !supabaseUserId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to sell items",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting form data:", data);
      console.log("Using Supabase user ID:", supabaseUserId);
      
      // Create the post object for Supabase using the Supabase user ID
      const postData = {
        content: `${data.title}\n\n${data.description}`,
        user_id: supabaseUserId,
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
        created_at: new Date().toISOString(),
      };

      console.log("Inserting into Supabase:", postData);

      const { data: result, error } = await supabase
        .from('posts')
        .insert([postData])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        toast({
          variant: "destructive",
          title: "Failed to list item",
          description: error.message || "Please try again",
        });
        return;
      }

      console.log("Successfully created post:", result);
      
      toast({
        title: "Item listed successfully!",
        description: "Your plushie has been added to the marketplace.",
      });
      
      form.reset();
      setImageUrl("");
      
      // Don't navigate immediately, stay on the form to show success
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    imageUrl,
    isSubmitting,
    register: form.register,
    handleSubmit: form.handleSubmit,
    onSubmit,
    errors: form.formState.errors,
    handleImageSelect,
    handleSelectChange,
  };
};

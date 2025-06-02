import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { addPost } from "@/utils/posts/postManagement";
import { uploadImage } from "@/utils/storage/imageStorage";
import { getCurrentUserId } from "@/utils/storage/localStorageUtils";

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
      const result = await uploadImage(file);
      if (result.success && result.url) {
        setImageUrl(result.url);
      } else {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: result.error || "Failed to upload image",
        });
      }
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
    setIsSubmitting(true);

    try {
      const userId = getCurrentUserId();
      if (!userId) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to sell items",
        });
        return;
      }

      const postData = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        user_id: userId,
        username: "Current User",
        image: imageUrl,
        title: data.title,
        description: data.description,
        content: data.description,
        tags: [data.brand, data.condition, data.material].filter(Boolean),
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        forSale: true,
        price: data.price,
        brand: data.brand,
        condition: data.condition,
        material: data.material,
        filling: data.filling,
        species: data.species,
        deliveryMethod: data.deliveryMethod,
        deliveryCost: data.deliveryCost,
        size: data.size,
        color: data.color,
      };

      const result = await addPost(postData);
      
      if (result.success) {
        toast({
          title: "Item listed successfully!",
          description: "Your plushie has been added to the marketplace.",
        });
        form.reset();
        setImageUrl("");
      } else {
        toast({
          variant: "destructive",
          title: "Failed to list item",
          description: result.error || "Please try again",
        });
      }
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

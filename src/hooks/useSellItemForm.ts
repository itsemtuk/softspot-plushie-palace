
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/clerk-react";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface FormData {
  title: string;
  description: string;
  price: string;
  condition: string;
  brand: string;
  material: string;
  filling: string;
  species: string;
  deliveryMethod: string;
  deliveryCost: string;
  size: string;
  color: string;
  image: string;
}

export const useSellItemForm = () => {
  const { user } = useUser();
  const { supabaseUserId } = useClerkSupabaseUser(user);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    condition: "",
    brand: "",
    material: "",
    filling: "",
    species: "",
    deliveryMethod: "",
    deliveryCost: "",
    size: "",
    color: "",
    image: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    defaultValues: formData
  });

  const handleImageSelect = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFormData(prev => ({ ...prev, image: url }));
      setValue("image", url);
    }
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValue(field, value);
  };

  const onSubmit = async (data: FormData) => {
    
    if (!user || !supabaseUserId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to sell items."
      });
      return;
    }

    if (!data.title || !data.price || !data.condition || !data.brand) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        id: `marketplace-${Date.now()}`,
        user_id: supabaseUserId,
        title: data.title,
        description: data.description,
        content: data.description || data.title,
        image: imageUrl || null,
        price: parseFloat(data.price),
        brand: data.brand,
        condition: data.condition,
        material: data.material || null,
        filling: data.filling || null,
        species: data.species || null,
        delivery_method: data.deliveryMethod || null,
        delivery_cost: data.deliveryCost ? parseFloat(data.deliveryCost) : null,
        size: data.size || null,
        color: data.color || null,
        for_sale: true, // Ensure this is set to true for marketplace items
        created_at: new Date().toISOString()
      };

      console.log('Submitting marketplace item:', postData);

      const { data: result, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single();

      if (error) {
        console.error("Error creating marketplace listing:", error);
        throw error;
      }

      console.log('Marketplace item created successfully:', result);

      toast({
        title: "Success!",
        description: "Your item has been listed for sale."
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        condition: "",
        brand: "",
        material: "",
        filling: "",
        species: "",
        deliveryMethod: "",
        deliveryCost: "",
        size: "",
        color: "",
        image: ""
      });
      setImageUrl("");

      setIsSubmitting(false);
      
      // Navigate to marketplace
      window.location.href = '/marketplace';
      
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create listing. Please try again."
      });
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit,
    onSubmit,
    register,
    errors,
    imageUrl,
    handleImageSelect,
    handleSelectChange
  };
};


import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";
import { supabase, createAuthenticatedSupabaseClient } from "@/integrations/supabase/client";
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
  const { getToken } = useAuth();
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
        description: "Please sign in to sell items.",
      });
      return;
    }

    // Validate Supabase user ID is a proper UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(supabaseUserId)) {
      console.error('Invalid Supabase user ID format:', supabaseUserId);
      toast({
        variant: "destructive",
        title: "Error",
        description: "User authentication failed (invalid user ID format). Please try logging out and back in.",
      });
      return;
    }

    console.log('Current user:', user);
    console.log('Supabase user ID:', supabaseUserId);
    console.log('Clerk user ID:', user.id);
    
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
      console.log('About to create listing with user_id:', supabaseUserId);
      console.log('Type of supabaseUserId:', typeof supabaseUserId);
      console.log('Is supabaseUserId a UUID?', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(supabaseUserId || ''));
      
      // Use regular supabase client instead of authenticated one to avoid Clerk ID override
      const listingData = {
        user_id: supabaseUserId, // This should be the UUID from Supabase
        title: data.title,
        description: data.description,
        image_urls: imageUrl ? [imageUrl] : [],
        price: parseFloat(data.price),
        brand: data.brand,
        condition: data.condition,
        listing_type: 'fixed_price',
        status: 'active'
      };

      console.log('Inserting listing data:', listingData);

      const { data: result, error } = await supabase
        .from('marketplace_listings')
        .insert([listingData])
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

import { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !supabaseUserId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to sell items."
      });
      return;
    }

    if (!formData.title || !formData.price || !formData.condition || !formData.brand) {
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
        title: formData.title,
        description: formData.description,
        content: formData.description || formData.title,
        image: formData.image || null,
        price: parseFloat(formData.price),
        brand: formData.brand,
        condition: formData.condition,
        material: formData.material || null,
        filling: formData.filling || null,
        species: formData.species || null,
        delivery_method: formData.deliveryMethod || null,
        delivery_cost: formData.deliveryCost ? parseFloat(formData.deliveryCost) : null,
        size: formData.size || null,
        color: formData.color || null,
        for_sale: true, // This is crucial - marks it as a marketplace item
        created_at: new Date().toISOString()
      };

      console.log('Submitting marketplace item:', postData);

      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single();

      if (error) {
        console.error("Error creating marketplace listing:", error);
        throw error;
      }

      console.log('Marketplace item created successfully:', data);

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
    handleSubmit
  };
};

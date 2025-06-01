
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";
import { SellItemFormData } from "@/types/sellItemForm";
import { setCurrentUserId } from "@/utils/storage/localStorageUtils";

export const useSellItemFormSetup = () => {
  const [formInitialized, setFormInitialized] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  
  // Initialize form with enhanced error handling
  const form = useForm<SellItemFormData>({
    mode: "onChange",
    defaultValues: {
      title: '',
      price: 0,
      description: '',
      deliveryCost: 0,
      color: '',
      condition: 'new',
      material: 'plush',
      filling: 'polyester',
      species: 'bear',
      brand: 'other',
      deliveryMethod: 'shipping',
      image: '',
      imageUrl: '',
      size: 'medium',
      tags: [],
      location: '',
    }
  });

  const { register, handleSubmit, setValue, formState } = form;
  const errors = formState?.errors || {};
  
  useEffect(() => {
    console.log("SellItemForm: Initializing form, user loaded:", isClerkLoaded, "user:", clerkUser?.id);
    
    const initializeForm = async () => {
      try {
        // Wait for Clerk to load
        if (!isClerkLoaded) {
          return;
        }
        
        // Handle user ID when available
        if (clerkUser?.id) {
          setCurrentUserId(clerkUser.id);
        }
        
        // Enhanced validation for form methods
        if (!register || typeof register !== 'function' || 
            !handleSubmit || typeof handleSubmit !== 'function' || 
            !setValue || typeof setValue !== 'function') {
          console.error("SellItemForm: Form methods not available or invalid type");
          setFormError("Form initialization failed - invalid methods");
          return;
        }
        
        // Add small delay to ensure React Hook Form is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Final validation before marking as initialized
        if (register && typeof register === 'function' && 
            handleSubmit && typeof handleSubmit === 'function' && 
            setValue && typeof setValue === 'function') {
          console.log("SellItemForm: Form successfully initialized");
          setFormInitialized(true);
          setFormError(null);
        } else {
          console.error("SellItemForm: Form methods validation failed after delay");
          setFormError("Form methods not properly initialized");
        }
        
      } catch (error) {
        console.error("Error in form initialization:", error);
        setFormError("Form initialization error occurred");
        toast({
          variant: "destructive",
          title: "Form Error",
          description: "There was an issue initializing the form. Please refresh the page.",
        });
      }
    };

    initializeForm();
  }, [clerkUser, isClerkLoaded, register, handleSubmit, setValue]);

  const handleSelectChange = (field: keyof SellItemFormData, value: any) => {
    console.log("SellItemForm: Select change:", field, value);
    
    // Enhanced safety checks
    if (!setValue || typeof setValue !== 'function' || !field || value === undefined) {
      console.warn("SellItemForm: Invalid setValue or parameters", { 
        hasSetValue: !!setValue, 
        setValueType: typeof setValue, 
        field, 
        value 
      });
      return;
    }
    
    try {
      setValue(field, value, { shouldValidate: true });
    } catch (error) {
      console.error("Error setting form value:", error);
      // Don't show toast for this as it might spam the user
    }
  };

  // Only return data when form is properly initialized
  if (!formInitialized || formError) {
    return {
      formInitialized: false,
      formError,
      register: null,
      handleSubmit: null,
      setValue: null,
      errors: {},
      handleSelectChange: () => {}
    };
  }

  return {
    formInitialized,
    formError,
    register,
    handleSubmit,
    setValue,
    errors,
    handleSelectChange
  };
};


import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { plushieTypes, plushieBrands } from "@/components/onboarding/onboardingData";
import * as z from "zod";

const profileFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  bio: z.string().max(160).optional(),
  plushieTypes: z.array(z.string()).optional().default([]),
  plushieBrands: z.array(z.string()).optional().default([]),
  profilePicture: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const useFallbackProfileSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Get saved profile data from localStorage
  const getSavedProfileData = () => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      return savedProfile ? JSON.parse(savedProfile) : null;
    } catch (e) {
      console.error("Error parsing saved profile:", e);
      return null;
    }
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      bio: "",
      profilePicture: "",
      plushieTypes: [],
      plushieBrands: [],
    },
  });

  const loadUserData = useCallback(() => {
    try {
      const userId = localStorage.getItem('currentUserId');
      if (!userId) return;
      
      const savedProfile = getSavedProfileData();
      const username = localStorage.getItem('currentUsername') || '';
      const profilePicture = localStorage.getItem('userAvatarUrl') || '';
      
      // Get interests from saved profile or use defaults
      const savedInterests = savedProfile?.interests || [];
      
      const existingTypeIDs = plushieTypes
        .filter(type => savedInterests.includes(type.label))
        .map(type => type.id);
      
      const existingBrandIDs = plushieBrands
        .filter(brand => savedInterests.includes(brand.label))
        .map(brand => brand.id);
      
      form.reset({
        username: username,
        bio: savedProfile?.bio || "",
        profilePicture: profilePicture,
        plushieTypes: existingTypeIDs,
        plushieBrands: existingBrandIDs,
      });
      
      console.log("Form reset with data:", {
        username,
        bio: savedProfile?.bio || "",
        profilePicture,
        plushieTypes: existingTypeIDs,
        plushieBrands: existingBrandIDs,
      });
    } catch (error) {
      console.error("Error loading user profile data:", error);
    }
  }, [form]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('currentUserId');
      if (!userId) {
        throw new Error("User not found");
      }
      
      console.log("Submitting profile data:", data);
      
      const selectedTypes = plushieTypes
        .filter(type => data.plushieTypes?.includes(type.id))
        .map(type => type.label);
      
      const selectedBrands = plushieBrands
        .filter(brand => data.plushieBrands?.includes(brand.id))
        .map(brand => brand.label);
      
      const plushieInterests = [...selectedTypes, ...selectedBrands];
      
      // Update localStorage
      localStorage.setItem('currentUsername', data.username);
      localStorage.setItem('userAvatarUrl', data.profilePicture || '');
      
      // Save full profile to localStorage
      localStorage.setItem('userProfile', JSON.stringify({
        bio: data.bio || "",
        interests: plushieInterests,
        onboardingCompleted: true,
      }));
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      // Reload form data after update
      loadUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw for component to handle
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
    loadUserData,
  };
};

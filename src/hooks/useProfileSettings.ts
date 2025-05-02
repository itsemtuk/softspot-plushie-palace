
import { useFallbackProfileSettings } from "./useFallbackProfileSettings";

export const useProfileSettings = () => {
  const isClerkConfigured = !!localStorage.getItem('usingClerk');
  
  if (!isClerkConfigured) {
    return useFallbackProfileSettings();
  }
  
  // This will only be accessed if Clerk is configured
  // We use dynamic imports to avoid Clerk errors when it's not configured
  const { useState, useEffect, useCallback } = require("react");
  const { useUser } = require("@clerk/clerk-react");
  const { useForm } = require("react-hook-form");
  const { zodResolver } = require("@hookform/resolvers/zod");
  const { toast } = require("@/components/ui/use-toast");
  const { plushieTypes, plushieBrands } = require("@/components/onboarding/onboardingData");
  const z = require("zod");

  const profileFormSchema = z.object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    bio: z.string().max(160).optional(),
    plushieTypes: z.array(z.string()).optional().default([]),
    plushieBrands: z.array(z.string()).optional().default([]),
    profilePicture: z.string().optional(),
  });

  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
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
    if (isLoaded && user) {
      try {
        console.log("Loading user data:", user);
        const existingInterests = user?.unsafeMetadata?.plushieInterests as string[] || [];
        
        const existingTypeIDs = plushieTypes
          .filter(type => existingInterests.includes(type.label))
          .map(type => type.id);
        
        const existingBrandIDs = plushieBrands
          .filter(brand => existingInterests.includes(brand.label))
          .map(brand => brand.id);
        
        form.reset({
          username: user?.username || "",
          bio: user?.unsafeMetadata?.bio as string || "",
          profilePicture: user?.unsafeMetadata?.profilePicture as string || user?.imageUrl || "",
          plushieTypes: existingTypeIDs,
          plushieBrands: existingBrandIDs,
        });
        
        console.log("Form reset with data:", {
          username: user?.username || "",
          bio: user?.unsafeMetadata?.bio as string || "",
          profilePicture: user?.unsafeMetadata?.profilePicture as string || user?.imageUrl || "",
          plushieTypes: existingTypeIDs,
          plushieBrands: existingBrandIDs,
        });
      } catch (error) {
        console.error("Error loading user profile data:", error);
      }
    }
  }, [isLoaded, user, form]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (!user) {
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
      
      // Update the user profile
      await user.update({
        username: data.username,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          bio: data.bio || "",
          profilePicture: data.profilePicture || "",
          plushieInterests,
          onboardingCompleted: true,
        },
      });

      console.log("Profile updated successfully");
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });

      // Force reload user data to ensure changes are reflected
      await user.reload();
      
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

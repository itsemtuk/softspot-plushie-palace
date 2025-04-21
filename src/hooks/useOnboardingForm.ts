
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { plushieTypes, plushieBrands } from "@/components/onboarding/onboardingData";
import { FormSchema, FormSchemaType } from "@/components/onboarding/OnboardingFormSchema";

export const useOnboardingForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("preferences");
  const [showWarning, setShowWarning] = useState(false);

  // Get existing values if the user has updated their profile before
  const existingPreferences = user?.unsafeMetadata?.plushieInterests as string[] || [];
  const existingBio = user?.unsafeMetadata?.bio as string || "";
  const existingProfilePicture = user?.unsafeMetadata?.profilePicture as string || "";
  const existingAge = user?.unsafeMetadata?.age as number || null;

  // Parse existing preferences back to IDs for the form
  const getExistingTypeIDs = () => {
    return plushieTypes
      .filter(type => existingPreferences.includes(type.label))
      .map(type => type.id);
  };

  const getExistingBrandIDs = () => {
    return plushieBrands
      .filter(brand => existingPreferences.includes(brand.label))
      .map(brand => brand.id);
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      plushieTypes: getExistingTypeIDs(),
      plushieBrands: getExistingBrandIDs(),
      bio: existingBio,
      profilePicture: existingProfilePicture,
      age: existingAge || 0,
    },
  });

  const handleNext = () => {
    if (activeTab === "preferences") {
      const typesValue = form.getValues("plushieTypes");
      if (typesValue.length === 0) {
        setShowWarning(true);
        return;
      }
      setShowWarning(false);
      setActiveTab("profile");
    }
  };

  const handleContinueAnyway = () => {
    setShowWarning(false);
    setActiveTab("profile");
  };

  const handleBack = () => {
    if (activeTab === "profile") {
      setActiveTab("preferences");
    }
  };

  // Function to follow the official SoftSpot account
  const followOfficialAccount = async () => {
    // In a real app, this would make an API call to follow the official account
    // For now, we'll simulate this by storing it in the user's metadata
    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          following: [...(user.unsafeMetadata.following as string[] || []), "softspot_official"],
        },
      });
      console.log("Followed official SoftSpot account");
    } catch (error) {
      console.error("Error following official account:", error);
    }
  };

  const validateAge = (age: number | null | undefined): boolean => {
    if (!age) return false;
    return age >= 16;
  };

  const onSubmit = async (data: FormSchemaType) => {
    setLoading(true);
    try {
      // Validate age - must be at least 16
      if (!validateAge(data.age)) {
        toast({
          title: "Age Restriction",
          description: "You must be at least 16 years old to use SoftSpot.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Convert IDs to labels for better readability in the profile
      const selectedTypes = plushieTypes
        .filter(type => data.plushieTypes.includes(type.id))
        .map(type => type.label);
      
      const selectedBrands = plushieBrands
        .filter(brand => data.plushieBrands.includes(brand.id))
        .map(brand => brand.label);
      
      // Combine both arrays for plushie interests
      const plushieInterests = [...selectedTypes, ...selectedBrands];
      
      // Update user metadata with all collected information
      await user?.update({
        unsafeMetadata: {
          plushieInterests,
          bio: data.bio || "",
          profilePicture: data.profilePicture || "",
          age: data.age,
          onboardingCompleted: true,
          following: ["softspot_official"], // Auto-follow the official account
          isPrivate: false, // Default to public profile
        },
      });

      // Follow the official SoftSpot account
      await followOfficialAccount();

      // Force reload user data to reflect changes immediately
      await user?.reload();

      toast({
        title: "Preferences saved!",
        description: "Your profile has been set up successfully.",
      });
      
      // Redirect to feed after completing onboarding
      navigate('/feed');
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    activeTab,
    showWarning,
    setActiveTab,
    handleNext,
    handleBack,
    handleContinueAnyway,
    onSubmit,
  };
};


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

  const onSubmit = async (data: FormSchemaType) => {
    setLoading(true);
    try {
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
          onboardingCompleted: true
        },
      });

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

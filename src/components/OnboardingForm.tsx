
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import PlushieTypeSelector from "./onboarding/PlushieTypeSelector";
import PlushieBrandSelector from "./onboarding/PlushieBrandSelector";
import BioInput from "./onboarding/BioInput";
import ProfilePictureUpload from "./onboarding/ProfilePictureUpload";
import { plushieTypes, plushieBrands } from "./onboarding/onboardingData";
import { FormSchema, FormSchemaType } from "./onboarding/OnboardingFormSchema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const OnboardingForm = () => {
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

  // Progress through tabs
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

  async function onSubmit(data: FormSchemaType) {
    setLoading(true);
    try {
      console.log("Form data submitted:", data);
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

      toast({
        title: "Preferences saved!",
        description: "Your profile has been set up successfully.",
      });
      
      // Redirect to feed after completing onboarding
      navigate('/feed');
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-softspot-600">
        Welcome to SoftSpot!
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Tell us about yourself to personalize your experience.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="preferences">Plushie Preferences</TabsTrigger>
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences" className="space-y-6">
              {showWarning && (
                <Alert variant="warning" className="bg-yellow-50 border-yellow-200 mb-4">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    You haven't selected any plushie types. It's recommended to select at least one to personalize your experience.
                    <div className="mt-2 flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleContinueAnyway}
                        className="text-sm"
                      >
                        Continue anyway
                      </Button>
                      <Button 
                        variant="default"
                        onClick={() => setShowWarning(false)}
                        className="text-sm bg-yellow-600 hover:bg-yellow-700"
                      >
                        Choose preferences
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              <PlushieTypeSelector plushieTypes={plushieTypes} form={form} />
              <PlushieBrandSelector plushieBrands={plushieBrands} form={form} />
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="button" 
                  className="bg-softspot-500 hover:bg-softspot-600"
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-6">
              <ProfilePictureUpload form={form} />
              <BioInput form={form} />

              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="bg-softspot-500 hover:bg-softspot-600"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Complete Setup"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default OnboardingForm;

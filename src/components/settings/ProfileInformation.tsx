
import { Save } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { plushieTypes, plushieBrands } from "@/components/onboarding/onboardingData";
import ProfilePictureUpload from "@/components/onboarding/ProfilePictureUpload";
import PlushieTypeSelector from "@/components/onboarding/PlushieTypeSelector";
import PlushieBrandSelector from "@/components/onboarding/PlushieBrandSelector";
import BioInput from "@/components/settings/BioInput";
import UsernameInput from "@/components/settings/UsernameInput";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const ProfileInformation = () => {
  const { form, isLoading, onSubmit, loadUserData } = useProfileSettings();
  const { toast } = useToast();

  // Load user data when component mounts
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Handle form submission errors
  const handleSubmit = async (formData: any) => {
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <UsernameInput form={form} />

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-full md:w-1/3">
              <ProfilePictureUpload form={form} />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <PlushieTypeSelector plushieTypes={plushieTypes} form={form} />
              <PlushieBrandSelector plushieBrands={plushieBrands} form={form} />
            </div>
          </div>

          <BioInput form={form} />

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-softspot-500 hover:bg-softspot-600"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" /> 
                  Saving...
                </>
              ) : (
                <>
                  Save changes
                  <Save className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileInformation;

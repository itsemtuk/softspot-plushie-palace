
import { Save } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { plushieTypes, plushieBrands } from "@/components/onboarding/onboardingData";
import ProfilePictureUpload from "@/components/onboarding/ProfilePictureUpload";
import PlushieTypeSelector from "@/components/onboarding/PlushieTypeSelector";
import PlushieBrandSelector from "@/components/onboarding/PlushieBrandSelector";
import { useProfileSettings } from "@/hooks/useProfileSettings";

const ProfileInformation = () => {
  const { form, isLoading, onSubmit } = useProfileSettings();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-full md:w-1/3">
              <ProfilePictureUpload form={form} />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <PlushieTypeSelector plushieTypes={plushieTypes} form={form} />
              <PlushieBrandSelector plushieBrands={plushieBrands} form={form} />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isLoading} className="bg-softspot-500">
              {isLoading ? "Saving..." : "Save changes"}
              {!isLoading && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileInformation;

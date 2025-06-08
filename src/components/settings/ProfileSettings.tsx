
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { ProfileSettingsTabs } from "@/components/profile/ProfileSettingsTabs";
import { BasicInfoTab } from "@/components/settings/tabs/BasicInfoTab";
import { PlushiePreferencesTab } from "@/components/settings/tabs/PlushiePreferencesTab";
import { PrivacySecurityTab } from "@/components/settings/tabs/PrivacySecurityTab";
import { NotificationsTab } from "@/components/settings/tabs/NotificationsTab";
import { SocialMediaTab } from "@/components/settings/tabs/SocialMediaTab";
import { StoreLinksTab } from "@/components/settings/tabs/StoreLinksTab";
import { DeliveryPaymentTab } from "@/components/settings/tabs/DeliveryPaymentTab";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";

export function ProfileSettings() {
  const { form, isSubmitting, activeTab, setActiveTab, saveProfile, isSynced } = useProfileSettings();

  const tabs = [
    { id: "basic-info", label: "Basic Info" },
    { id: "plush-preferences", label: "Plushie Preferences" },
    { id: "social-media", label: "Social Media" },
    { id: "store-links", label: "Store Links" },
    { id: "delivery-payment", label: "Delivery & Payment" },
    { id: "privacy-security", label: "Privacy & Security" },
    { id: "notifications", label: "Notifications" },
  ];
  
  const handleSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
    try {
      const success = await saveProfile(data);
      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile settings have been saved successfully."
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        variant: "destructive",
        title: "Error saving profile",
        description: "Could not save your profile information. Please try again."
      });
    }
  };

  if (!isSynced) {
    return (
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center items-center h-40">
          <Spinner size="lg" />
          <p className="ml-2 text-gray-700 dark:text-gray-300">Loading profile data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Profile Settings</h2>
      
      <ProfileSettingsTabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === "basic-info" && (
            <BasicInfoTab form={form} />
          )}

          {/* Plush Preferences Tab */}
          {activeTab === "plush-preferences" && (
            <PlushiePreferencesTab form={form} />
          )}
          
          {/* Social Media Tab */}
          {activeTab === "social-media" && (
            <SocialMediaTab form={form} />
          )}
          
          {/* Store Links Tab */}
          {activeTab === "store-links" && (
            <StoreLinksTab form={form} />
          )}
          
          {/* Delivery & Payment Tab */}
          {activeTab === "delivery-payment" && (
            <DeliveryPaymentTab form={form} />
          )}

          {/* Privacy & Security Tab */}
          {activeTab === "privacy-security" && (
            <PrivacySecurityTab form={form} />
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <NotificationsTab form={form} />
          )}
          
          {/* Save Button - show on all tabs */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-softspot-500 text-white hover:bg-softspot-600" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}

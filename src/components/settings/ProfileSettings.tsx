
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { ProfileSettingsTabs } from "@/components/profile/ProfileSettingsTabs";
import { BasicInfoTab } from "@/components/settings/tabs/BasicInfoTab";
import { PlushiePreferencesTab } from "@/components/settings/tabs/PlushiePreferencesTab";
import { PrivacySecurityTab } from "@/components/settings/tabs/PrivacySecurityTab";
import { NotificationsTab } from "@/components/settings/tabs/NotificationsTab";

export function ProfileSettings() {
  const { form, isSubmitting, activeTab, setActiveTab, saveProfile } = useProfileSettings();

  const tabs = [
    { id: "basic-info", label: "Basic Info" },
    { id: "plush-preferences", label: "Plushie Preferences" },
    { id: "privacy-security", label: "Privacy & Security" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <Card className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
      
      <ProfileSettingsTabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(saveProfile)} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === "basic-info" && (
            <BasicInfoTab form={form} />
          )}

          {/* Plush Preferences Tab */}
          {activeTab === "plush-preferences" && (
            <PlushiePreferencesTab form={form} />
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}

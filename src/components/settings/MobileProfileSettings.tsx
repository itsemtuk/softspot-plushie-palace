import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User, Heart, Link2, Store, Truck, Shield, Bell, Check } from "lucide-react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { BasicInfoTab } from "@/components/settings/tabs/BasicInfoTab";
import { PlushiePreferencesTab } from "@/components/settings/tabs/PlushiePreferencesTab";
import { PrivacySecurityTab } from "@/components/settings/tabs/PrivacySecurityTab";
import { NotificationsTab } from "@/components/settings/tabs/NotificationsTab";
import { SocialMediaTab } from "@/components/settings/tabs/SocialMediaTab";
import { StoreLinksTab } from "@/components/settings/tabs/StoreLinksTab";
import { DeliveryPaymentTab } from "@/components/settings/tabs/DeliveryPaymentTab";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useSupabaseProfile } from "@/hooks/useSupabaseProfile";

interface MobileProfileTab {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
}

export function MobileProfileSettings() {
  const [showTabs, setShowTabs] = useState(true);
  const { form, isSubmitting, activeTab, setActiveTab, saveProfile, isSynced } = useProfileSettings();
  const { userSyncError, refreshProfile } = useSupabaseProfile();

  const tabs: MobileProfileTab[] = [
    { 
      id: "basic-info", 
      label: "Basic Information", 
      shortLabel: "Basic Info", 
      icon: User,
      description: "Name, bio, avatar, and contact info"
    },
    { 
      id: "plush-preferences", 
      label: "Plushie Preferences", 
      shortLabel: "Preferences", 
      icon: Heart,
      description: "Favorite brands and types"
    },
    { 
      id: "social-media", 
      label: "Social Media Links", 
      shortLabel: "Social", 
      icon: Link2,
      description: "Instagram, Twitter, YouTube links"
    },
    { 
      id: "store-links", 
      label: "Store Links", 
      shortLabel: "Stores", 
      icon: Store,
      description: "Your marketplace store links"
    },
    { 
      id: "delivery-payment", 
      label: "Delivery & Payment", 
      shortLabel: "Delivery", 
      icon: Truck,
      description: "Address and payment preferences"
    },
    { 
      id: "privacy-security", 
      label: "Privacy & Security", 
      shortLabel: "Privacy", 
      icon: Shield,
      description: "Account visibility and security"
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      shortLabel: "Notifications", 
      icon: Bell,
      description: "Email and push notification settings"
    },
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const handleSubmit = async (data: any) => {
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

  if (userSyncError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>{userSyncError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshProfile}
              >
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isSynced) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Spinner size="lg" />
          <p className="text-gray-700 dark:text-gray-300">Loading profile data...</p>
        </div>
      </div>
    );
  }

  // Show individual tab content
  if (!showTabs) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3 sticky top-16 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTabs(true)}
            className="p-2 h-10 w-10 flex-shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {currentTab && <currentTab.icon className="h-5 w-5 text-softspot-600 flex-shrink-0" />}
            <div>
              <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {currentTab?.shortLabel}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {currentTab?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {activeTab === "basic-info" && <BasicInfoTab form={form} />}
              {activeTab === "plush-preferences" && <PlushiePreferencesTab form={form} />}
              {activeTab === "social-media" && <SocialMediaTab form={form} />}
              {activeTab === "store-links" && <StoreLinksTab form={form} />}
              {activeTab === "delivery-payment" && <DeliveryPaymentTab form={form} />}
              {activeTab === "privacy-security" && <PrivacySecurityTab form={form} />}
              {activeTab === "notifications" && <NotificationsTab form={form} />}
              
              {/* Save Button */}
              <div className="sticky bottom-4 bg-white dark:bg-gray-800 p-4 -mx-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  type="submit" 
                  className="w-full bg-softspot-500 text-white hover:bg-softspot-600" 
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  // Show tabs list
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-16 z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Customize your profile and preferences
        </p>
      </div>
      
      {/* Tabs Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className="h-auto p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              onClick={() => {
                setActiveTab(tab.id);
                setShowTabs(false);
              }}
            >
              <div className="flex items-center gap-4 w-full text-left">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-softspot-100 dark:bg-softspot-900/20 flex items-center justify-center">
                    <tab.icon className="h-6 w-6 text-softspot-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 text-base">
                    {tab.label}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {tab.description}
                  </p>
                </div>
                <ChevronLeft className="h-5 w-5 text-gray-400 rotate-180 flex-shrink-0" />
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
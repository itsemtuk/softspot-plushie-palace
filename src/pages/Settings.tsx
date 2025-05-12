
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInformation from "@/components/settings/ProfileInformation";
import AccountSettings from "@/components/settings/AccountSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProfileSettings } from "@/components/settings/ProfileSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <PrivacySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;

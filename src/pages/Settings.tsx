
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInformation from "@/components/settings/ProfileInformation";
import AccountSettings from "@/components/settings/AccountSettings";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { useSignOut } from "@/hooks/useSignOut";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const isMobile = useIsMobile();
  const { handleSignOut } = useSignOut();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-red-200 text-red-500 hover:bg-red-50" 
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;

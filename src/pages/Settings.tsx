
import { useState, useEffect } from "react";
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
import { useStatus } from "@/hooks/use-status";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { DarkModeSettings } from "@/components/settings/DarkModeSettings";
import { useUser } from "@clerk/clerk-react";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const isMobile = useIsMobile();
  const { handleSignOut } = useSignOut();
  const { status } = useStatus();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded]);
  
  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {isMobile ? <MobileNav /> : <Navbar />}
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" className="py-20" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {isMobile ? <MobileNav /> : <Navbar />}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Please sign in to access settings
            </h2>
            <Button onClick={() => window.location.href = '/sign-in'}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <EnhancedErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {isMobile ? <MobileNav /> : <Navbar />}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-red-200 text-red-500 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20" 
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="profile" className="text-gray-900 dark:text-gray-100">Profile Information</TabsTrigger>
              <TabsTrigger value="account" className="text-gray-900 dark:text-gray-100">Account</TabsTrigger>
              <TabsTrigger value="appearance" className="text-gray-900 dark:text-gray-100">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <EnhancedErrorBoundary>
                <ProfileSettings />
              </EnhancedErrorBoundary>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-6">
              <EnhancedErrorBoundary>
                <AccountSettings />
              </EnhancedErrorBoundary>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
              <EnhancedErrorBoundary>
                <DarkModeSettings />
              </EnhancedErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </EnhancedErrorBoundary>
  );
};

export default Settings;

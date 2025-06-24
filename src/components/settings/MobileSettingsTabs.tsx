
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, User, Shield, Bell, Palette, Store, Link2, Truck } from "lucide-react";

interface MobileSettingsTab {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ElementType;
}

interface MobileSettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const MobileSettingsTabs = ({ activeTab, onTabChange, children }: MobileSettingsTabsProps) => {
  const [showTabs, setShowTabs] = useState(true);

  const tabs: MobileSettingsTab[] = [
    { id: "basic", label: "Basic Info", shortLabel: "Basic", icon: User },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "notifications", label: "Notifications", shortLabel: "Notifs", icon: Bell },
    { id: "avatar", label: "Avatar", icon: Palette },
    { id: "preferences", label: "Preferences", shortLabel: "Prefs", icon: User },
    { id: "social", label: "Social", icon: Link2 },
    { id: "store", label: "Store", icon: Store },
    { id: "delivery", label: "Delivery", icon: Truck },
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  if (!showTabs) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTabs(true)}
            className="p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            {currentTab && <currentTab.icon className="h-5 w-5 text-softspot-600" />}
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{currentTab?.label}</h2>
          </div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
      </div>
      
      {/* Mobile optimized tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2">
        <ScrollArea className="w-full">
          <div className="flex space-x-2 pb-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                className={`flex-shrink-0 h-8 px-3 text-xs ${
                  activeTab === tab.id 
                    ? "bg-softspot-500 text-white" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => {
                  onTabChange(tab.id);
                  setShowTabs(false);
                }}
              >
                <tab.icon className="mr-1 h-3 w-3" />
                <span>{tab.shortLabel || tab.label}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};


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
    { id: "basic-info", label: "Basic Info", shortLabel: "Basic", icon: User },
    { id: "privacy-security", label: "Privacy", shortLabel: "Privacy", icon: Shield },
    { id: "notifications", label: "Notifications", shortLabel: "Alerts", icon: Bell },
    { id: "plush-preferences", label: "Preferences", shortLabel: "Prefs", icon: Palette },
    { id: "social-media", label: "Social", shortLabel: "Social", icon: Link2 },
    { id: "store-links", label: "Store", shortLabel: "Store", icon: Store },
    { id: "delivery-payment", label: "Delivery", shortLabel: "Delivery", icon: Truck },
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  if (!showTabs) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3 sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTabs(true)}
            className="p-2 h-10 w-10 flex-shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 min-w-0">
            {currentTab && <currentTab.icon className="h-5 w-5 text-softspot-600 flex-shrink-0" />}
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
              {currentTab?.label}
            </h2>
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
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
      </div>
      
      {/* Mobile optimized tabs - improved grid layout */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <ScrollArea className="w-full">
          <div className="grid grid-cols-2 gap-3 pb-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                className={`flex flex-col items-center justify-center h-20 py-3 px-3 text-xs min-w-0 transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "bg-softspot-500 text-white hover:bg-softspot-600 transform scale-[0.98]" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-[1.02]"
                }`}
                onClick={() => {
                  onTabChange(tab.id);
                  setShowTabs(false);
                }}
              >
                <tab.icon className="h-6 w-6 mb-2 flex-shrink-0" />
                <span className="text-xs leading-tight text-center break-words max-w-full">
                  {tab.shortLabel || tab.label}
                </span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-4">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

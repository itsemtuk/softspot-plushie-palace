
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, User, Shield, Bell, Palette, Store, Link2, Truck } from "lucide-react";

interface MobileSettingsTab {
  id: string;
  label: string;
  shortLabel: string;
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
    { id: "profile", label: "Profile Information", shortLabel: "Profile", icon: User },
    { id: "account", label: "Account", shortLabel: "Account", icon: Shield },
    { id: "appearance", label: "Appearance", shortLabel: "Appearance", icon: Palette },
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  if (!showTabs) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
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
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
              {currentTab?.shortLabel}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-16 z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`w-full flex items-center justify-start h-16 px-4 text-left transition-all duration-200 ${
                activeTab === tab.id 
                  ? "bg-softspot-500 text-white hover:bg-softspot-600" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => {
                onTabChange(tab.id);
                setShowTabs(false);
              }}
            >
              <tab.icon className="h-6 w-6 mr-4 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium text-base">{tab.shortLabel}</div>
                <div className="text-sm opacity-75 truncate">{tab.label}</div>
              </div>
              <ChevronLeft className="h-5 w-5 ml-auto rotate-180 opacity-50" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

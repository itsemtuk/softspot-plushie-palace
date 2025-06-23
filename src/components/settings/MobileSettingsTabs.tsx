
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, User, Shield, Bell, Palette, Store, Link2, Truck } from "lucide-react";

interface MobileSettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const MobileSettingsTabs = ({ activeTab, onTabChange, children }: MobileSettingsTabsProps) => {
  const [showTabs, setShowTabs] = useState(true);

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "avatar", label: "Avatar", icon: Palette },
    { id: "preferences", label: "Preferences", icon: User },
    { id: "social", label: "Social", icon: Link2 },
    { id: "store", label: "Store", icon: Store },
    { id: "delivery", label: "Delivery", icon: Truck },
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  if (!showTabs) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b p-4 flex items-center gap-3">
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
            <h2 className="font-semibold text-lg">{currentTab?.label}</h2>
          </div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-4">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-4 space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`w-full justify-start h-12 ${
                activeTab === tab.id 
                  ? "bg-softspot-500 text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                onTabChange(tab.id);
                setShowTabs(false);
              }}
            >
              <tab.icon className="mr-3 h-5 w-5" />
              <span className="text-sm">{tab.label}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

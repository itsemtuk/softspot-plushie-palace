
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface ProfileSettingsTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const ProfileSettingsTabs = ({ tabs, activeTab, onTabChange }: ProfileSettingsTabsProps) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-6 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "pb-3 font-medium whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-softspot-500 text-softspot-500"
                : "text-gray-500 hover:text-softspot-500"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

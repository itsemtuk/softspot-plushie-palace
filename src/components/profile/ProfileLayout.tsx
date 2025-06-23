
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileTabs } from "./ProfileTabs";

interface ProfileLayoutProps {
  children: React.ReactNode;
  defaultTab?: string;
}

export const ProfileLayout = ({ children, defaultTab }: ProfileLayoutProps) => {
  return (
    <div className="space-y-6">
      <ProfileTabs defaultValue={defaultTab}>
        {children}
      </ProfileTabs>
    </div>
  );
};

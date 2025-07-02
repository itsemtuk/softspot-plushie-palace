
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

export const ProfileTabs = ({ children, defaultValue = "posts" }: ProfileTabsProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className={cn(
        "bg-white shadow-sm rounded-full w-full flex justify-center p-1",
        isMobile ? "grid grid-cols-5 h-auto" : "inline-flex"
      )}>
        <TabsTrigger 
          value="posts" 
          className={cn(
            "data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none",
            isMobile ? "text-xs py-2 px-2" : "text-sm"
          )}
        >
          Posts
        </TabsTrigger>
        <TabsTrigger 
          value="marketplace" 
          className={cn(
            "data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none",
            isMobile ? "text-xs py-2 px-2" : "text-sm"
          )}
        >
          Market
        </TabsTrigger>
        <TabsTrigger 
          value="about" 
          className={cn(
            "data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none",
            isMobile ? "text-xs py-2 px-2" : "text-sm"
          )}
        >
          About
        </TabsTrigger>
        <TabsTrigger 
          value="badges" 
          className={cn(
            "data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none",
            isMobile ? "text-xs py-2 px-2" : "text-sm"
          )}
        >
          Badges
        </TabsTrigger>
        <TabsTrigger 
          value="reviews" 
          className={cn(
            "data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none",
            isMobile ? "text-xs py-2 px-2" : "text-sm"
          )}
        >
          Reviews
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

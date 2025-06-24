
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MarketplacePlushie } from "@/types/marketplace";

interface PlushieTabsProps {
  plushie: MarketplacePlushie;
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export const PlushieTabs = ({ plushie, selectedTab, onTabChange }: PlushieTabsProps) => {
  return (
    <Tabs value={selectedTab} onValueChange={onTabChange} className="mb-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="seller">Seller</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-3">
        <div className="space-y-2">
          {plushie.condition && (
            <div className="flex justify-between">
              <span className="text-gray-600">Condition:</span>
              <Badge variant="secondary">{plushie.condition}</Badge>
            </div>
          )}
          {plushie.size && (
            <div className="flex justify-between">
              <span className="text-gray-600">Size:</span>
              <span>{plushie.size}</span>
            </div>
          )}
          {plushie.material && (
            <div className="flex justify-between">
              <span className="text-gray-600">Material:</span>
              <span>{plushie.material}</span>
            </div>
          )}
          {plushie.color && (
            <div className="flex justify-between">
              <span className="text-gray-600">Color:</span>
              <span>{plushie.color}</span>
            </div>
          )}
          {plushie.species && (
            <div className="flex justify-between">
              <span className="text-gray-600">Species:</span>
              <span>{plushie.species}</span>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="description">
        <p className="text-gray-700 text-sm leading-relaxed">
          {plushie.description || "No description provided."}
        </p>
      </TabsContent>
      
      <TabsContent value="seller">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Listed by</p>
          <p className="font-medium">{plushie.username || 'Anonymous'}</p>
          <p className="text-xs text-gray-500">Member since 2024</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

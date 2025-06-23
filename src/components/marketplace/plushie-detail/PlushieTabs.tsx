
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MarketplacePlushie } from "@/types/marketplace";

interface PlushieTabsProps {
  plushie: MarketplacePlushie;
  selectedTab: string;
  onTabChange: (value: string) => void;
}

export const PlushieTabs = ({ plushie, selectedTab, onTabChange }: PlushieTabsProps) => {
  const deliveryCost = typeof plushie.deliveryCost === 'number' ? plushie.deliveryCost : 0;

  return (
    <Tabs value={selectedTab} onValueChange={onTabChange} className="mb-4">
      <TabsList className="grid grid-cols-2 bg-gray-50 rounded-lg">
        <TabsTrigger value="details" className="rounded-md">Details</TabsTrigger>
        <TabsTrigger value="shipping" className="rounded-md">Shipping</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-3 pt-2">
        <p className="text-gray-700">{plushie.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          {plushie.condition && (
            <div>
              <span className="font-medium">Condition: </span>
              <span>{plushie.condition}</span>
            </div>
          )}
          
          {plushie.species && (
            <div>
              <span className="font-medium">Species: </span>
              <span>{plushie.species}</span>
            </div>
          )}
          
          {plushie.material && (
            <div>
              <span className="font-medium">Material: </span>
              <span>{plushie.material}</span>
            </div>
          )}
          
          {plushie.size && (
            <div>
              <span className="font-medium">Size: </span>
              <span>{plushie.size}</span>
            </div>
          )}
          
          {plushie.color && (
            <div>
              <span className="font-medium">Color: </span>
              <span>{plushie.color}</span>
            </div>
          )}
          
          {plushie.filling && (
            <div>
              <span className="font-medium">Filling: </span>
              <span>{plushie.filling}</span>
            </div>
          )}
        </div>
        
        {plushie.tags && plushie.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {plushie.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="cursor-pointer rounded-md">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="shipping" className="space-y-3 pt-2">
        <div>
          <h4 className="font-medium mb-1">Shipping Details</h4>
          <p className="text-sm text-gray-700">
            {deliveryCost === 0 
              ? "This item includes free shipping."
              : `Shipping cost: $${deliveryCost.toFixed(2)}`
            }
          </p>
        </div>
        
        {plushie.location && (
          <div>
            <h4 className="font-medium mb-1">Location</h4>
            <p className="text-sm text-gray-700">{plushie.location}</p>
          </div>
        )}
        
        <div>
          <h4 className="font-medium mb-1">Shipping Policy</h4>
          <p className="text-sm text-gray-700">
            Seller typically ships within 2-3 business days.
            Returns accepted within 14 days of delivery.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};


import { Separator } from "@/components/ui/separator";
import { Tag, TruckIcon, GlobeIcon } from "lucide-react";
import { MarketplacePlushie } from "@/types/marketplace";

interface PlushieInfoProps {
  plushie: MarketplacePlushie;
}

export function PlushieInfo({ plushie }: PlushieInfoProps) {
  // Ensure deliveryCost is a valid number for toFixed()
  let deliveryCost = 0;
  if (plushie.deliveryCost !== undefined && plushie.deliveryCost !== null) {
    // Parse as number if it's a string, or use directly if it's a number
    deliveryCost = typeof plushie.deliveryCost === 'string' 
      ? parseFloat(plushie.deliveryCost) || 0 
      : typeof plushie.deliveryCost === 'number' 
        ? plushie.deliveryCost 
        : 0;
  }
  
  return (
    <>
      <Separator className="my-4" />
      
      <div className="my-4">
        <h3 className="font-medium mb-2">Description</h3>
        <p className="text-gray-700">{plushie.description}</p>
      </div>
      
      <div className="flex flex-wrap gap-2 my-4">
        <h3 className="font-medium w-full mb-2">Tags</h3>
        {["plushie", plushie.species, plushie.brand, plushie.condition?.toLowerCase()].filter(Boolean).map(tag => (
          <div key={tag} className="bg-softspot-100 text-softspot-700 px-2 py-1 rounded-full text-xs flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </div>
        ))}
      </div>
      
      <div className="my-4">
        <h3 className="font-medium mb-2">Delivery Information</h3>
        <div className="flex items-center gap-2 text-sm">
          <TruckIcon className="h-4 w-4 text-gray-400" />
          <span>Delivery Cost: £{deliveryCost.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <GlobeIcon className="h-4 w-4 text-gray-400" />
          <span>Ships to: United Kingdom</span>
        </div>
      </div>
      
      <Separator className="my-4" />
    </>
  );
}

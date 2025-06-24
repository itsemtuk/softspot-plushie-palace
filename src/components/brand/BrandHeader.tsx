
import { PlushieBrand } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Calendar } from "lucide-react";
import { ActivityStatus } from "@/components/ui/activity-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BrandHeaderProps {
  brandName: string;
  brandDescription: string;
  brandLogo?: string;
  backgroundColor?: string;
  itemCount: number;
}

export const BrandHeader = ({ 
  brandName, 
  brandDescription, 
  brandLogo, 
  backgroundColor = "bg-gray-100",
  itemCount 
}: BrandHeaderProps) => {
  return (
    <div className={`${backgroundColor} shadow-sm rounded-lg p-6 mb-8`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
          <Avatar className="w-full h-full border-2 border-softspot-100">
            <AvatarImage
              src={brandLogo}
              alt={`${brandName} Logo`}
              className="object-contain"
            />
            <AvatarFallback className="bg-softspot-100 text-softspot-500 text-2xl">
              {brandName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{brandName}</h1>
            <span className="bg-softspot-100 text-softspot-600 text-xs px-2 py-1 rounded-full">
              Verified
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{brandDescription}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 justify-center md:justify-start mb-4">
            <div className="flex items-center">
              <span>{itemCount} Items Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

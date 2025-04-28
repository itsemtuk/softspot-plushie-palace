
import { PlushieBrand } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Calendar } from "lucide-react";
import { ActivityStatus } from "@/components/ui/activity-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BrandHeaderProps {
  brand: PlushieBrand;
}

export const BrandHeader = ({ brand }: BrandHeaderProps) => {
  const websiteUrl = brand.website || "#";
  const isActive = brand.status === "active";
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
          <Avatar className="w-full h-full border-2 border-softspot-100">
            <AvatarImage
              src={brand.logo}
              alt={`${brand.name} Logo`}
              className="object-contain"
            />
            <AvatarFallback className="bg-softspot-100 text-softspot-500 text-2xl">
              {brand.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Activity status indicator */}
          <div className="absolute -bottom-1 -right-1 transform translate-x-1/4 translate-y-1/4">
            <ActivityStatus 
              status={isActive ? "online" : "offline"} 
              size="lg"
              className="border-2 border-white"
            />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
            {brand.verified && (
              <span className="bg-softspot-100 text-softspot-600 text-xs px-2 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">{brand.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 justify-center md:justify-start mb-4">
            {brand.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{brand.location}</span>
              </div>
            )}
            {brand.founded && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Est. {brand.founded}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Button
              variant="outline"
              size="sm"
              className="text-softspot-600 hover:text-softspot-700"
              asChild
            >
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Visit Website <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

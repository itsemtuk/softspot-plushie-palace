
import { PlushieBrand } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface BrandHeaderProps {
  brand: PlushieBrand;
}

export const BrandHeader = ({ brand }: BrandHeaderProps) => {
  const websiteUrl = brand.website || "#";
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
          <img
            src={brand.logo}
            alt={`${brand.name} Logo`}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{brand.name}</h1>
          <p className="text-gray-600 mb-4">{brand.description}</p>
          
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

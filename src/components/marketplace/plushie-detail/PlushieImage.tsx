
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketplacePlushie } from "@/types/marketplace";

interface PlushieImageProps {
  plushie: MarketplacePlushie;
}

export const PlushieImage = ({ plushie }: PlushieImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasDiscount = plushie.discount && plushie.discount > 0;

  return (
    <div className="relative h-[300px] md:h-full bg-gray-50 flex items-center justify-center">
      {!imageLoaded && (
        <Skeleton className="w-full h-full absolute inset-0 rounded-l-lg" />
      )}
      <img 
        src={plushie.image} 
        alt={plushie.title || "Plushie"} 
        className={`h-full w-full object-contain p-4 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          console.error("Image failed to load:", e);
          (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=No+Image";
          setImageLoaded(true);
        }}
      />
      {hasDiscount && (
        <Badge className="absolute top-4 left-4 bg-red-500 rounded-md">
          {plushie.discount}% OFF
        </Badge>
      )}
    </div>
  );
};

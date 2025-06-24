
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplacePlushie } from "@/types/marketplace";

interface PlushieGridProps {
  plushies: MarketplacePlushie[];
  isLoading?: boolean;
  onPlushieClick?: (plushie: MarketplacePlushie) => void;
}

export const PlushieGrid = ({ plushies, isLoading, onPlushieClick }: PlushieGridProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-softspot-500 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Loading items...</p>
      </div>
    );
  }

  if (plushies.length === 0) {
    return (
      <div className="col-span-3 text-center py-6">
        <p>No plushies found for this brand.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {plushies.map((plushie) => (
        <Card key={plushie.id} className="cursor-pointer" onClick={() => onPlushieClick?.(plushie)}>
          <CardContent className="aspect-square relative">
            <img
              src={plushie.image}
              alt={plushie.title}
              className="object-cover w-full h-full rounded-md"
            />
            {plushie.forSale && (
              <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                For Sale
              </Badge>
            )}
          </CardContent>
          <div className="p-4">
            <h3 className="font-medium text-lg">{plushie.title}</h3>
            <p className="text-sm text-gray-500">${plushie.price}</p>
            <div className="flex items-center space-x-2 text-gray-500 mt-2">
              <span>{plushie.likes} Likes</span>
              <span>{plushie.comments} Comments</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

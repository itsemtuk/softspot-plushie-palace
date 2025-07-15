
import { Package, Shirt, Box, PawPrint, Ruler, TruckIcon, GlobeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Badge } from "@/components/ui/badge";
import { MarketplacePlushie } from "@/types/marketplace";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PlushieDetailsProps {
  plushie: MarketplacePlushie;
}

export function PlushieDetails({ plushie }: PlushieDetailsProps) {
  // Ensure price is a number for toFixed()
  const price = typeof plushie.price === 'number' ? plushie.price : 0;
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">{plushie.title}</DialogTitle>
        <div className="text-sm text-gray-500 flex items-center justify-between mt-2">
          {(() => {
  const { user } = useUser();
  const isCurrentUser = user && (user.username === plushie.username || user.id === plushie.user_id || user.id === plushie.userId);
  if (plushie.username) {
    return (
      <Link
        to={isCurrentUser ? "/profile" : `/user/${plushie.username}`}
        onClick={e => e.stopPropagation()}
        className="text-blue-600 hover:underline"
      >
        Listed by @{plushie.username}
      </Link>
    );
  } else {
    return <span>Listed by @Unknown</span>;
  }
})()}
          {plushie.condition && (
            <Badge variant="outline" className="bg-softspot-50 text-softspot-500">
              {plushie.condition}
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold text-softspot-500 mt-2">£{price.toFixed(2)}</p>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Brand: <span className="font-medium">{plushie.brand || 'Unknown'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Shirt className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Material: <span className="font-medium">{plushie.material || 'Unknown'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Filling: <span className="font-medium">{plushie.filling || 'Unknown'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <PawPrint className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Species: <span className="font-medium">{plushie.species || 'Unknown'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          {plushie.color && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: plushie.color }}></div>}
          <span className="text-sm">Color: <span className="font-medium">{plushie.color || 'Unknown'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Size: <span className="font-medium">Medium</span></span>
        </div>
      </div>
    </>
  );
}

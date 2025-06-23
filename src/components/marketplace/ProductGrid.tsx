
import { useState } from "react";
import { MarketplacePlushie } from "@/types/marketplace";
import { ProductCard } from "./ProductCard";
import { PlushieDetailDialog } from "./PlushieDetailDialog";

interface ProductGridProps {
  plushies: MarketplacePlushie[];
  viewMode: "grid" | "list";
  onProductClick: (product: MarketplacePlushie) => void;
  onWishlistToggle: (id: string, event: React.MouseEvent) => void;
}

export const ProductGrid = ({ 
  plushies, 
  viewMode, 
  onProductClick, 
  onWishlistToggle 
}: ProductGridProps) => {
  const [selectedPlushie, setSelectedPlushie] = useState<MarketplacePlushie | null>(null);

  const handleProductClick = (product: MarketplacePlushie) => {
    console.log("ProductGrid: Product clicked:", product);
    setSelectedPlushie(product);
    onProductClick(product);
  };

  const handleCloseDialog = () => {
    setSelectedPlushie(null);
  };

  if (plushies.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No items found</h3>
        <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later for new listings.</p>
      </div>
    );
  }

  return (
    <>
      <div className={`
        ${viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
          : "space-y-4"
        }
      `}>
        {plushies.map((plushie) => (
          <ProductCard
            key={plushie.id}
            plushie={plushie}
            viewMode={viewMode}
            onProductClick={handleProductClick}
            onWishlistToggle={onWishlistToggle}
          />
        ))}
      </div>

      {selectedPlushie && (
        <PlushieDetailDialog
          plushie={selectedPlushie}
          isOpen={!!selectedPlushie}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
};

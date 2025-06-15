
import { ProductCard } from "@/components/marketplace/ProductCard";
import { MarketplacePlushie } from "@/types/marketplace";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  plushies: MarketplacePlushie[];
  viewMode: "grid" | "list";
  onProductClick: (product: MarketplacePlushie) => void;
  onWishlistToggle: (id: string, event: React.MouseEvent) => void;
}

export function ProductGrid({
  plushies,
  viewMode,
  onProductClick,
  onWishlistToggle
}: ProductGridProps) {
  if (plushies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No plushies found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-4",
      viewMode === "grid" 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
        : "grid-cols-1"
    )}>
      {plushies.map((item) => (
        <ProductCard
          key={item.id}
          plushie={item}
          onProductClick={onProductClick}
          onWishlistToggle={onWishlistToggle}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}

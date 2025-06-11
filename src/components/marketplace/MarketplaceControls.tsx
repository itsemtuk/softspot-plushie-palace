
import { Button } from "@/components/ui/button";
import { SortOptions } from "@/components/marketplace/SortOptions";
import { InstantSearchBox } from "@/components/marketplace/InstantSearchBox";
import { Grid3X3, List, SlidersHorizontal } from "lucide-react";

interface MarketplaceControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onFilterToggle: () => void;
  isMobile: boolean;
}

export function MarketplaceControls({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onFilterToggle,
  isMobile
}: MarketplaceControlsProps) {
  return (
    <div className="mb-6 space-y-4">
      <InstantSearchBox 
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search for plushies..."
      />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterToggle}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          )}
          
          <SortOptions 
            value={sortBy}
            onValueChange={onSortChange}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

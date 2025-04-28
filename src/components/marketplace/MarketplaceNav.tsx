
import { DesktopNav } from "./nav/DesktopNav";
import { MobileNav } from "./nav/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface MarketplaceNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MarketplaceNav({ selectedCategory, onCategoryChange }: MarketplaceNavProps) {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isMobile ? (
          <MobileNav 
            selectedCategory={selectedCategory} 
            onCategoryChange={onCategoryChange} 
          />
        ) : (
          <DesktopNav 
            selectedCategory={selectedCategory} 
            onCategoryChange={onCategoryChange} 
          />
        )}
      </div>
    </div>
  );
}

export default MarketplaceNav;

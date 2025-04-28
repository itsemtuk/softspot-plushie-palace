
import { DesktopNav } from "./nav/DesktopNav";
import { MobileNav } from "./nav/MobileNav";

interface MarketplaceNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MarketplaceNav({ selectedCategory, onCategoryChange }: MarketplaceNavProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DesktopNav 
          selectedCategory={selectedCategory} 
          onCategoryChange={onCategoryChange} 
        />
        <MobileNav 
          selectedCategory={selectedCategory} 
          onCategoryChange={onCategoryChange} 
        />
      </div>
    </div>
  );
}

export default MarketplaceNav;


import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Store, ChevronDown, Search } from "lucide-react";
import { brandData, speciesData } from "./data";

interface MobileNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MobileNav({ selectedCategory, onCategoryChange }: MobileNavProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  
  // Helper to determine if a category button should have active styling
  const isActive = (category: string) => selectedCategory === category;

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between h-12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span>Shop</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-screen max-w-xs">
            <DropdownMenuItem 
              className={isActive("all") ? "bg-softspot-100" : ""}
              onClick={() => onCategoryChange("all")}
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <Store className="w-4 h-4" />
                <span>Shop All</span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs text-gray-500">Featured</div>
            <DropdownMenuItem asChild>
              <Link to="/marketplace?featured=new">New Arrivals</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/marketplace?featured=trending">Trending</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/marketplace?featured=limited">Limited Editions</Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs text-gray-500">Brands</div>
            {brandData.map(brand => (
              <DropdownMenuItem key={brand.id} asChild>
                <Link to={`/brand/${brand.id}`}>{brand.name}</Link>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs text-gray-500">Animals</div>
            {speciesData.map(animal => (
              <DropdownMenuItem 
                key={animal.id} 
                className={isActive(animal.id) ? "bg-softspot-100" : ""}
                onClick={() => onCategoryChange(animal.id)}
              >
                {animal.name}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/marketplace?sale=true" className="text-red-500">Sale Items</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchVisible(!isSearchVisible)}>
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {isSearchVisible && (
        <div className="p-2 border-t">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plushies..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-softspot-300 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileNav;

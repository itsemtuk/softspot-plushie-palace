
import { Link } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Store, ChevronDown } from "lucide-react";
import { brandData, speciesData } from "./data";

interface MobileNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MobileNav({ selectedCategory, onCategoryChange }: MobileNavProps) {
  // Helper to determine if a category button should have active styling
  const isActive = (category: string) => selectedCategory === category;

  return (
    <div className="flex lg:hidden items-center h-12">
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
    </div>
  );
}

export default MobileNav;

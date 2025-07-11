
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Store, Search, ChevronDown, X, ShoppingBag, Tag, Grid3X3 } from "lucide-react";
import { brandData, speciesData } from "./data";

interface MobileNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MobileNav({ selectedCategory, onCategoryChange }: MobileNavProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const isActive = (category: string) => selectedCategory === category;

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setIsMenuOpen(false);
  };

  const navigateToSellItem = () => {
    navigate("/marketplace/sell");
    setIsMenuOpen(false);
  };

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between h-14 px-3">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-sm h-10 px-3">
              <Grid3X3 className="w-4 h-4" />
              <span className="text-sm">Browse</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
            <SheetHeader className="flex flex-row items-center justify-between border-b pb-3">
              <SheetTitle className="text-lg">Browse Categories</SheetTitle>
              <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center">
                <X className="h-4 w-4" />
              </SheetClose>
            </SheetHeader>
            
            <div className="py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              <Button 
                variant={isActive("all") ? "default" : "ghost"}
                className={`w-full justify-start text-sm h-12 ${isActive("all") ? "bg-softspot-500" : ""}`}
                onClick={() => handleCategorySelect("all")}
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                All Items
              </Button>
              
              <div className="border-t pt-3">
                <h3 className="text-sm font-medium text-gray-500 mb-3 px-3">Animals</h3>
                <div className="grid grid-cols-1 gap-2">
                  {speciesData.slice(0, 6).map(animal => (
                    <Button 
                      key={animal.id} 
                      variant={isActive(animal.id) ? "default" : "outline"}
                      className={`justify-start h-11 py-2 px-4 text-sm ${isActive(animal.id) ? "bg-softspot-500" : ""}`}
                      onClick={() => handleCategorySelect(animal.id)}
                    >
                      {animal.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-3">
                <h3 className="text-sm font-medium text-gray-500 mb-3 px-3">Popular Brands</h3>
                <div className="grid grid-cols-1 gap-2">
                  {brandData.slice(0, 4).map(brand => (
                    <Button 
                      key={brand.id} 
                      variant="outline" 
                      asChild
                      className="justify-start h-11 py-2 px-4 text-sm"
                    >
                      <Link to={`/brand/${brand.id}`}>{brand.name}</Link>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-3 mt-4">
                <Button 
                  className="w-full bg-softspot-500 hover:bg-softspot-600 text-sm h-12"
                  onClick={navigateToSellItem}
                >
                  <Tag className="mr-2 h-4 w-4" /> 
                  List Your Item
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="h-10 w-10"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isSearchVisible && (
        <div className="p-3 border-t">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search marketplace..."
              className="w-full pl-10 pr-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-softspot-300 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}

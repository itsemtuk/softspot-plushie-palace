
import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock categories and trending searches
const categories = ["Bears", "Rabbits", "Cats", "Dogs", "Mythical"];
const trendingSearches = ["Vintage bear", "Rare plushies", "Limited edition"];

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, you'd navigate to search results with the query
      setIsOpen(false);
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-xs" ref={inputRef}>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search plushies..."
              className="pl-9 pr-12 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
            />
            <Button 
              size="sm" 
              variant="ghost" 
              type="submit"
              className="absolute right-0 top-0 h-full rounded-l-none"
            >
              Search
            </Button>
          </form>
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-4 space-y-4">
          {searchQuery ? (
            <div>
              <h3 className="text-sm font-medium mb-2">Search Results</h3>
              <Link 
                to={`/discover?q=${encodeURIComponent(searchQuery)}`} 
                className="block p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Search for "{searchQuery}"
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link 
                      key={category} 
                      to={`/discover?category=${category.toLowerCase()}`}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Trending Searches</h3>
                <div className="space-y-1">
                  {trendingSearches.map((trend) => (
                    <Link 
                      key={trend}
                      to={`/discover?q=${encodeURIComponent(trend)}`}
                      className="flex items-center p-2 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <Search className="h-3.5 w-3.5 mr-2 text-gray-500" />
                      <span className="text-sm">{trend}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Recent Plushies</h3>
                <div className="space-y-2">
                  <Link 
                    to="/marketplace/plushie-1"
                    className="flex items-center p-2 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Teddy" />
                      <AvatarFallback>TB</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Vintage Teddy Bear</p>
                      <p className="text-xs text-gray-500">$24.99</p>
                    </div>
                  </Link>
                  <Link 
                    to="/marketplace/plushie-2"
                    className="flex items-center p-2 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="https://i.pravatar.cc/150?img=2" alt="Bunny" />
                      <AvatarFallback>RB</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Rainbow Bunny</p>
                      <p className="text-xs text-gray-500">$19.50</p>
                    </div>
                  </Link>
                </div>
              </div>
            </>
          )}
          
          <div className="pt-2 border-t">
            <Link 
              to="/discover" 
              className="flex items-center justify-center w-full text-sm text-softspot-500 hover:text-softspot-600"
              onClick={() => setIsOpen(false)}
            >
              Advanced Search
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

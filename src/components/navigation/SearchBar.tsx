
import { useState, useRef, useEffect } from "react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { SearchInput } from "./search/SearchInput";
import { SearchResults } from "./search/SearchResults";
import { SearchCategories } from "./search/SearchCategories";
import { TrendingSearches } from "./search/TrendingSearches";
import { RecentItems } from "./search/RecentItems";
import { PopularUsers } from "./search/PopularUsers";
import { SearchFooter } from "./search/SearchFooter";

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
          <SearchInput 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-4 space-y-4">
          {searchQuery ? (
            <SearchResults searchQuery={searchQuery} setIsOpen={setIsOpen} />
          ) : (
            <>
              <SearchCategories categories={categories} setIsOpen={setIsOpen} />
              <TrendingSearches trendingSearches={trendingSearches} setIsOpen={setIsOpen} />
              <RecentItems setIsOpen={setIsOpen} />
              <PopularUsers setIsOpen={setIsOpen} />
            </>
          )}
          
          <SearchFooter setIsOpen={setIsOpen} />
        </div>
      </PopoverContent>
    </Popover>
  );
};


import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  type: "plushie" | "user" | "brand";
  image?: string;
  price?: string;
}

interface InstantSearchBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearchSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function InstantSearchBox({ 
  value = "",
  onChange,
  onSearchSelect, 
  placeholder = "Search plushies, users, brands...",
  className 
}: InstantSearchBoxProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches] = useState<string[]>(["Jellycat Bunny", "Squishmallow Axolotl", "Pokemon Pikachu"]);
  const [trendingSearches] = useState<string[]>(["Hello Kitty", "Disney Stitch", "Sanrio Kuromi"]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search results
  const mockResults: SearchResult[] = [
    { id: "1", title: "Jellycat Bashful Bunny", type: "plushie", price: "$25" },
    { id: "2", title: "Hello Kitty Collection", type: "brand" },
    { id: "3", title: "@plushielover123", type: "user" },
    { id: "4", title: "Squishmallow Axolotl", type: "plushie", price: "$18" },
  ];

  // Sync internal state with external value prop
  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      // Simulate search delay
      const timeoutId = setTimeout(() => {
        const filtered = mockResults.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      }, 150);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);
    setIsOpen(true);
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.title);
    onChange?.(result.title);
    setIsOpen(false);
    onSearchSelect?.(result);
  };

  const handleTrendingClick = (search: string) => {
    setQuery(search);
    onChange?.(search);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    onChange?.("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user": return "👤";
      case "brand": return "🏷️";
      default: return "🧸";
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-8"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {query.length > 0 ? (
            <div className="p-2">
              {results.length > 0 ? (
                <>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                    Search Results
                  </div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-3"
                    >
                      <span className="text-lg">{getTypeIcon(result.type)}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{result.title}</div>
                        {result.price && (
                          <div className="text-xs text-green-600 dark:text-green-400">{result.price}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No results found for "{query}"
                </div>
              )}
            </div>
          ) : (
            <div className="p-2 space-y-3">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                    <Clock className="h-3 w-3" />
                    Recent
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(search)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </div>
                {trendingSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleTrendingClick(search)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

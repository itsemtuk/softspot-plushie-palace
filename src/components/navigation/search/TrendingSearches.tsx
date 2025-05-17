
import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

interface TrendingSearchesProps {
  trendingSearches: string[];
  setIsOpen: (isOpen: boolean) => void;
}

export const TrendingSearches = ({ trendingSearches, setIsOpen }: TrendingSearchesProps) => {
  return (
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
  );
};

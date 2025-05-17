
import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

interface SearchResultsProps {
  searchQuery: string;
  setIsOpen: (isOpen: boolean) => void;
}

export const SearchResults = ({ searchQuery, setIsOpen }: SearchResultsProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Search Results</h3>
      <Link 
        to={`/discover?q=${encodeURIComponent(searchQuery)}`} 
        className="block p-2 hover:bg-gray-100 rounded-md"
        onClick={() => setIsOpen(false)}
      >
        Search for products: "{searchQuery}"
      </Link>
      <Link 
        to={`/feed?q=${encodeURIComponent(searchQuery)}`} 
        className="block p-2 hover:bg-gray-100 rounded-md"
        onClick={() => setIsOpen(false)}
      >
        Search for posts: "{searchQuery}"
      </Link>
      <Link 
        to={`/users?q=${encodeURIComponent(searchQuery)}`} 
        className="block p-2 hover:bg-gray-100 rounded-md"
        onClick={() => setIsOpen(false)}
      >
        Search for users: "{searchQuery}"
      </Link>
    </div>
  );
};

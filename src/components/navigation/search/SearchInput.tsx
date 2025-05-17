
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export const SearchInput = ({ searchQuery, setSearchQuery, handleSearch }: SearchInputProps) => {
  return (
    <form onSubmit={handleSearch} className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search SoftSpot..."
        className="pl-9 pr-12 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
  );
};

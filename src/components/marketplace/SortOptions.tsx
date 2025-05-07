
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortOptionsProps {
  sortOption: string;
  onSortChange: (option: string) => void;
}

export function SortOptions({ sortOption, onSortChange }: SortOptionsProps) {
  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-600 mr-2 whitespace-nowrap">Sort by:</span>
      <Select value={sortOption} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

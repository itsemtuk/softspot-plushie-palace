
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortOptionsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  sortOption?: string;
  onSortChange?: (option: string) => void;
}

export function SortOptions({ value, onValueChange, sortOption, onSortChange }: SortOptionsProps) {
  // Use the newer props if available, otherwise fall back to legacy props
  const currentValue = value || sortOption || "newest";
  const handleChange = onValueChange || onSortChange || (() => {});

  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-600 mr-2 whitespace-nowrap">Sort by:</span>
      <Select value={currentValue} onValueChange={handleChange}>
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

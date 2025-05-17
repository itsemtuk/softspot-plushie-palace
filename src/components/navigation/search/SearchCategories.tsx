
import React from "react";
import { Link } from "react-router-dom";

interface SearchCategoriesProps {
  categories: string[];
  setIsOpen: (isOpen: boolean) => void;
}

export const SearchCategories = ({ categories, setIsOpen }: SearchCategoriesProps) => {
  return (
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
  );
};

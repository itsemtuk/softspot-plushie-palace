
import React from "react";
import { Link } from "react-router-dom";

interface SearchFooterProps {
  setIsOpen: (isOpen: boolean) => void;
}

export const SearchFooter = ({ setIsOpen }: SearchFooterProps) => {
  return (
    <div className="pt-2 border-t">
      <Link 
        to="/discover" 
        className="flex items-center justify-center w-full text-sm text-softspot-500 hover:text-softspot-600"
        onClick={() => setIsOpen(false)}
      >
        Advanced Search
      </Link>
    </div>
  );
};

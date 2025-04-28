
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const SearchBar = () => {
  return (
    <Link to="/discover" className="nav-link">
      <Button variant="ghost" className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        Discover
      </Button>
    </Link>
  );
};

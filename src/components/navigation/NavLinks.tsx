
import { Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const NavLinks = () => {
  return (
    <>
      <Link to="/feed" className="nav-link">
        <Button variant="ghost" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Feed
        </Button>
      </Link>
      <Link to="/marketplace" className="nav-link">
        <Button variant="ghost" className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          Shop
        </Button>
      </Link>
    </>
  );
};

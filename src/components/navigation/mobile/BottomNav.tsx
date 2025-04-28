
import { Link } from "react-router-dom";
import { Home, Search, PlusSquare, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePostSheet } from "./CreatePostSheet";

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-softspot-100">
      <div className="flex items-center justify-around h-16">
        <Link to="/feed">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/discover">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </Link>
        <CreatePostSheet />
        <Link to="/marketplace">
          <Button variant="ghost" size="icon">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/profile">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

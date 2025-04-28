
import { Link } from "react-router-dom";
import { Home, Search, PlusSquare, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePostSheet } from "./CreatePostSheet";
import { useUser } from "@clerk/clerk-react";
import { UserStatusBadge } from "@/components/messaging/UserStatusBadge";

export function BottomNav() {
  const { user } = useUser();
  const userStatus = user?.publicMetadata?.status as "online" | "offline" | "away" | "busy" || "online";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-softspot-100 pb-safe">
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
        <Link to="/profile" className="relative">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          {user && (
            <UserStatusBadge 
              status={userStatus}
              className="absolute -bottom-1 -right-1"
              size="sm"
            />
          )}
        </Link>
      </div>
    </div>
  );
}

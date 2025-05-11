
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  ShoppingBag, 
  Heart, 
  User,
  PlusSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreatePostSheet } from "./CreatePostSheet";

interface BottomNavLinkProps {
  to: string;
  icon: React.ReactNode;
  isActive: boolean;
  label: string;
}

const BottomNavLink = ({ to, icon, isActive, label }: BottomNavLinkProps) => (
  <Link 
    to={to}
    className={cn(
      "flex flex-col items-center justify-center text-center py-1 flex-1",
      isActive ? "text-softspot-500" : "text-gray-500"
    )}
  >
    <div className="flex items-center justify-center w-6 h-6">
      {icon}
    </div>
    <span className={cn(
      "text-[9px] mt-1",
      isActive ? "font-medium" : "font-normal"
    )}>
      {label}
    </span>
  </Link>
);

export function BottomNav() {
  const location = useLocation();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const pathname = location.pathname;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 flex bg-white border-t border-gray-200 h-16 z-20 pb-safe">
        <BottomNavLink 
          to="/feed" 
          icon={<Home className="w-5 h-5" />} 
          isActive={pathname === "/feed"}
          label="Feed"
        />
        
        <BottomNavLink 
          to="/discover" 
          icon={<Search className="w-5 h-5" />} 
          isActive={pathname === "/discover"}
          label="Discover"
        />
        
        <div className="flex flex-col items-center justify-center flex-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 w-10 rounded-full border-softspot-200 flex items-center justify-center p-0"
            onClick={() => setIsCreateSheetOpen(true)}
          >
            <PlusSquare className="h-5 w-5 text-softspot-500" />
          </Button>
          <span className="text-[9px] mt-1">Create</span>
        </div>
        
        <BottomNavLink 
          to="/marketplace" 
          icon={<ShoppingBag className="w-5 h-5" />} 
          isActive={pathname.startsWith("/marketplace")}
          label="Shop"
        />
        
        <BottomNavLink 
          to="/profile" 
          icon={<User className="w-5 h-5" />} 
          isActive={pathname === "/profile"}
          label="Profile"
        />
      </div>

      <CreatePostSheet 
        open={isCreateSheetOpen} 
        onOpenChange={setIsCreateSheetOpen}
      />
    </>
  );
}

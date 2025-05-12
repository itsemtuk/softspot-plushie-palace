
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  ShoppingBag, 
  User,
  PlusSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreatePostSheet } from "./CreatePostSheet";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface BottomNavLinkProps {
  to: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const BottomNavLink = ({ to, icon, isActive }: BottomNavLinkProps) => (
  <Link 
    to={to}
    className={cn(
      "flex flex-col items-center justify-center text-center py-3 flex-1",
      isActive ? "text-softspot-500" : "text-gray-500"
    )}
  >
    <div className="flex items-center justify-center w-6 h-6">
      {icon}
    </div>
  </Link>
);

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const pathname = location.pathname;

  const handleCreateButtonClick = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create content."
      });
      navigate("/sign-in");
      return;
    }
    
    setIsCreateSheetOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 flex bg-white border-t border-gray-200 h-16 z-20 pb-safe">
        <BottomNavLink 
          to="/feed" 
          icon={<Home className="w-5 h-5" />} 
          isActive={pathname === "/feed"}
        />
        
        <BottomNavLink 
          to="/discover" 
          icon={<Search className="w-5 h-5" />} 
          isActive={pathname === "/discover"}
        />
        
        <div className="flex flex-col items-center justify-center flex-1 py-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 w-10 rounded-full border-softspot-200 flex items-center justify-center p-0 bg-softspot-500 border-none"
            onClick={handleCreateButtonClick}
          >
            <PlusSquare className="h-5 w-5 text-white" />
          </Button>
        </div>
        
        <BottomNavLink 
          to="/marketplace" 
          icon={<ShoppingBag className="w-5 h-5" />} 
          isActive={pathname.startsWith("/marketplace")}
        />
        
        <BottomNavLink 
          to="/profile" 
          icon={<User className="w-5 h-5" />} 
          isActive={pathname === "/profile"}
        />
      </div>

      <CreatePostSheet 
        open={isCreateSheetOpen} 
        onOpenChange={setIsCreateSheetOpen}
      />
    </>
  );
}

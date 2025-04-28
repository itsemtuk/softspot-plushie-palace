
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { UserButton } from "./UserButton";
import { useUser } from "@clerk/clerk-react";
import { NotificationsButton } from "./NotificationsButton";
import { toast } from "@/components/ui/use-toast";

export const UserMenu = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  
  const handleAuthRequiredAction = (action: string, path: string) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to ${action}.`,
      });
      navigate("/sign-in");
      return false;
    }
    
    navigate(path);
    return true;
  };

  if (!isSignedIn) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/sign-in">
          <Button className="bg-softspot-400 hover:bg-softspot-500 text-white">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => handleAuthRequiredAction("access messages", "/messages")}
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
      <NotificationsButton />
      <div className="relative">
        <UserButton />
      </div>
    </div>
  );
};

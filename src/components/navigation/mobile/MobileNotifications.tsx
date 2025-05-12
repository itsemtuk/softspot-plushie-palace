
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";

export function MobileNotifications() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view notifications."
      });
      navigate("/sign-in");
      return;
    }
    
    navigate("/notifications");
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleClick}
    >
      <Bell className="h-5 w-5" />
    </Button>
  );
}

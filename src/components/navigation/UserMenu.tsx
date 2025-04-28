
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, MessageSquare } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

export const UserMenu = () => {
  return (
    <div className="flex items-center space-x-2">
      <Link to="/messages">
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </Link>
      <Link to="/profile">
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </Link>
      <UserButton 
        appearance={{
          elements: {
            userButtonAvatarBox: "w-9 h-9"
          }
        }}
        afterSignOutUrl="/"
      />
    </div>
  );
};

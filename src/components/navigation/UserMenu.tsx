
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { UserButton } from "./UserButton";
import { useUser } from "@clerk/clerk-react";

export const UserMenu = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center space-x-2">
      <Link to="/messages">
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </Link>
      <div className="relative">
        <UserButton />
      </div>
    </div>
  );
};

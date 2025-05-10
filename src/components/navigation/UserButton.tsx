
import { User, LogOut } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./user-button/UserAvatar";
import { UserStatusDropdown } from "./user-button/UserStatusDropdown";
import { ClerkButtonComponent } from "./user-button/ClerkIntegration";
import { useUserButtonState } from "./user-button/useUserButtonState";
import { useSignOut } from "@/hooks/useSignOut";
import { useNavigate } from "react-router-dom";

export const UserButton = () => {
  const navigate = useNavigate();
  
  const {
    userStatus,
    isClerkLoaded,
    isClerkConfigured,
    username,
    avatarUrl,
    handleChangeStatus
  } = useUserButtonState();
  
  const { handleSignOut } = useSignOut();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Profile clicked in UserButton, navigating to profile page");
    
    // Navigate to profile page using direct window.location to avoid potential React Router issues
    window.location.href = '/profile';
  };

  return (
    <div className="relative">
      {/* Hidden component to access Clerk hooks */}
      {isClerkLoaded && <ClerkButtonComponent />}
      
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <UserAvatar 
            username={username} 
            avatarUrl={avatarUrl} 
            status={userStatus} 
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white z-50 shadow-lg">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleProfileClick} className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          <UserStatusDropdown 
            currentStatus={userStatus}
            onStatusChange={handleChangeStatus}
          />
          
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

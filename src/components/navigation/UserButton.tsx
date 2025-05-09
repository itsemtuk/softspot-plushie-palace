
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

export const UserButton = () => {
  const {
    userStatus,
    isClerkLoaded,
    isClerkConfigured,
    username,
    avatarUrl,
    handleChangeStatus,
    handleProfileClick
  } = useUserButtonState();
  
  const { handleSignOut } = useSignOut();

  const onProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Profile clicked in UserButton");
    handleProfileClick();
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
          <DropdownMenuItem onClick={onProfileClick} className="flex items-center cursor-pointer">
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

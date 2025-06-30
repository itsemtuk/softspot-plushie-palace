
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
    
    // Navigate using React Router's navigate function with a slight delay
    // to avoid potential React Router issues
    setTimeout(() => {
      navigate('/profile');
    }, 10);
  };

  return (
    <div className="relative">
      {/* Only render ClerkButtonComponent when Clerk is configured and loaded */}
      {isClerkConfigured && isClerkLoaded && <ClerkButtonComponent />}
      
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <UserAvatar 
            username={username} 
            avatarUrl={avatarUrl} 
            status={userStatus} 
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="bg-white dark:bg-gray-800 z-50 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        >
          <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">My Account</DropdownMenuLabel>
          <DropdownMenuItem 
            onClick={handleProfileClick} 
            className="flex items-center cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
          >
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
          
          <UserStatusDropdown 
            currentStatus={userStatus}
            onStatusChange={handleChangeStatus}
          />
          
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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


import { UserButton as ClerkUserButton, useUser, useClerk } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { ActivityStatus } from "../ui/activity-status";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useClerkSync } from "@/hooks/useClerkSync";
import { Link } from "react-router-dom";
import { getUserStatus, setUserStatus } from "@/utils/storage/localStorageUtils";

export const UserButton = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [userStatus, setUserStatusState] = useState<"online" | "offline" | "away" | "busy">("online");
  const { updateClerkProfile } = useClerkSync();

  useEffect(() => {
    if (!user) return;
    
    // Get status from local storage first
    const localStatus = getUserStatus();
    setUserStatusState(localStatus);
    
    // Sync with Clerk metadata if different
    if (user.publicMetadata?.status && 
        user.publicMetadata?.status !== localStatus) {
      setUserStatus(user.publicMetadata?.status as "online" | "offline" | "away" | "busy");
    }
    
    // Update status to online when component mounts
    if (!user.publicMetadata?.status || user.publicMetadata?.status !== localStatus) {
      updateClerkProfile({
        publicMetadata: {
          ...user.publicMetadata,
          status: localStatus
        }
      });
    }

    // Set status to offline when window is closed or navigated away
    const handleBeforeUnload = () => {
      if (user) {
        setUserStatus("offline");
        // Synchronously update clerk without waiting for promise
        try {
          updateClerkProfile({
            publicMetadata: {
              ...user.publicMetadata,
              status: "offline"
            }
          });
        } catch (error) {
          console.error("Failed to update status on unload", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user, updateClerkProfile]);

  const handleChangeStatus = async (newStatus: "online" | "offline" | "away" | "busy") => {
    setUserStatusState(newStatus);
    
    // Update both local storage and clerk
    setUserStatus(newStatus);
    
    if (user) {
      try {
        await updateClerkProfile({
          publicMetadata: {
            ...user.publicMetadata,
            status: newStatus
          }
        });
      } catch (error) {
        console.error("Failed to update status", error);
      }
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="relative">
            <ClerkUserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-9 h-9",
                  userButtonPopoverCard: "hidden" // Hide Clerk's default popover
                }
              }}
            />
            <ActivityStatus 
              status={userStatus}
              className="absolute -bottom-1 -right-1"
              size="sm"
              pulseAnimation={userStatus === "online"}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs text-gray-500">Status</DropdownMenuLabel>
          <DropdownMenuItem className="flex items-center space-x-2" onClick={() => handleChangeStatus("online")}>
            <ActivityStatus status="online" size="sm" />
            <span>Online</span>
            {userStatus === "online" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center space-x-2" onClick={() => handleChangeStatus("busy")}>
            <ActivityStatus status="busy" size="sm" />
            <span>Busy</span>
            {userStatus === "busy" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center space-x-2" onClick={() => handleChangeStatus("away")}>
            <ActivityStatus status="away" size="sm" />
            <span>Away</span>
            {userStatus === "away" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center space-x-2" onClick={() => handleChangeStatus("offline")}>
            <ActivityStatus status="offline" size="sm" />
            <span>Appear offline</span>
            {userStatus === "offline" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

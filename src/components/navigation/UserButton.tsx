
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
import { Link, useNavigate } from "react-router-dom";
import { getUserStatus, setUserStatus } from "@/utils/storage/localStorageUtils";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Check if Clerk is configured by checking for the PUBLISHABLE_KEY environment variable
const isClerkConfigured = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_') && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_valid-test-key-for-dev-only";

export const UserButton = () => {
  const navigate = useNavigate();
  const [userStatus, setUserStatusState] = useState<"online" | "offline" | "away" | "busy">("online");
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [signOut, setSignOut] = useState<(() => Promise<void>) | null>(null);
  const [updateClerkProfile, setUpdateClerkProfile] = useState<((data: any) => Promise<any>) | null>(null);
  
  const username = localStorage.getItem('currentUsername') || "Anonymous";
  const avatarUrl = localStorage.getItem('userAvatarUrl') || "";

  // Load Clerk components dynamically if configured
  useEffect(() => {
    if (isClerkConfigured) {
      // Import Clerk components
      Promise.all([
        import('@clerk/clerk-react'),
        import('@/hooks/useClerkSync')
      ]).then(([clerk, clerkSync]) => {
        // Setup necessary functions
        const { useUser, useClerk } = clerk;
        const { useClerkSync } = clerkSync;
        
        // Create a temporary component to get hooks values
        const TempComponent = () => {
          const userValue = useUser();
          const clerkValue = useClerk();
          const syncValue = useClerkSync();
          
          // Store values in refs or state
          setUser(userValue.user);
          setSignOut(() => clerkValue.signOut);
          setUpdateClerkProfile(() => syncValue.updateClerkProfile);
          
          return null;
        };
        
        // Mark as loaded so the TempComponent can be rendered
        setIsClerkLoaded(true);
        
        // Cleanup function
        return () => {
          setIsClerkLoaded(false);
        };
      }).catch(error => {
        console.error("Failed to load Clerk components:", error);
      });
    }
  }, []);
  
  // This effect runs after Clerk is loaded and handles user status
  useEffect(() => {
    if (!user) return;
    
    // Get status from local storage first
    const localStatus = getUserStatus();
    setUserStatusState(localStatus);
    
    // Sync with Clerk metadata if different and if Clerk is available
    if (isClerkConfigured && user && updateClerkProfile) {
      const clerkStatus = user.unsafeMetadata?.status as string;
      if (clerkStatus && clerkStatus !== localStatus) {
        setUserStatus(clerkStatus as "online" | "offline" | "away" | "busy");
      }
      
      // Update status to online when component mounts
      if (!clerkStatus || clerkStatus !== localStatus) {
        updateClerkProfile({
          status: localStatus
        });
      }
    }

    // Set status to offline when window is closed or navigated away
    const handleBeforeUnload = () => {
      setUserStatus("offline");
      // Synchronously update clerk without waiting for promise
      if (isClerkConfigured && user && updateClerkProfile) {
        try {
          updateClerkProfile({
            status: "offline"
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
    
    // Update local storage
    setUserStatus(newStatus);
    
    // Update Clerk if available
    if (isClerkConfigured && user && updateClerkProfile) {
      try {
        await updateClerkProfile({
          status: newStatus
        });
      } catch (error) {
        console.error("Failed to update status", error);
      }
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSignOut = async () => {
    try {
      // First, sign out from Clerk if available
      if (isClerkConfigured && signOut) {
        await signOut();
      }
      
      // Clear local storage values
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('currentUsername');
      localStorage.setItem('userStatus', 'offline');
      
      // Navigate to home page
      navigate('/');
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was a problem signing out. Please try again."
      });
    }
  };

  // Regular avatar with dropdown menu
  const renderUserButton = () => {
    const userInitial = username ? username.charAt(0).toUpperCase() : "A";
    
    return (
      <div className="relative">
        <Avatar className="h-9 w-9">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={username} /> : null}
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        <ActivityStatus 
          status={userStatus}
          className="absolute -bottom-1 -right-1"
          size="sm"
          pulseAnimation={userStatus === "online"}
        />
      </div>
    );
  };

  // Render ClerkUserButton helper component if Clerk is loaded
  const ClerkButtonComponent = isClerkLoaded ? () => {
    // This is intentionally empty as it's only used to access Clerk hooks
    return null;
  } : null;

  return (
    <div className="relative">
      {/* Hidden component to access Clerk hooks */}
      {isClerkLoaded && ClerkButtonComponent && <ClerkButtonComponent />}
      
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="relative">
            {renderUserButton()}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white z-50 shadow-lg">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleProfileClick} className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
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

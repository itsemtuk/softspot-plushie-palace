
import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { 
  DropdownMenuItem, 
  DropdownMenuPortal, 
  DropdownMenuSub, 
  DropdownMenuSubContent, 
  DropdownMenuSubTrigger, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem 
} from "@/components/ui/dropdown-menu";
import { useStatus } from "@/hooks/use-status";
import { toast } from "@/components/ui/use-toast";

interface UserStatusDropdownProps {
  currentStatus: "online" | "offline" | "away" | "busy";
  onStatusChange: (status: "online" | "offline" | "away" | "busy") => void;
}

export const UserStatusDropdown = ({ 
  currentStatus,
  onStatusChange
}: UserStatusDropdownProps) => {
  const { updateStatus } = useStatus();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (status: "online" | "offline" | "away" | "busy") => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await updateStatus(status);
      onStatusChange(status);
      toast({
        title: "Status updated",
        description: `Your status is now set to ${status}.`
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        variant: "destructive",
        title: "Status update failed",
        description: "There was an error updating your status."
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "offline": return "bg-gray-500";
      case "away": return "bg-yellow-500";
      case "busy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center">
        <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(currentStatus)}`}></div>
        <span className="capitalize">{currentStatus}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="w-48">
          <DropdownMenuRadioGroup value={currentStatus}>
            <DropdownMenuRadioItem 
              value="online" 
              onClick={() => handleStatusChange("online")}
              className="flex items-center cursor-pointer"
            >
              <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
              <span>Online</span>
              {currentStatus === "online" && <CheckIcon className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
            
            <DropdownMenuRadioItem 
              value="away" 
              onClick={() => handleStatusChange("away")}
              className="flex items-center cursor-pointer"
            >
              <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
              <span>Away</span>
              {currentStatus === "away" && <CheckIcon className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
            
            <DropdownMenuRadioItem 
              value="busy" 
              onClick={() => handleStatusChange("busy")}
              className="flex items-center cursor-pointer"
            >
              <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
              <span>Busy</span>
              {currentStatus === "busy" && <CheckIcon className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
            
            <DropdownMenuRadioItem 
              value="offline" 
              onClick={() => handleStatusChange("offline")}
              className="flex items-center cursor-pointer"
            >
              <div className="mr-2 h-2 w-2 rounded-full bg-gray-500"></div>
              <span>Offline</span>
              {currentStatus === "offline" && <CheckIcon className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

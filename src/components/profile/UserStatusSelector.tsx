
import { useState, useEffect } from "react";
import { useClerkSync } from "@/hooks/useClerkSync";
import { getUserStatus, setUserStatus } from "@/utils/storage/localStorageUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserStatusBadge } from "@/components/messaging/UserStatusBadge";
import { toast } from "@/hooks/use-toast";

type StatusOption = {
  value: "online" | "offline" | "away" | "busy";
  label: string;
};

const statusOptions: StatusOption[] = [
  { value: "online", label: "Online" },
  { value: "busy", label: "Busy" },
  { value: "away", label: "Away" },
  { value: "offline", label: "Offline" },
];

export function UserStatusSelector() {
  const [currentStatus, setCurrentStatus] = useState<"online" | "offline" | "away" | "busy">("online");
  const { updateUserStatus } = useClerkSync();
  
  useEffect(() => {
    // Get saved status
    const savedStatus = getUserStatus();
    setCurrentStatus(savedStatus);
  }, []);
  
  const handleStatusChange = async (value: string) => {
    const newStatus = value as "online" | "offline" | "away" | "busy";
    setCurrentStatus(newStatus);
    
    try {
      await updateUserStatus(newStatus);
      // Save the status locally as a backup
      setUserStatus(newStatus);
      
      // Dispatch a custom event for other components to react
      window.dispatchEvent(new CustomEvent('user-status-change', { 
        detail: { status: newStatus } 
      }));
      
      toast({
        title: "Status updated",
        description: `Your status is now set to ${newStatus}`,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        variant: "destructive",
        title: "Status update failed",
        description: "Could not update your status. Please try again.",
      });
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center gap-2">
            <UserStatusBadge status={currentStatus} size="sm" />
            <SelectValue placeholder="Set status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <UserStatusBadge status={option.value} size="sm" />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

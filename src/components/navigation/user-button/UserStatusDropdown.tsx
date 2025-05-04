
import { useState } from "react";
import { 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ActivityStatus } from "@/components/ui/activity-status";

interface UserStatusDropdownProps {
  currentStatus: "online" | "offline" | "away" | "busy";
  onStatusChange: (status: "online" | "offline" | "away" | "busy") => void;
}

export const UserStatusDropdown = ({
  currentStatus,
  onStatusChange
}: UserStatusDropdownProps) => {
  return (
    <>
      <DropdownMenuLabel className="text-xs text-gray-500">Status</DropdownMenuLabel>
      <DropdownMenuItem className="flex items-center space-x-2" onClick={() => onStatusChange("online")}>
        <ActivityStatus status="online" size="sm" />
        <span>Online</span>
        {currentStatus === "online" && <span className="ml-auto">✓</span>}
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center space-x-2" onClick={() => onStatusChange("busy")}>
        <ActivityStatus status="busy" size="sm" />
        <span>Busy</span>
        {currentStatus === "busy" && <span className="ml-auto">✓</span>}
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center space-x-2" onClick={() => onStatusChange("away")}>
        <ActivityStatus status="away" size="sm" />
        <span>Away</span>
        {currentStatus === "away" && <span className="ml-auto">✓</span>}
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center space-x-2" onClick={() => onStatusChange("offline")}>
        <ActivityStatus status="offline" size="sm" />
        <span>Appear offline</span>
        {currentStatus === "offline" && <span className="ml-auto">✓</span>}
      </DropdownMenuItem>
    </>
  );
};

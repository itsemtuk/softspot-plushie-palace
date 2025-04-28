
import { useState, useEffect } from "react";
import { useClerkSync } from "@/hooks/useClerkSync";
import { getUserStatus } from "@/utils/storage/localStorageUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserStatusBadge } from "@/components/messaging/UserStatusBadge";

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
    await updateUserStatus(newStatus);
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

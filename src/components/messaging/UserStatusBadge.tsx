
import { ActivityStatus } from "@/components/ui/activity-status";

interface UserStatusBadgeProps {
  status: "online" | "offline" | "away" | "busy";
  className?: string;
}

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  return (
    <ActivityStatus 
      status={status} 
      className={className}
      size="sm"
      pulseAnimation={status === "online"}
    />
  );
}

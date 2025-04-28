
import { ActivityStatus } from "@/components/ui/activity-status";

interface UserStatusBadgeProps {
  status: "online" | "offline" | "away" | "busy";
  className?: string;
  pulseAnimation?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function UserStatusBadge({ 
  status, 
  className,
  pulseAnimation = status === "online",
  size = "sm"
}: UserStatusBadgeProps) {
  return (
    <ActivityStatus 
      status={status} 
      className={className}
      size={size}
      pulseAnimation={pulseAnimation}
    />
  );
}

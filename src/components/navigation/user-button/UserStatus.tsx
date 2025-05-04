
import { ActivityStatus } from "@/components/ui/activity-status";

interface UserStatusProps {
  status: "online" | "offline" | "away" | "busy";
}

export const UserStatus = ({ status }: UserStatusProps) => {
  return (
    <ActivityStatus 
      status={status}
      className="absolute -bottom-1 -right-1"
      size="sm"
      pulseAnimation={status === "online"}
    />
  );
};


import { cn } from "@/lib/utils";

interface UserStatusBadgeProps {
  status: "online" | "offline" | "away" | "busy";
  className?: string;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status, className }) => {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500"
  };

  return (
    <div
      className={cn(
        "h-2.5 w-2.5 rounded-full border-2 border-white",
        statusColors[status],
        className
      )}
    />
  );
};

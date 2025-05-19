
import { cn } from "@/lib/utils";

interface UserStatusBadgeProps {
  status: "online" | "offline" | "away" | "busy";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ 
  status, 
  className,
  size = "md" 
}) => {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500"
  };

  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3"
  };

  return (
    <div
      className={cn(
        "rounded-full border-2 border-white",
        statusColors[status],
        sizeClasses[size],
        className
      )}
    />
  );
};

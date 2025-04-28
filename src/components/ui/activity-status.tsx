
import * as React from "react";
import { cn } from "@/lib/utils";

interface ActivityStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "online" | "offline" | "away" | "busy";
  size?: "sm" | "md" | "lg";
}

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500"
};

const sizes = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4"
};

export function ActivityStatus({
  status,
  size = "md",
  className,
  ...props
}: ActivityStatusProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full",
        sizes[size],
        statusColors[status],
        "animate-pulse",
        className
      )}
      {...props}
    />
  );
}

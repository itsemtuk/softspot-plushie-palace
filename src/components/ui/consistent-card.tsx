
import React from "react";
import { Card, CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ConsistentCardProps extends CardProps {
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
}

export const ConsistentCard = React.forwardRef<HTMLDivElement, ConsistentCardProps>(
  ({ className, padding = "md", shadow = "sm", ...props }, ref) => {
    const paddingStyles = {
      none: "",
      sm: "p-3",
      md: "p-6", 
      lg: "p-8"
    };

    const shadowStyles = {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg"
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200",
          paddingStyles[padding],
          shadowStyles[shadow],
          className
        )}
        {...props}
      />
    );
  }
);

ConsistentCard.displayName = "ConsistentCard";

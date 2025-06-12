
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConsistentButtonProps extends ButtonProps {
  intent?: "primary" | "secondary" | "danger" | "success";
}

export const ConsistentButton = React.forwardRef<HTMLButtonElement, ConsistentButtonProps>(
  ({ className, intent = "primary", variant, ...props }, ref) => {
    const intentStyles = {
      primary: "bg-softspot-500 hover:bg-softspot-600 text-white",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100",
      danger: "bg-red-500 hover:bg-red-600 text-white",
      success: "bg-green-500 hover:bg-green-600 text-white"
    };

    // Override variant if intent is provided and variant is default
    const finalVariant = variant || (intent === "primary" ? "default" : "outline");

    return (
      <Button
        ref={ref}
        variant={finalVariant}
        className={cn(
          "transition-colors duration-200",
          intent !== "primary" && intentStyles[intent],
          className
        )}
        {...props}
      />
    );
  }
);

ConsistentButton.displayName = "ConsistentButton";

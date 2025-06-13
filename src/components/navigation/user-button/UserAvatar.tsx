
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  username?: string | null;
  avatarUrl?: string | null;
  status?: string;
  className?: string;
}

export const UserAvatar = ({ username, avatarUrl, status, className }: UserAvatarProps) => {
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      case "offline":
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="relative">
      <Avatar className={cn("h-8 w-8 cursor-pointer transition-transform hover:scale-105", className)}>
        <AvatarImage 
          src={avatarUrl || undefined} 
          alt={username || "User"}
          className="object-cover"
        />
        <AvatarFallback className="bg-softspot-100 text-softspot-700 text-sm font-medium">
          {getInitials(username)}
        </AvatarFallback>
      </Avatar>
      
      {status && (
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
          getStatusColor(status)
        )} />
      )}
    </div>
  );
};

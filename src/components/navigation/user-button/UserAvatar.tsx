
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserStatus } from "./UserStatus";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string;
  status: "online" | "offline" | "away" | "busy";
}

export const UserAvatar = ({ username, avatarUrl, status }: UserAvatarProps) => {
  const userInitial = username ? username.charAt(0).toUpperCase() : "A";
  
  return (
    <div className="relative">
      <Avatar className="h-9 w-9">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt={username} /> : null}
        <AvatarFallback>{userInitial}</AvatarFallback>
      </Avatar>
      <UserStatus status={status} />
    </div>
  );
};

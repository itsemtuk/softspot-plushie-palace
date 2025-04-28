
import { UserButton as ClerkUserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { ActivityStatus } from "../ui/activity-status";

export const UserButton = () => {
  const { user } = useUser();
  const userStatus = user?.publicMetadata?.status as "online" | "offline" | "away" | "busy" || "offline";

  return (
    <div className="relative">
      <ClerkUserButton 
        appearance={{
          elements: {
            userButtonAvatarBox: "w-9 h-9"
          }
        }}
        afterSignOutUrl="/"
      />
      <ActivityStatus 
        status={userStatus}
        className="absolute -bottom-1 -right-1"
        size="sm"
      />
    </div>
  );
};

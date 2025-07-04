import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfilePhotoProps {
  avatarUrl?: string | null;
  username?: string | null;
  firstName?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}

export const UserProfilePhoto = ({ 
  avatarUrl, 
  username, 
  firstName, 
  size = "md" 
}: UserProfilePhotoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-28 w-28"
  };

  const displayName = username || firstName || "User";
  const fallbackInitial = displayName.charAt(0).toUpperCase();
  
  // Use avatarUrl if available, otherwise use default plushie avatar
  const imageUrl = avatarUrl || "/assets/avatars/PLUSH_Bear.PNG";

  return (
    <Avatar className={`${sizeClasses[size]} border-4 border-white shadow-lg`}>
      <AvatarImage 
        src={imageUrl} 
        alt={`${displayName}'s profile`}
        className="object-cover"
      />
      <AvatarFallback className="bg-softspot-200 text-softspot-700 font-medium">
        {fallbackInitial}
      </AvatarFallback>
    </Avatar>
  );
};
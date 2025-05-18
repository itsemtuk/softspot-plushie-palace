
import { Badge } from "@/components/ui/badge";

export interface ProfileInfoProps {
  bio: string;
  displayName: string;
  interests?: string[];
  username?: string;
  isCurrentUser?: boolean;
}

export function ProfileInfo({ bio, displayName, interests = [], username, isCurrentUser }: ProfileInfoProps) {
  return (
    <div className="mt-3 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold">{displayName}</h2>
          {username && <p className="text-sm text-gray-500">@{username}</p>}
        </div>
        {isCurrentUser && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mt-1 sm:mt-0">
            Your profile
          </span>
        )}
      </div>
      
      <p className="text-gray-700 my-2">{bio || "No bio yet"}</p>
      
      {interests && interests.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {interests.map((interest, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 hover:bg-gray-200">
              {interest}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

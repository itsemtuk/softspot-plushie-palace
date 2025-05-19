
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserStatusBadge } from "@/components/messaging/UserStatusBadge";

export interface ProfileInfoProps {
  bio: string;
  displayName: string;
  interests?: string[];
  username?: string;
  isCurrentUser?: boolean;
  joinDate?: string;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  status?: "online" | "offline" | "away" | "busy";
}

export function ProfileInfo({ 
  bio, 
  displayName, 
  interests = [], 
  username, 
  isCurrentUser, 
  joinDate,
  postsCount,
  followersCount,
  followingCount,
  status = "online"
}: ProfileInfoProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="mt-3 w-full max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{displayName}</h2>
          {username && <p className="text-sm text-gray-500">@{username}</p>}
          {status && (
            <div className="flex items-center gap-1 ml-2">
              <UserStatusBadge status={status} size="sm" />
              <span className="text-xs text-gray-500 capitalize">{status}</span>
            </div>
          )}
        </div>
        {isCurrentUser && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mt-1 sm:mt-0">
            Your profile
          </span>
        )}
      </div>
      
      <p className="text-gray-700 my-2">{bio || "No bio yet"}</p>
      
      {/* Stats row */}
      {(postsCount !== undefined || followersCount !== undefined || followingCount !== undefined) && (
        <div className="flex gap-4 text-sm text-gray-600 my-3">
          {postsCount !== undefined && (
            <div>
              <span className="font-semibold">{postsCount}</span> posts
            </div>
          )}
          {followersCount !== undefined && (
            <div>
              <span className="font-semibold">{followersCount}</span> followers
            </div>
          )}
          {followingCount !== undefined && (
            <div>
              <span className="font-semibold">{followingCount}</span> following
            </div>
          )}
          {joinDate && (
            <div>
              Joined {formatDate(joinDate)}
            </div>
          )}
        </div>
      )}
      
      {/* Interests tags */}
      {interests && interests.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {interests.map((interest, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className="bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    {interest}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>See more about {interest}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  );
}

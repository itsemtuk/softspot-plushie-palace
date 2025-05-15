
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  image: string;
  tier?: number;
}

interface ProfileBadgesProps {
  badges: BadgeData[];
  completedCount: number;
  totalCount: number;
  showAll?: boolean;
}

export function ProfileBadges({ badges, completedCount, totalCount, showAll = false }: ProfileBadgesProps) {
  const visibleBadges = showAll ? badges : badges.filter(badge => badge.completed);
  
  const getBadgePath = (badgeId: string) => {
    const badgeImageMap: Record<string, string> = {
      "changed_profile_photo": "/assets/Badges/Changed_Profile_Photo.PNG",
      "completed_profile": "/assets/Badges/Completed_Profile.PNG",
      "first_post": "/assets/Badges/First_Post.PNG",
      "first_sale": "/assets/Badges/First_Sale.PNG",
      "plushie_preferences": "/assets/Badges/Plushie_Preferences.PNG",
      "verified_account": "/assets/Badges/Verified_Account.PNG", // Default fallback
      "collection_started": "/assets/Badges/Collection_Started.PNG" // Default fallback
    };
    
    return badgeImageMap[badgeId] || `/assets/Badges/Verified_Account.PNG`;
  };
  
  if (badges.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No badges yet</h3>
        <p className="text-gray-500 mt-2">
          Complete actions to earn badges
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Badges Progress</h3>
          <p className="text-sm text-gray-600">
            {completedCount} of {totalCount} badges earned
          </p>
        </div>
        <Badge variant="outline" className="font-semibold">
          {Math.round((completedCount / Math.max(totalCount, 1)) * 100)}%
        </Badge>
      </div>
      
      <Progress 
        value={(completedCount / Math.max(totalCount, 1)) * 100} 
        className="h-2 mb-6" 
      />
      
      <div className="grid grid-cols-3 gap-4">
        {visibleBadges.map((badge) => (
          <div 
            key={badge.id} 
            className={`flex flex-col items-center p-3 rounded-lg border ${
              badge.completed ? "border-softspot-200 bg-softspot-50" : "border-gray-200 bg-gray-50 opacity-60"
            }`}
          >
            <div className="w-16 h-16 mb-2 rounded-full overflow-hidden relative">
              <img 
                src={getBadgePath(badge.id)} 
                alt={badge.name} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  console.error(`Failed to load badge image: ${badge.id}`);
                  (e.target as HTMLImageElement).src = "/assets/Badges/Verified_Account.PNG";
                }}
              />
              {!badge.completed && (
                <div className="absolute inset-0 bg-gray-200 bg-opacity-60 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">Locked</span>
                </div>
              )}
            </div>
            <h4 className="font-medium text-center text-xs">{badge.name}</h4>
          </div>
        ))}
      </div>
      
      {!showAll && completedCount < totalCount && (
        <p className="text-sm text-center text-gray-500 mt-4">
          {totalCount - completedCount} more badges to unlock
        </p>
      )}
    </div>
  );
}

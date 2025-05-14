
import { useState } from "react";
import { Badge as BadgeType } from "@/types/marketplace";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock } from "lucide-react";

interface ProfileBadgesProps {
  badges: BadgeType[];
  completedCount: number;
  totalCount: number;
  showAll?: boolean;
}

export const ProfileBadges = ({ badges, completedCount, totalCount, showAll = false }: ProfileBadgesProps) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  
  const earnedBadges = badges.filter(badge => badge.earned);
  const displayBadges = showAll ? badges : earnedBadges;
  const isVerified = earnedBadges.length === totalCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">
          Badges {!showAll && (
            <span className="text-gray-500 text-sm font-normal">
              ({earnedBadges.length}/{totalCount})
            </span>
          )}
        </h2>
        
        {isVerified && (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Profile
          </Badge>
        )}
      </div>
      
      {!isVerified && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Profile completion</span>
            <span>{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <Progress value={(completedCount / totalCount) * 100} className="h-2" />
        </div>
      )}

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {displayBadges.map((badge) => (
          <Dialog key={badge.id}>
            <DialogTrigger asChild>
              <button
                className="relative rounded-md overflow-hidden hover:ring-2 hover:ring-softspot-300 transition-all"
                onClick={() => setSelectedBadge(badge)}
              >
                <AspectRatio ratio={1/1} className="w-full">
                  <div className={`h-full w-full flex items-center justify-center ${!badge.earned ? 'opacity-50 grayscale' : ''}`}>
                    <img 
                      src={badge.imagePath} 
                      alt={badge.name} 
                      className="object-cover w-full h-full" 
                    />
                    {!badge.earned && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Lock className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                </AspectRatio>
              </button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <div className="w-12 h-12 mr-3">
                    <img 
                      src={badge.imagePath} 
                      alt={badge.name} 
                      className={`w-full h-full object-contain ${!badge.earned ? 'opacity-50 grayscale' : ''}`} 
                    />
                  </div>
                  <div>
                    {badge.name}
                    {badge.isSpecial && (
                      <Badge 
                        variant="warning" 
                        className="ml-2 text-xs"
                      >
                        Special
                      </Badge>
                    )}
                  </div>
                </DialogTitle>
                <DialogDescription className="pt-2">
                  <p className="text-gray-700 mb-3">{badge.description}</p>
                  
                  {badge.earned ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <p className="font-medium text-green-700">Badge earned!</p>
                        {badge.earnedAt && (
                          <p className="text-xs text-green-600">Earned on {new Date(badge.earnedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">Requirements:</p>
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        {badge.progress !== undefined && badge.maxProgress !== undefined && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{badge.progress}/{badge.maxProgress}</span>
                            </div>
                            <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-1" />
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-700">
                          {badge.criteria.requiresProfilePicture && (
                            <p>• Add a profile picture</p>
                          )}
                          {badge.criteria.requiresPlushiePreferences && (
                            <p>• Select your plushie preferences</p>
                          )}
                          {badge.criteria.requiresCompletedProfile && (
                            <p>• Complete your profile information</p>
                          )}
                          {badge.criteria.requiresFeedPosts !== undefined && (
                            <p>• Create {badge.criteria.requiresFeedPosts} feed posts</p>
                          )}
                          {badge.criteria.requiresListedItems !== undefined && (
                            <p>• List {badge.criteria.requiresListedItems} items for sale</p>
                          )}
                          {badge.criteria.requiresSoldItems !== undefined && (
                            <p>• Sell {badge.criteria.requiresSoldItems} items</p>
                          )}
                          {badge.criteria.requiresWishlist && (
                            <p>• Create a wishlist</p>
                          )}
                          {badge.criteria.requiresFollowers !== undefined && (
                            <p>• Get {badge.criteria.requiresFollowers} followers</p>
                          )}
                          {badge.criteria.specialBadgeType && (
                            <p>• Special badge for {badge.criteria.specialBadgeType.replace('_', ' ')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

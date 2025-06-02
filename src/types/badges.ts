
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: BadgeCriteria;
  type: BadgeType;
  earned?: boolean; // Add earned property
  progress?: number; // Add progress property
  earnedAt?: string; // Add earnedAt property
  imagePath?: string; // Add imagePath property
  isSpecial?: boolean; // Add isSpecial property
}

export interface BadgeCriteria {
  requirement: string;
  value: number;
  type?: string;
  threshold?: number;
  description?: string; // Add description property
  requiresProfilePicture?: boolean;
  requiresPlushiePreferences?: boolean;
  requiresCompletedProfile?: boolean;
  requiresFeedPosts?: number;
  requiresListedItems?: number;
  requiresSoldItems?: number;
  requiresWishlist?: boolean;
  requiresFollowers?: number;
  specialBadgeType?: string;
}

export type BadgeType = 'achievement' | 'milestone' | 'special';

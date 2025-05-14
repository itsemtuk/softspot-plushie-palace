
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Badge, BadgeCriteria } from '@/types/marketplace';
import { getAllUserPosts } from '@/utils/postStorage';

const badgeDefinitions: Partial<Badge>[] = [
  {
    id: 'profile_photo',
    name: 'Profile Photo',
    description: 'Added a profile photo to your account',
    imagePath: '/assets/badges/default-badge.png',
    type: 'achievement',
    criteria: {
      requiresProfilePicture: true
    }
  },
  {
    id: 'plushie_preferences',
    name: 'Plushie Preferences',
    description: 'Selected your plushie preferences',
    imagePath: '/assets/badges/default-badge.png',
    type: 'achievement',
    criteria: {
      requiresPlushiePreferences: true
    }
  },
  {
    id: 'complete_profile',
    name: 'Complete Profile',
    description: 'Completed your profile information',
    imagePath: '/assets/badges/default-badge.png',
    type: 'achievement',
    criteria: {
      requiresCompletedProfile: true
    }
  },
  {
    id: 'first_post',
    name: 'First Post',
    description: 'Created your first post',
    imagePath: '/assets/badges/default-badge.png',
    type: 'achievement',
    criteria: {
      requiresFeedPosts: 1
    }
  },
  {
    id: 'marketplace_vendor',
    name: 'Marketplace Vendor',
    description: 'Listed your first item for sale',
    imagePath: '/assets/badges/default-badge.png',
    type: 'achievement',
    criteria: {
      requiresListedItems: 1
    }
  },
  {
    id: 'first_sale',
    name: 'First Sale',
    description: 'Sold your first item',
    imagePath: '/assets/badges/default-badge.png',
    type: 'achievement',
    criteria: {
      requiresSoldItems: 1
    }
  },
  {
    id: 'wishlist_creator',
    name: 'Wishlist Creator',
    description: 'Created your first wishlist',
    imagePath: '/assets/badges/default-badge.png',
    type: 'achievement',
    criteria: {
      requiresWishlist: true
    }
  },
  {
    id: 'first_followers',
    name: 'First Followers',
    description: 'Reached 10 followers',
    imagePath: '/assets/badges/default-badge.png',
    type: 'milestone',
    criteria: {
      requiresFollowers: 10
    }
  },
  {
    id: 'popular_collector',
    name: 'Popular Collector',
    description: 'Reached 20 followers',
    imagePath: '/assets/badges/default-badge.png',
    type: 'milestone',
    criteria: {
      requiresFollowers: 20
    }
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Reached 50 followers',
    imagePath: '/assets/badges/default-badge.png',
    type: 'milestone',
    criteria: {
      requiresFollowers: 50
    }
  },
  {
    id: 'plushie_celebrity',
    name: 'Plushie Celebrity',
    description: 'Reached 100 followers',
    imagePath: '/assets/badges/default-badge.png',
    type: 'milestone',
    criteria: {
      requiresFollowers: 100
    }
  },
  {
    id: 'alpha_tester',
    name: 'Alpha Tester',
    description: 'Participated in the alpha testing phase',
    imagePath: '/assets/Badges/Alpha_Tester.PNG',
    type: 'special',
    isSpecial: true,
    criteria: {
      specialBadgeType: 'alpha_tester'
    }
  },
  {
    id: 'beta_tester',
    name: 'Beta Tester',
    description: 'Participated in the beta testing phase',
    imagePath: '/assets/Badges/Beta_Tester.PNG',
    type: 'special',
    isSpecial: true,
    criteria: {
      specialBadgeType: 'beta_tester'
    }
  }
];

export function useBadges(userId?: string) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    const loadBadges = async () => {
      setLoading(true);
      try {
        const targetUser = userId ? { id: userId } : user;
        
        if (!targetUser) {
          setBadges([]);
          setLoading(false);
          return;
        }

        // Get user data for badge evaluation
        const userMeta = user?.unsafeMetadata || {};
        const userPosts = await getAllUserPosts(targetUser.id);
        const regularPosts = userPosts.filter(post => !post.forSale);
        const listingsCount = userPosts.filter(post => post.forSale).length;
        const hasSold = Boolean(userMeta.salesCount);
        const hasWishlist = Boolean(userMeta.wishlists?.length);
        const followerCount = Number(userMeta.followerCount) || 0;
        const isProfileComplete = Boolean(user?.username && userMeta.bio);
        
        // Special badges (alpha/beta tester)
        const isAlphaTester = Boolean(userMeta.isAlphaTester);
        const isBetaTester = Boolean(userMeta.isBetaTester);

        // Evaluate each badge
        const evaluatedBadges = badgeDefinitions.map<Badge>(badgeDef => {
          const { criteria } = badgeDef;
          let earned = false;
          let progress = 0;
          let maxProgress = 0;
          
          // Check criteria
          if (criteria.requiresProfilePicture) {
            earned = Boolean(user?.imageUrl);
          } 
          else if (criteria.requiresPlushiePreferences) {
            earned = Boolean(userMeta.plushieInterests?.length);
          }
          else if (criteria.requiresCompletedProfile) {
            earned = isProfileComplete;
          }
          else if (criteria.requiresFeedPosts !== undefined) {
            earned = regularPosts.length >= criteria.requiresFeedPosts;
            progress = Math.min(regularPosts.length, criteria.requiresFeedPosts);
            maxProgress = criteria.requiresFeedPosts;
          }
          else if (criteria.requiresListedItems !== undefined) {
            earned = listingsCount >= criteria.requiresListedItems;
            progress = Math.min(listingsCount, criteria.requiresListedItems);
            maxProgress = criteria.requiresListedItems;
          }
          else if (criteria.requiresSoldItems !== undefined) {
            earned = hasSold && (userMeta.salesCount >= criteria.requiresSoldItems);
            progress = Math.min(userMeta.salesCount || 0, criteria.requiresSoldItems);
            maxProgress = criteria.requiresSoldItems;
          }
          else if (criteria.requiresWishlist) {
            earned = hasWishlist;
          }
          else if (criteria.requiresFollowers !== undefined) {
            earned = followerCount >= criteria.requiresFollowers;
            progress = Math.min(followerCount, criteria.requiresFollowers);
            maxProgress = criteria.requiresFollowers;
          }
          else if (criteria.specialBadgeType === 'alpha_tester') {
            earned = isAlphaTester;
          }
          else if (criteria.specialBadgeType === 'beta_tester') {
            earned = isBetaTester;
          }
          
          return {
            ...badgeDef,
            earned,
            progress,
            maxProgress,
            earnedAt: earned ? new Date().toISOString() : undefined
          } as Badge;
        });
        
        // Save badges and count completed
        setBadges(evaluatedBadges);
        setCompletedCount(evaluatedBadges.filter(b => b.earned).length);
        setLoading(false);
        
        // If it's the current user's profile and they check badges, store the timestamp
        if (!userId && user) {
          user.update({
            unsafeMetadata: {
              ...userMeta,
              lastBadgeCheck: new Date().toISOString()
            }
          });
        }
      } catch (error) {
        console.error('Error loading badges:', error);
        setLoading(false);
      }
    };
    
    loadBadges();
  }, [user, userId]);
  
  return { 
    badges, 
    loading, 
    completedCount,
    totalCount: badgeDefinitions.length,
    isVerified: completedCount === badgeDefinitions.length
  };
}

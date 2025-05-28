import { useEffect, useState } from "react";
import { Badge, BadgeCriteria, BadgeType } from "@/types/marketplace";
import { useUser } from "@clerk/clerk-react";
import { getUserPosts } from "@/utils/posts/postFetch";

export const useBadges = () => {
  const { user } = useUser();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  // Base badges that every user can earn
  const baseBadges: Badge[] = [
    {
      id: "profile-pic",
      name: "Profile Picture",
      description: "Set a profile picture to personalize your account",
      imagePath: "/assets/Badges/profile-pic-badge.png",
      earned: false,
      icon: "user",
      criteria: {
        type: "achievement" as BadgeType,
        threshold: 1,
        description: "Set a profile picture",
        requiresProfilePicture: true
      }
    },
    {
      id: "preferences",
      name: "Plushie Preferences",
      description: "Share your plushie preferences with the community",
      imagePath: "/assets/Badges/preferences-badge.png",
      earned: false,
      icon: "heart",
      criteria: {
        type: "achievement" as BadgeType,
        threshold: 1,
        description: "Set plushie preferences",
        requiresPlushiePreferences: true
      }
    },
    {
      id: "complete-profile",
      name: "Complete Profile",
      description: "Fill out all your profile information",
      imagePath: "/assets/Badges/complete-profile-badge.png",
      earned: false,
      icon: "check",
      criteria: {
        type: "achievement" as BadgeType,
        threshold: 1,
        description: "Complete profile information",
        requiresCompletedProfile: true
      }
    },
    {
      id: "first-post",
      name: "First Post",
      description: "Share your first post with the community",
      imagePath: "/assets/Badges/first-post-badge.png",
      earned: false,
      icon: "edit",
      criteria: {
        type: "milestone" as BadgeType,
        threshold: 1,
        description: "Share your first post",
        requiresFeedPosts: 1
      },
      progress: 0
    },
    {
      id: "first-listing",
      name: "First Listing",
      description: "List your first item for sale",
      imagePath: "/assets/Badges/first-listing-badge.png",
      earned: false,
      icon: "shopping-cart",
      criteria: {
        type: "milestone" as BadgeType,
        threshold: 1,
        description: "List your first item",
        requiresListedItems: 1
      },
      progress: 0
    },
    {
      id: "first-sale",
      name: "First Sale",
      description: "Successfully sell your first item",
      imagePath: "/assets/Badges/first-sale-badge.png",
      earned: false,
      icon: "dollar-sign",
      criteria: {
        type: "milestone" as BadgeType,
        threshold: 1,
        description: "Complete your first sale",
        requiresSoldItems: 1
      },
      progress: 0
    },
    {
      id: "wishlist",
      name: "Wishlist Creator",
      description: "Create a wishlist to track plushies you want",
      imagePath: "/assets/Badges/wishlist-badge.png",
      earned: false,
      icon: "bookmark",
      criteria: {
        type: "achievement" as BadgeType,
        threshold: 1,
        description: "Create a wishlist",
        requiresWishlist: true
      }
    },
    {
      id: "10-followers",
      name: "10 Followers",
      description: "Have 10 people follow your profile",
      imagePath: "/assets/Badges/10-followers-badge.png",
      earned: false,
      icon: "users",
      criteria: {
        type: "milestone" as BadgeType,
        threshold: 10,
        description: "Gain 10 followers",
        requiresFollowers: 10
      },
      progress: 0
    },
    {
      id: "50-followers",
      name: "50 Followers",
      description: "Have 50 people follow your profile",
      imagePath: "/assets/Badges/50-followers-badge.png",
      earned: false,
      icon: "users",
      criteria: {
        type: "milestone" as BadgeType,
        threshold: 50,
        description: "Gain 50 followers",
        requiresFollowers: 50
      },
      progress: 0
    },
    {
      id: "100-followers",
      name: "100 Followers",
      description: "Have 100 people follow your profile",
      imagePath: "/assets/Badges/100-followers-badge.png",
      earned: false,
      icon: "users",
      criteria: {
        type: "milestone" as BadgeType,
        threshold: 100,
        description: "Gain 100 followers",
        requiresFollowers: 100
      },
      progress: 0
    },
  ];

  // Special badges that only specific users can earn
  const specialBadges: Badge[] = [
    {
      id: "alpha-tester",
      name: "Alpha Tester",
      description: "One of the first users to test our platform",
      imagePath: "/assets/Badges/Alpha_Tester.PNG",
      earned: false,
      isSpecial: true,
      icon: "star",
      criteria: {
        type: "special" as BadgeType,
        threshold: 1,
        description: "Alpha testing participation",
        specialBadgeType: "alpha_tester"
      }
    },
    {
      id: "beta-tester",
      name: "Beta Tester",
      description: "Helped test our platform before public release",
      imagePath: "/assets/Badges/Beta_Tester.PNG",
      earned: false,
      isSpecial: true,
      icon: "star",
      criteria: {
        type: "special" as BadgeType,
        threshold: 1,
        description: "Beta testing participation",
        specialBadgeType: "beta_tester"
      }
    }
  ];

  // Check if the user qualifies for special badges
  const checkForSpecialBadges = (allBadges: Badge[]): Badge[] => {
    // Check for user metadata to determine if they're alpha/beta testers
    const userMetadata = user?.publicMetadata || {};
    const updatedBadges = [...allBadges];
    
    // Check for alpha tester status
    const alphaIndex = updatedBadges.findIndex(b => b.id === "alpha-tester");
    if (alphaIndex !== -1 && userMetadata.isTester === "alpha") {
      updatedBadges[alphaIndex] = {
        ...updatedBadges[alphaIndex],
        earned: true,
        earnedAt: new Date().toISOString()
      };
    }
    
    // Check for beta tester status
    const betaIndex = updatedBadges.findIndex(b => b.id === "beta-tester");
    if (betaIndex !== -1 && userMetadata.isTester === "beta") {
      updatedBadges[betaIndex] = {
        ...updatedBadges[betaIndex],
        earned: true,
        earnedAt: new Date().toISOString()
      };
    }
    
    return updatedBadges;
  };

  // Evaluate profile picture badge
  const checkProfilePictureBadge = (allBadges: Badge[]): Badge[] => {
    const updatedBadges = [...allBadges];
    const badgeIndex = updatedBadges.findIndex(b => b.id === "profile-pic");
    
    if (badgeIndex !== -1) {
      const hasProfilePic = !!user?.imageUrl && user.imageUrl !== "";
      
      if (hasProfilePic && !updatedBadges[badgeIndex].earned) {
        updatedBadges[badgeIndex] = {
          ...updatedBadges[badgeIndex],
          earned: true,
          earnedAt: new Date().toISOString()
        };
      }
    }
    
    return updatedBadges;
  };

  // Evaluate plushie preferences badge
  const checkPreferencesBadge = (allBadges: Badge[]): Badge[] => {
    const updatedBadges = [...allBadges];
    const badgeIndex = updatedBadges.findIndex(b => b.id === "preferences");
    
    if (badgeIndex !== -1) {
      const userPreferences = user?.unsafeMetadata?.plushiePreferences || null;
      const hasPreferences = Array.isArray(userPreferences) && userPreferences.length > 0;
      
      if (hasPreferences && !updatedBadges[badgeIndex].earned) {
        updatedBadges[badgeIndex] = {
          ...updatedBadges[badgeIndex],
          earned: true,
          earnedAt: new Date().toISOString()
        };
      }
    }
    
    return updatedBadges;
  };

  // Evaluate completed profile badge
  const checkCompletedProfileBadge = (allBadges: Badge[]): Badge[] => {
    const updatedBadges = [...allBadges];
    const badgeIndex = updatedBadges.findIndex(b => b.id === "complete-profile");
    
    if (badgeIndex !== -1) {
      const userMetadata = user?.unsafeMetadata || {};
      const requiredFields = ["bio", "plushiePreferences", "favoriteBrands"];
      const hasAllFields = requiredFields.every(field => 
        Array.isArray(userMetadata[field]) ? 
          (userMetadata[field] as any[]).length > 0 : 
          !!userMetadata[field]
      );
      
      if (hasAllFields && !updatedBadges[badgeIndex].earned) {
        updatedBadges[badgeIndex] = {
          ...updatedBadges[badgeIndex],
          earned: true,
          earnedAt: new Date().toISOString()
        };
      }
    }
    
    return updatedBadges;
  };

  // Evaluate post related badges
  const checkPostBadges = async (allBadges: Badge[]): Promise<Badge[]> => {
    let updatedBadges = [...allBadges];
    
    try {
      // Get user posts
      const userPosts = await getUserPosts(user?.id || "");
      const totalPosts = userPosts.length;
      const listedItems = userPosts.filter(post => post.forSale).length;
      // Fix: Check if post.sold exists before using it
      const soldItems = userPosts.filter(post => post.forSale && post.sold === true).length;
      
      // Update first post badge
      const firstPostIndex = updatedBadges.findIndex(b => b.id === "first-post");
      if (firstPostIndex !== -1) {
        updatedBadges[firstPostIndex] = {
          ...updatedBadges[firstPostIndex],
          progress: totalPosts,
          earned: totalPosts >= 1,
          earnedAt: totalPosts >= 1 ? new Date().toISOString() : undefined
        };
      }
      
      // Update first listing badge
      const firstListingIndex = updatedBadges.findIndex(b => b.id === "first-listing");
      if (firstListingIndex !== -1) {
        updatedBadges[firstListingIndex] = {
          ...updatedBadges[firstListingIndex],
          progress: listedItems,
          earned: listedItems >= 1,
          earnedAt: listedItems >= 1 ? new Date().toISOString() : undefined
        };
      }
      
      // Update first sale badge
      const firstSaleIndex = updatedBadges.findIndex(b => b.id === "first-sale");
      if (firstSaleIndex !== -1) {
        updatedBadges[firstSaleIndex] = {
          ...updatedBadges[firstSaleIndex],
          progress: soldItems,
          earned: soldItems >= 1,
          earnedAt: soldItems >= 1 ? new Date().toISOString() : undefined
        };
      }
    } catch (error) {
      console.error("Error checking post badges:", error);
    }
    
    return updatedBadges;
  };

  // Evaluate wishlist badge
  const checkWishlistBadge = (allBadges: Badge[]): Badge[] => {
    const updatedBadges = [...allBadges];
    const badgeIndex = updatedBadges.findIndex(b => b.id === "wishlist");
    
    if (badgeIndex !== -1) {
      // Check local storage for wishlist
      const wishlist = localStorage.getItem('userWishlist');
      const hasWishlist = !!wishlist && JSON.parse(wishlist).length > 0;
      
      if (hasWishlist && !updatedBadges[badgeIndex].earned) {
        updatedBadges[badgeIndex] = {
          ...updatedBadges[badgeIndex],
          earned: true,
          earnedAt: new Date().toISOString()
        };
      }
    }
    
    return updatedBadges;
  };

  // Evaluate follower badges
  const checkFollowerBadges = (allBadges: Badge[]): Badge[] => {
    const updatedBadges = [...allBadges];
    const userMetadata = user?.publicMetadata || {};
    const followerCount = typeof userMetadata.followerCount === 'number' ? userMetadata.followerCount : 0;
    
    // Check 10 followers badge
    const badge10Index = updatedBadges.findIndex(b => b.id === "10-followers");
    if (badge10Index !== -1) {
      updatedBadges[badge10Index] = {
        ...updatedBadges[badge10Index],
        progress: followerCount,
        earned: followerCount >= 10,
        earnedAt: followerCount >= 10 ? new Date().toISOString() : undefined
      };
    }
    
    // Check 50 followers badge
    const badge50Index = updatedBadges.findIndex(b => b.id === "50-followers");
    if (badge50Index !== -1) {
      updatedBadges[badge50Index] = {
        ...updatedBadges[badge50Index],
        progress: followerCount,
        earned: followerCount >= 50,
        earnedAt: followerCount >= 50 ? new Date().toISOString() : undefined
      };
    }
    
    // Check 100 followers badge
    const badge100Index = updatedBadges.findIndex(b => b.id === "100-followers");
    if (badge100Index !== -1) {
      updatedBadges[badge100Index] = {
        ...updatedBadges[badge100Index],
        progress: followerCount,
        earned: followerCount >= 100,
        earnedAt: followerCount >= 100 ? new Date().toISOString() : undefined
      };
    }
    
    return updatedBadges;
  };

  useEffect(() => {
    const initializeBadges = async () => {
      // Combine base and special badges
      let allBadges = [...baseBadges, ...specialBadges];
      
      // Run all badge checks
      allBadges = checkForSpecialBadges(allBadges);
      allBadges = checkProfilePictureBadge(allBadges);
      allBadges = checkPreferencesBadge(allBadges);
      allBadges = checkCompletedProfileBadge(allBadges);
      allBadges = await checkPostBadges(allBadges);
      allBadges = checkWishlistBadge(allBadges);
      allBadges = checkFollowerBadges(allBadges);
      
      // Count earned badges
      const earnedCount = allBadges.filter(badge => badge.earned).length;
      
      setBadges(allBadges);
      setCompletedCount(earnedCount);
    };
    
    if (user) {
      initializeBadges();
    }
  }, [user]);

  return {
    badges,
    completedCount,
    totalCount: baseBadges.length,
    isVerified: completedCount === baseBadges.length
  };
};

export default useBadges;

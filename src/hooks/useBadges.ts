
import { useState, useEffect } from 'react';
import { Badge } from '@/types/badges';

// Mock user data for demonstration
const MOCK_USER_DATA = {
  hasProfilePicture: true,
  hasPlushiePreferences: true,
  profileComplete: true,
  feedPosts: 5,
  listedItems: 3,
  soldItems: 1,
  hasWishlist: true,
  followers: 25,
  isAlphaTester: true,
  isBetaTester: false,
};

export const useBadges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const badgeList: Badge[] = [
      {
        id: 'profile-picture',
        name: 'Changed Profile Photo',
        type: 'achievement',
        description: 'Upload your first profile picture',
        imagePath: '/assets/Badges/Changed_Profile_Photo.PNG',
        earned: false,
        icon: 'Camera',
        criteria: {
          requirement: 'Upload a profile picture',
          value: 1,
          type: 'profile',
          threshold: 1,
          requiresProfilePicture: true,
        },
      },
      {
        id: 'plushie-preferences',
        name: 'Plushie Preferences',
        type: 'achievement',
        description: 'Set your plushie preferences',
        imagePath: '/assets/Badges/Plushie_Preferences.PNG',
        earned: false,
        icon: 'Settings',
        criteria: {
          requirement: 'Set plushie preferences',
          value: 1,
          type: 'preferences',
          threshold: 1,
          requiresPlushiePreferences: true,
        },
      },
      {
        id: 'completed-profile',
        name: 'Completed Profile',
        type: 'achievement',
        description: 'Complete your profile setup',
        imagePath: '/assets/Badges/Completed_Profile.PNG',
        earned: false,
        icon: 'User',
        criteria: {
          requirement: 'Complete profile',
          value: 1,
          type: 'profile',
          threshold: 1,
          requiresCompletedProfile: true,
        },
      },
      {
        id: 'first-post',
        name: 'First Post',
        type: 'milestone',
        description: 'Share your first post',
        imagePath: '/assets/Badges/First_Post.PNG',
        earned: false,
        icon: 'MessageSquare',
        criteria: {
          requirement: 'Create posts',
          value: 1,
          type: 'posts',
          threshold: 1,
          requiresFeedPosts: 1,
        },
        progress: Math.min(MOCK_USER_DATA.feedPosts, 1),
      },
      {
        id: 'active-poster',
        name: 'Active Poster',
        type: 'milestone',
        description: 'Share 10 posts',
        imagePath: '/assets/Badges/First_Post.PNG',
        earned: false,
        icon: 'MessageSquare',
        criteria: {
          requirement: 'Create posts',
          value: 10,
          type: 'posts',
          threshold: 10,
          requiresListedItems: 10,
        },
        progress: Math.min(MOCK_USER_DATA.feedPosts, 10),
      },
      {
        id: 'first-sale',
        name: 'First Sale',
        type: 'milestone',
        description: 'Complete your first sale',
        imagePath: '/assets/Badges/First_Sale.PNG',
        earned: false,
        icon: 'ShoppingBag',
        criteria: {
          requirement: 'Complete sales',
          value: 1,
          type: 'sales',
          threshold: 1,
          requiresSoldItems: 1,
        },
        progress: Math.min(MOCK_USER_DATA.soldItems, 1),
      },
      {
        id: 'wishlist-created',
        name: 'Wishlist Created',
        type: 'achievement',
        description: 'Create your first wishlist',
        imagePath: '/assets/Badges/Completed_Profile.PNG',
        earned: false,
        icon: 'Heart',
        criteria: {
          requirement: 'Create wishlist',
          value: 1,
          type: 'wishlist',
          threshold: 1,
          requiresWishlist: true,
        },
      },
      {
        id: 'popular-user',
        name: 'Popular User',
        type: 'milestone',
        description: 'Gain 50 followers',
        imagePath: '/assets/Badges/Completed_Profile.PNG',
        earned: false,
        icon: 'Users',
        criteria: {
          requirement: 'Gain followers',
          value: 50,
          type: 'social',
          threshold: 50,
          requiresFollowers: 50,
        },
        progress: Math.min(MOCK_USER_DATA.followers, 50),
      },
      {
        id: 'community-leader',
        name: 'Community Leader',
        type: 'milestone',
        description: 'Gain 100 followers',
        imagePath: '/assets/Badges/Completed_Profile.PNG',
        earned: false,
        icon: 'Crown',
        criteria: {
          requirement: 'Gain followers',
          value: 100,
          type: 'social',
          threshold: 100,
          requiresFollowers: 100,
        },
        progress: Math.min(MOCK_USER_DATA.followers, 100),
      },
      {
        id: 'influencer',
        name: 'Influencer',
        type: 'milestone',
        description: 'Gain 500 followers',
        imagePath: '/assets/Badges/Completed_Profile.PNG',
        earned: false,
        icon: 'Star',
        criteria: {
          requirement: 'Gain followers',
          value: 500,
          type: 'social',
          threshold: 500,
          requiresFollowers: 500,
        },
        progress: Math.min(MOCK_USER_DATA.followers, 500),
      },
      {
        id: 'alpha-tester',
        name: 'Alpha Tester',
        type: 'special',
        description: 'Participated in alpha testing',
        imagePath: '/assets/Badges/Alpha_Tester.PNG',
        earned: false,
        isSpecial: true,
        icon: 'Zap',
        criteria: {
          requirement: 'Alpha participation',
          value: 1,
          type: 'special',
          specialBadgeType: 'alpha',
        },
      },
      {
        id: 'beta-tester',
        name: 'Beta Tester',
        type: 'special',
        description: 'Participated in beta testing',
        imagePath: '/assets/Badges/Beta_Tester.PNG',
        earned: false,
        isSpecial: true,
        icon: 'TestTube',
        criteria: {
          requirement: 'Beta participation',
          value: 1,
          type: 'special',
          specialBadgeType: 'beta',
        },
      },
    ];

    // Calculate earned status for each badge
    const updatedBadges = badgeList.map(badge => {
      let earned = false;

      switch (badge.id) {
        case 'profile-picture':
          earned = MOCK_USER_DATA.hasProfilePicture;
          break;
        case 'plushie-preferences':
          earned = MOCK_USER_DATA.hasPlushiePreferences;
          break;
        case 'completed-profile':
          earned = MOCK_USER_DATA.profileComplete;
          break;
        case 'first-post':
          earned = MOCK_USER_DATA.feedPosts >= 1;
          break;
        case 'active-poster':
          earned = MOCK_USER_DATA.feedPosts >= 10;
          break;
        case 'first-sale':
          earned = MOCK_USER_DATA.soldItems >= 1;
          break;
        case 'wishlist-created':
          earned = MOCK_USER_DATA.hasWishlist;
          break;
        case 'popular-user':
          earned = MOCK_USER_DATA.followers >= 50;
          break;
        case 'community-leader':
          earned = MOCK_USER_DATA.followers >= 100;
          break;
        case 'influencer':
          earned = MOCK_USER_DATA.followers >= 500;
          break;
        case 'alpha-tester':
          earned = MOCK_USER_DATA.isAlphaTester;
          break;
        case 'beta-tester':
          earned = MOCK_USER_DATA.isBetaTester;
          break;
      }

      return { ...badge, earned };
    });

    setBadges(updatedBadges);
  }, []);

  return { badges };
};

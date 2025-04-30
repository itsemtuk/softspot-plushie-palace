
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { getAllUserPosts } from "@/utils/posts/postManagement";
import { getMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileInfo } from "./profile/ProfileInfo";
import { ProfileActionButton } from "./profile/ProfileActionButton";
import { ProfileHeaderStats } from "./profile/ProfileHeaderStats";

interface UserProfileHeaderProps {
  username?: string;
  isOwnProfile: boolean;
  profileData?: {
    bio?: string;
    interests?: string[];
    isPrivate?: boolean;
  };
}

export default function UserProfileHeader({ 
  username, 
  isOwnProfile, 
  profileData 
}: UserProfileHeaderProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  
  const isPrivate = profileData?.isPrivate ?? false;
  
  // Get profile data and counts when user is loaded
  useEffect(() => {
    const loadProfileData = async () => {
      // Get the profile picture from metadata or default
      if (user && isOwnProfile) {
        const userProfilePicture = user.imageUrl || user.unsafeMetadata?.profilePicture as string;
        setProfileImage(userProfilePicture || "https://i.pravatar.cc/300");
        
        // Check if we're following this user
        const following = user.unsafeMetadata?.following as string[] || [];
        if (username && following.includes(username)) {
          setIsFollowing(true);
        }
        
        setFollowingCount(following.length || 0);
        setFollowersCount(user.unsafeMetadata?.followerCount as number || 0);
      }
      
      // Get post count - include both regular posts and marketplace listings
      try {
        const userId = user?.id || localStorage.getItem('currentUserId');
        if (userId) {
          const posts = await getAllUserPosts(userId);
          const listings = getMarketplaceListings().filter(listing => listing.userId === userId);
          setPostsCount(posts.length + listings.length);
        }
      } catch (error) {
        console.error("Error loading post counts:", error);
      }
    };
    
    loadProfileData();
  }, [user, isOwnProfile, username]);

  const handleEditProfile = () => {
    navigate('/settings');
  };

  const handleFollow = () => {
    if (isFollowing) {
      // Unfollow
      if (user) {
        const following = user.unsafeMetadata?.following as string[] || [];
        const updatedFollowing = following.filter(user => user !== username);
        
        user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            following: updatedFollowing,
          },
        }).then(() => {
          setIsFollowing(false);
          setFollowersCount(prev => Math.max(0, prev - 1));
          toast({
            title: "Unfollowed",
            description: `You are no longer following ${username}`,
          });
        });
      }
    } else if (isPrivate) {
      // Send follow request for private account
      setIsPending(true);
      toast({
        title: "Follow request sent",
        description: `Your request to follow ${username} has been sent`,
      });
    } else {
      // Follow public account
      if (user) {
        const following = user.unsafeMetadata?.following as string[] || [];
        const updatedFollowing = [...following, username];
        
        user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            following: updatedFollowing,
          },
        }).then(() => {
          setIsFollowing(true);
          setFollowersCount(prev => prev + 1);
          toast({
            title: "Following",
            description: `You are now following ${username}`,
          });
        });
      }
    }
  };

  // Get plushie interests from user metadata or defaults
  const plushieInterests = profileData?.interests || 
    (user?.unsafeMetadata?.plushieInterests as string[]) || 
    ["Teddy Bears", "Unicorns", "Vintage"];
  
  // Get display name, ensuring we don't use email address
  const displayName = user?.firstName || username || "Plushie Lover";
  
  return (
    <div className="bg-gradient-to-b from-softspot-100 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <ProfileAvatar profileImage={profileImage} />
          
          <ProfileInfo
            username={username || user?.username}
            displayName={displayName}
            bio={profileData?.bio || user?.unsafeMetadata?.bio as string}
            interests={plushieInterests}
            isPrivate={isPrivate}
          />
          
          <div className="flex gap-3">
            <ProfileActionButton
              isOwnProfile={isOwnProfile}
              isFollowing={isFollowing}
              isPending={isPending}
              isPrivate={isPrivate}
              username={username}
              onEditProfile={handleEditProfile}
              onFollowToggle={handleFollow}
            />
          </div>
        </div>
        
        <ProfileHeaderStats
          postsCount={postsCount}
          followersCount={followersCount}
          followingCount={followingCount}
        />
      </div>
    </div>
  );
}

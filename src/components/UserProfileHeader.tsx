
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { getAllUserPosts } from "@/utils/posts/postManagement";
import { getMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileInfo } from "./profile/ProfileInfo";
import { ProfileActionButton } from "./profile/ProfileActionButton";
import { useUser } from '@clerk/clerk-react';

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
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  
  // Get Clerk user if configured
  const { user: clerkUser } = isClerkConfigured ? useUser() : { user: null };
  
  // Set default values
  const isPrivate = profileData?.isPrivate ?? false;
  
  // Get profile data and counts
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Get profile picture based on auth method
        if (isOwnProfile) {
          if (isClerkConfigured && clerkUser) {
            // Use Clerk user data if available
            const userProfilePicture = clerkUser.imageUrl || clerkUser.unsafeMetadata?.profilePicture as string;
            setProfileImage(userProfilePicture || "https://i.pravatar.cc/300");
            
            // Get Clerk following data
            const following = clerkUser.unsafeMetadata?.following as string[] || [];
            if (username && following.includes(username)) {
              setIsFollowing(true);
            }
            
            setFollowingCount(following.length || 0);
            setFollowersCount(clerkUser.unsafeMetadata?.followerCount as number || 0);
          } else {
            // Use local storage for non-Clerk authentication
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const storedProfilePicture = localStorage.getItem('userAvatarUrl');
            
            setProfileImage(storedProfilePicture || "https://i.pravatar.cc/300");
            
            if (userProfile.following) {
              setFollowingCount(userProfile.following.length || 0);
              if (username && userProfile.following.includes(username)) {
                setIsFollowing(true);
              }
            }
            
            setFollowersCount(userProfile.followerCount || 0);
          }
        }
        
        // Get post count - include both regular posts and marketplace listings
        const userId = localStorage.getItem('currentUserId');
        if (userId) {
          const posts = await getAllUserPosts(userId);
          const listings = getMarketplaceListings().filter(listing => listing.userId === userId);
          setPostsCount(posts.length + listings.length);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };
    
    loadProfileData();
  }, [isOwnProfile, username, isClerkConfigured, clerkUser]);

  const handleEditProfile = () => {
    navigate('/settings');
  };

  const handleFollow = () => {
    if (isFollowing) {
      // Unfollow logic
      if (isClerkConfigured && clerkUser) {
        // For Clerk users
        const following = clerkUser.unsafeMetadata?.following as string[] || [];
        const updatedFollowing = following.filter((user: string) => user !== username);
        
        clerkUser.update({
          unsafeMetadata: {
            ...clerkUser.unsafeMetadata,
            following: updatedFollowing
          }
        }).then(() => {
          setIsFollowing(false);
          setFollowersCount(prev => Math.max(0, prev - 1));
          
          toast({
            title: "Unfollowed",
            description: `You are no longer following ${username}`,
          });
        });
      } else {
        // For non-Clerk users
        const userProfile = localStorage.getItem('userProfile');
        let parsedProfile = userProfile ? JSON.parse(userProfile) : {};
        
        const following = parsedProfile.following || [];
        const updatedFollowing = following.filter((user: string) => user !== username);
        
        parsedProfile.following = updatedFollowing;
        localStorage.setItem('userProfile', JSON.stringify(parsedProfile));
        
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
        
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${username}`,
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
      if (isClerkConfigured && clerkUser) {
        // For Clerk users
        const following = clerkUser.unsafeMetadata?.following as string[] || [];
        const updatedFollowing = [...following, username];
        
        clerkUser.update({
          unsafeMetadata: {
            ...clerkUser.unsafeMetadata,
            following: updatedFollowing
          }
        }).then(() => {
          setIsFollowing(true);
          setFollowersCount(prev => prev + 1);
          
          toast({
            title: "Following",
            description: `You are now following ${username}`,
          });
        });
      } else {
        // For non-Clerk users
        const userProfile = localStorage.getItem('userProfile');
        let parsedProfile = userProfile ? JSON.parse(userProfile) : {};
        
        const following = parsedProfile.following || [];
        const updatedFollowing = [...following, username];
        
        parsedProfile.following = updatedFollowing;
        localStorage.setItem('userProfile', JSON.stringify(parsedProfile));
        
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        
        toast({
          title: "Following",
          description: `You are now following ${username}`,
        });
      }
    }
  };

  // Get plushie interests from user metadata or defaults
  const plushieInterests = profileData?.interests || [];
  
  // Get display name from various sources, ensuring we don't use email address
  const displayUsername = username || 
    (clerkUser?.username || 
    localStorage.getItem('currentUsername') || 
    "plushielover");
  
  const displayName = displayUsername.includes('@') ? displayUsername.split('@')[0] : displayUsername;
  
  return (
    <div>
      {/* Profile Banner - gradient background */}
      <div className="h-36 bg-gradient-to-r from-softspot-100 to-softspot-400 w-full"></div>
      
      <div className="container mx-auto px-4 -mt-16 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header with Avatar and Stats */}
          <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <img 
                src={profileImage || "https://i.pravatar.cc/300"} 
                alt="Profile" 
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                onError={(e) => {
                  e.currentTarget.src = "https://i.pravatar.cc/300";
                }}
              />
              
              <div className="md:ml-4 flex-1 text-center md:text-left mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{displayName}</h1>
                    <p className="text-gray-600 text-sm">Plushie collector</p>
                  </div>
                  
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
                
                <div className="flex justify-center md:justify-start space-x-6 mt-3">
                  <div>
                    <p className="font-bold text-gray-800">{postsCount}</p>
                    <p className="text-xs text-gray-600">Posts</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{followersCount}</p>
                    <p className="text-xs text-gray-600">Followers</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{followingCount}</p>
                    <p className="text-xs text-gray-600">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Bio and Interests */}
          <div className="p-6">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-800 mb-2">About Me</h2>
              <p className="text-gray-700">{profileData?.bio || "No bio yet"}</p>
            </div>
            
            {plushieInterests.length > 0 && (
              <div className="mb-4">
                <h2 className="font-semibold text-gray-800 mb-2">Favorite Collections</h2>
                <div className="flex flex-wrap gap-2">
                  {plushieInterests.map((interest, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

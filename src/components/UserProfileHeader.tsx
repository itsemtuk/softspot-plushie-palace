
import React, { useState, useEffect } from 'react';
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
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const isClerkConfigured = !!localStorage.getItem('usingClerk');
  
  const isPrivate = profileData?.isPrivate ?? false;
  
  // Get profile data and counts
  useEffect(() => {
    const loadProfileData = async () => {
      // Get the profile picture
      if (isOwnProfile) {
        const userProfilePicture = localStorage.getItem('userAvatarUrl');
        setProfileImage(userProfilePicture || "https://i.pravatar.cc/300");
        
        // Get following data from localStorage
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          try {
            const parsedProfile = JSON.parse(userProfile);
            
            if (parsedProfile.following) {
              setFollowingCount(parsedProfile.following.length || 0);
              if (username && parsedProfile.following.includes(username)) {
                setIsFollowing(true);
              }
            }
            
            setFollowersCount(parsedProfile.followerCount || 0);
          } catch (error) {
            console.error("Error parsing user profile:", error);
          }
        }
      }
      
      // Get post count - include both regular posts and marketplace listings
      try {
        const userId = localStorage.getItem('currentUserId');
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
  }, [isOwnProfile, username]);

  // If Clerk is configured, use its hooks dynamically
  useEffect(() => {
    if (!isClerkConfigured) return;
    
    // Use dynamic import for Clerk functionality
    import('@clerk/clerk-react').then(({ useUser }) => {
      const ClerkComponent = () => {
        const { user } = useUser();
        
        useEffect(() => {
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
        }, [user]);
        
        return null;
      };
      
      // Create a temporary element to mount the Clerk component
      const div = document.createElement('div');
      const root = document.getElementById('root');
      if (root) {
        root.appendChild(div);
        
        import('react-dom/client').then(({ createRoot }) => {
          const clerkRoot = createRoot(div);
          clerkRoot.render(<ClerkComponent />);
          
          return () => {
            clerkRoot.unmount();
            if (root.contains(div)) {
              root.removeChild(div);
            }
          };
        });
      }
    }).catch(error => {
      console.error("Error loading Clerk:", error);
    });
  }, [isClerkConfigured, isOwnProfile, username]);

  const handleEditProfile = () => {
    navigate('/settings');
  };

  const handleFollow = () => {
    if (isFollowing) {
      // Unfollow
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
    } else if (isPrivate) {
      // Send follow request for private account
      setIsPending(true);
      toast({
        title: "Follow request sent",
        description: `Your request to follow ${username} has been sent`,
      });
    } else {
      // Follow public account
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
  };

  // Get plushie interests from user metadata or defaults
  const plushieInterests = profileData?.interests || [];
  
  // Get display name from localStorage, ensuring we don't use email address
  const displayUsername = username || localStorage.getItem('currentUsername') || "plushielover";
  const displayName = displayUsername.includes('@') ? displayUsername.split('@')[0] : displayUsername;
  
  return (
    <div className="bg-gradient-to-b from-softspot-100 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <ProfileAvatar profileImage={profileImage} />
          
          <ProfileInfo
            username={displayUsername}
            displayName={displayName}
            bio={profileData?.bio || ''}
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

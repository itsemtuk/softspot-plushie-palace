import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { getAllUserPosts } from "@/utils/posts/postManagement";
import { getMarketplaceListings } from "@/utils/storage/localStorageUtils";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileInfo } from "./profile/ProfileInfo";
import { ProfileActionButton } from "./profile/ProfileActionButton";
import { useUser } from '@clerk/clerk-react';
import { ProfileHeaderStats } from "./profile/ProfileHeaderStats";
import { ProfileSocialLinks } from "./profile/ProfileSocialLinks";
import { ProfileStoreLinks } from "./profile/ProfileStoreLinks";
import { ProfileBio } from "./profile/ProfileBio";
import { ProfileBadges } from "./profile/ProfileBadges";
import { useBadges } from "@/hooks/useBadges";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, Award } from "lucide-react";

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
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [storeLinks, setStoreLinks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'about' | 'badges' | 'reviews'>('about');
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  
  // Get Clerk user if configured
  const { user: clerkUser } = isClerkConfigured ? useUser() : { user: null };
  
  // Load badges
  const { badges, completedCount, totalCount, isVerified } = useBadges();
  
  // Set default values
  const isPrivate = profileData?.isPrivate ?? false;
  
  // Load profile data
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
            
            // Get social media links
            setSocialLinks(clerkUser.unsafeMetadata?.socialLinks as any[] || []);
            setStoreLinks(clerkUser.unsafeMetadata?.storeLinks as any[] || []);
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
            setSocialLinks(userProfile.socialLinks || []);
            setStoreLinks(userProfile.storeLinks || []);
          }
        }
        
        // Get post count
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
  
  // Get display name from various sources
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
          <div className="relative px-6 pt-6 pb-4">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              {/* Profile Avatar */}
              <ProfileAvatar profileImage={profileImage} />
              
              <div className="md:ml-4 flex-1 text-center md:text-left mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    {/* Username and role */}
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold">{displayName}</h1>
                      {isVerified && (
                        <Badge variant="default" className="ml-2 bg-softspot-500">
                          <Star className="h-3 w-3 mr-1 fill-current" /> Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">Plushie collector</p>
                    
                    {/* Social Media Icons */}
                    <ProfileSocialLinks socialLinks={socialLinks} />
                  </div>
                  
                  {/* Follow/Edit Profile Button */}
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
                
                {/* Profile Stats */}
                <ProfileHeaderStats 
                  postsCount={postsCount}
                  followersCount={followersCount}
                  followingCount={followingCount}
                />
              </div>
            </div>
          </div>
          
          {/* Profile Tabs */}
          <div className="border-t border-gray-100">
            <Tabs 
              defaultValue="about" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as any)} 
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="badges" className="flex items-center">
                  <Award className="h-4 w-4 mr-1" /> Badges
                </TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="p-6">
                {/* Profile Bio and Interests */}
                <ProfileBio bio={profileData?.bio} />
                
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
                
                {/* Store Links */}
                <ProfileStoreLinks storeLinks={storeLinks} />
              </TabsContent>
              
              <TabsContent value="badges" className="p-6">
                <ProfileBadges 
                  badges={badges} 
                  completedCount={completedCount} 
                  totalCount={totalCount} 
                  showAll={isOwnProfile}
                />
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">No reviews yet</h3>
                  <p className="text-gray-500 mt-2">
                    Reviews will appear here after someone purchases from you.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

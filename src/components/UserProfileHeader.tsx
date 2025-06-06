
import { useState } from "react";
import { Button } from "./ui/button";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileHeaderStats } from "./profile/ProfileHeaderStats";
import { ProfileInfo } from "./profile/ProfileInfo";
import { ProfileActionButton } from "./profile/ProfileActionButton";
import { Badge } from "./ui/badge";
import { ProfileBadges } from "./profile/ProfileBadges";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MarketplaceReviews } from "./profile/MarketplaceReviews";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Progress } from "./ui/progress";
import { Lock, Pencil } from "lucide-react";

interface UserProfileHeaderProps {
  username: string;
  isOwnProfile: boolean;
  profileData: {
    bio: string;
    interests: string[];
    isPrivate: boolean;
  };
}

function UserProfileHeader({ username, isOwnProfile, profileData }: UserProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const isMobile = useIsMobile();

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // In a real app, you would update the follow status in your backend
  };
  
  const handleEditProfileClick = () => {
    navigate('/settings');
  };
  
  const userAvatarUrl = user?.imageUrl || localStorage.getItem('userAvatarUrl') || "/assets/avatars/PLUSH_Bear.PNG";
  
  // Calculate profile completion percentage
  const completedSteps = [
    true, // Profile Photo (has default)
    profileData.interests && profileData.interests.length > 0, // Plushie Preferences
    profileData.bio && profileData.bio.length > 5, // Complete Profile
  ];
  
  const completionPercentage = Math.round(
    (completedSteps.filter(Boolean).length / completedSteps.length) * 100
  );
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 flex justify-center">
            <ProfileAvatar profileImage={userAvatarUrl} />
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{username}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">Plushie collector</p>
              </div>
              
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Button 
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    onClick={handleEditProfileClick}
                    className="rounded-full px-6 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <ProfileActionButton 
                    isFollowing={isFollowing} 
                    onFollowToggle={handleFollowToggle} 
                    isOwnProfile={false}
                    isPending={false}
                  />
                )}
              </div>
            </div>
            
            <ProfileHeaderStats 
              postsCount={0} 
              followersCount={0} 
              followingCount={0} 
            />
            
            <Tabs defaultValue="about">
              <TabsContent value="about" className="mt-4">
                <ProfileInfo 
                  bio={profileData.bio} 
                  displayName={username}
                  interests={profileData.interests}
                  username={username}
                  status="online"
                />
                
                {profileData.isPrivate && (
                  <Badge variant="outline" className="mt-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    Private Account
                  </Badge>
                )}
              </TabsContent>
              
              <TabsContent value="badges" className="mt-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg transition-colors duration-200">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Badges</h2>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Profile completion</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2 bg-gray-100 dark:bg-gray-700" />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Unlocked badges */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center text-center transition-colors duration-200">
                      <div className="w-12 h-12 bg-softspot-100 dark:bg-softspot-900 rounded-full flex items-center justify-center mb-2">
                        <img 
                          src="/assets/Badges/Changed_Profile_Photo.PNG" 
                          alt="Profile Photo Badge" 
                          className="w-10 h-10 object-cover rounded-full" 
                        />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Profile Photo</h3>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center text-center transition-colors duration-200">
                      <div className="w-12 h-12 bg-softspot-100 dark:bg-softspot-900 rounded-full flex items-center justify-center mb-2">
                        <img 
                          src="/assets/Badges/Plushie_Preferences.PNG" 
                          alt="Plushie Preferences Badge" 
                          className="w-10 h-10 object-cover rounded-full" 
                        />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Plushie Preferences</h3>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center text-center transition-colors duration-200">
                      <div className="w-12 h-12 bg-softspot-100 dark:bg-softspot-900 rounded-full flex items-center justify-center mb-2">
                        <img 
                          src="/assets/Badges/Completed_Profile.PNG" 
                          alt="Complete Profile Badge" 
                          className="w-10 h-10 object-cover rounded-full" 
                        />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Complete Profile</h3>
                    </div>
                    
                    {/* Locked badges */}
                    <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center text-center opacity-70 transition-colors duration-200">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                        <Lock className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">First Post</h3>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center text-center opacity-70 transition-colors duration-200">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                        <Lock className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Marketplace Vendor</h3>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center text-center opacity-70 transition-colors duration-200">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                        <Lock className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">First Sale</h3>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <MarketplaceReviews userId={user?.id || ''} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileHeader;

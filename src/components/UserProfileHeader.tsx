
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
  
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 flex justify-center">
            <ProfileAvatar profileImage={userAvatarUrl} />
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h1 className="text-2xl font-bold">{username}</h1>
              
              {isOwnProfile ? (
                <Button 
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  onClick={handleEditProfileClick}
                >
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
            
            <ProfileHeaderStats 
              postsCount={0} 
              followersCount={0} 
              followingCount={0} 
            />
            
            <ProfileInfo 
              bio={profileData.bio} 
              displayName={username}
              interests={profileData.interests}
            />
            
            {profileData.isPrivate && (
              <Badge variant="outline" className="mt-2">Private Account</Badge>
            )}
            
            {profileData.interests?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {profileData.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">{interest}</Badge>
                ))}
              </div>
            )}
            
            <ProfileBadges badges={[
              { id: '1', name: 'First Post', image: '/assets/Badges/First_Post.PNG' },
              { id: '2', name: 'Beta Tester', image: '/assets/Badges/Beta_Tester.PNG' },
              { id: '3', name: 'Completed Profile', image: '/assets/Badges/Completed_Profile.PNG' },
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileHeader;

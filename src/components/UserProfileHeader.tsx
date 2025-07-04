import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserProfilePhoto } from "@/components/user/UserProfilePhoto";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Edit } from 'lucide-react';
import { ProfileActionButton } from '@/components/profile/ProfileActionButton';
import { ProfileHeaderCustomizer } from '@/components/profile/ProfileHeaderCustomizer';
import { supabase } from '@/integrations/supabase/client';
import { useFollowUser } from '@/hooks/useFollowUser';
import { useUser } from '@clerk/clerk-react';
import { createSafeElement, safeReplaceElement, sanitizeDisplayName } from '@/utils/security/domSanitizer';

interface UserProfileData {
  bio: string;
  interests: string[];
  isPrivate: boolean;
}

interface UserProfileHeaderProps {
  username: string;
  isOwnProfile: boolean;
  profileData?: UserProfileData;
  userId?: string;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ 
  username, 
  isOwnProfile, 
  profileData,
  userId 
}) => {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const [userInfo, setUserInfo] = useState<{
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  }>({});
  const [stats, setStats] = useState({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0
  });
  const [headerCustomization, setHeaderCustomization] = useState<any>({
    header_background_color: '#ffffff',
    header_gradient_start: '',
    header_gradient_end: '',
    header_background_image: '',
    header_text_color: '#000000'
  });

  const { followerCount } = useFollowUser(userId);

  // Fetch user info and stats from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        // Fetch user info
        const { data: userInfoData } = await supabase
          .from('users')
          .select('avatar_url, first_name, last_name, email')
          .eq('id', userId)
          .maybeSingle();

        if (userInfoData) {
          setUserInfo(userInfoData);
        }

        // Fetch header customization
        const { data: customizationData } = await supabase
          .from('profiles')
          .select('header_background_color, header_gradient_start, header_gradient_end, header_background_image, header_text_color')
          .eq('user_uuid', userId)
          .maybeSingle();

        if (customizationData) {
          setHeaderCustomization({
            header_background_color: customizationData.header_background_color || '#ffffff',
            header_gradient_start: customizationData.header_gradient_start || '',
            header_gradient_end: customizationData.header_gradient_end || '',
            header_background_image: customizationData.header_background_image || '',
            header_text_color: customizationData.header_text_color || '#000000'
          });
        }

        // Fetch posts count
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        // Fetch following count (how many people this user follows)
        const { count: followingCount } = await supabase
          .from('followers')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', userId);

        setStats({
          postsCount: postsCount || 0,
          followersCount: followerCount,
          followingCount: followingCount || 0
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, followerCount]);

  // Use Clerk user's image if this is own profile and no Supabase avatar
  const getProfileImage = () => {
    // Always prefer Clerk image for own profile if available
    if (isOwnProfile && clerkUser?.imageUrl) {
      return clerkUser.imageUrl;
    }
    // Otherwise use Supabase avatar_url
    return userInfo.avatar_url;
  };

  const displayName = sanitizeDisplayName(
    userInfo.first_name 
      ? `${userInfo.first_name} ${userInfo.last_name || ''}`.trim()
      : username
  );

  const handleEditProfile = () => {
    navigate('/settings');
  };

  // Generate initials for fallback avatar
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const profileImage = getProfileImage();

  // Generate background style based on customization
  const getBackgroundStyle = () => {
    const style: React.CSSProperties = {};
    
    if (headerCustomization.header_background_image) {
      style.backgroundImage = `url(${headerCustomization.header_background_image})`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
    } else if (headerCustomization.header_gradient_start && headerCustomization.header_gradient_end) {
      style.background = `linear-gradient(135deg, ${headerCustomization.header_gradient_start}, ${headerCustomization.header_gradient_end})`;
    } else if (headerCustomization.header_background_color) {
      style.backgroundColor = headerCustomization.header_background_color;
    } else {
      // Default gradient
      style.background = 'linear-gradient(to right, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.2))';
    }
    
    style.color = headerCustomization.header_text_color || '#000000';
    
    return style;
  };

  return (
    <Card className="mb-8 overflow-hidden">
      <div 
        className="px-6 py-8 relative overflow-hidden"
        style={getBackgroundStyle()}
      >
        {/* Overlay for background images */}
        {headerCustomization.header_background_image && (
          <div className="absolute inset-0 bg-black/20" />
        )}
        
        {/* Customize button for own profile */}
        {isOwnProfile && userId && (
          <div className="absolute top-4 right-4 z-10">
            <ProfileHeaderCustomizer
              userId={userId}
              onCustomizationChange={setHeaderCustomization}
              currentCustomization={headerCustomization}
            />
          </div>
        )}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <UserProfilePhoto 
              avatarUrl={profileImage}
              username={username}
              firstName={username}
              size="xl"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-grow min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 
                  className="text-2xl font-bold mb-1"
                  style={{ color: headerCustomization.header_text_color }}
                >
                  {displayName}
                </h1>
                <p 
                  className="text-sm mb-2 opacity-80"
                  style={{ color: headerCustomization.header_text_color }}
                >
                  @{username}
                </p>
                
                {profileData?.bio && (
                  <p 
                    className="mb-3 max-w-md opacity-90"
                    style={{ color: headerCustomization.header_text_color }}
                  >
                    {profileData.bio}
                  </p>
                )}

                <div 
                  className="flex flex-wrap items-center gap-4 text-sm opacity-80"
                  style={{ color: headerCustomization.header_text_color }}
                >
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{stats.postsCount} posts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{stats.followersCount} followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{stats.followingCount} following</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                {isOwnProfile ? (
                  <Button 
                    variant="outline" 
                    className="rounded-full"
                    onClick={handleEditProfile}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <ProfileActionButton 
                    userId={userId}
                    isOwnProfile={false}
                  />
                )}
              </div>
            </div>

            {/* Interests/Tags */}
            {profileData?.interests && profileData.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {profileData.interests.slice(0, 5).map((interest, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserProfileHeader;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Edit } from 'lucide-react';
import { ProfileActionButton } from '@/components/profile/ProfileActionButton';
import { supabase } from '@/integrations/supabase/client';
import { useFollowUser } from '@/hooks/useFollowUser';
import { useUser } from '@clerk/clerk-react';

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
    if (isOwnProfile && clerkUser?.imageUrl && !userInfo.avatar_url) {
      return clerkUser.imageUrl;
    }
    return userInfo.avatar_url;
  };

  const displayName = userInfo.first_name 
    ? `${userInfo.first_name} ${userInfo.last_name || ''}`.trim()
    : username;

  const handleEditProfile = () => {
    navigate('/settings');
  };

  // Generate initials for fallback avatar
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const profileImage = getProfileImage();

  return (
    <Card className="mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-softspot-100 to-purple-100 dark:from-softspot-900 dark:to-purple-900 px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-full h-full bg-softspot-500 flex items-center justify-center text-white text-xl font-semibold">${getInitials(displayName)}</div>`;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-softspot-500 flex items-center justify-center text-white text-xl font-semibold">
                  {getInitials(displayName)}
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-grow min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {displayName}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  @{username}
                </p>
                
                {profileData?.bio && (
                  <p className="text-gray-700 dark:text-gray-300 mb-3 max-w-md">
                    {profileData.bio}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
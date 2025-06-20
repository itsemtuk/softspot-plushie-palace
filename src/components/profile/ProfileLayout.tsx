
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import UserProfileHeader from '@/components/UserProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useCreatePost } from '@/hooks/use-create-post';
import PostCreationFlow from '@/components/post/PostCreationFlow';
import { PostCreationData, ExtendedPost } from '@/types/core';
import { addPost } from '@/utils/posts/postManagement';
import { supabase } from '@/integrations/supabase/client';

export const ProfileLayout = () => {
  const { user, isLoaded } = useUser();
  const [profileData, setProfileData] = useState({
    bio: '',
    interests: [] as string[],
    isPrivate: false
  });
  const [userSupabaseId, setUserSupabaseId] = useState<string>("");
  const { isPostCreationOpen, setIsPostCreationOpen } = useCreatePost();

  // Get user's Supabase ID and profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Get user's Supabase ID
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', user.id)
          .maybeSingle();

        if (userData) {
          setUserSupabaseId(userData.id);

          // Get profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('bio, favorite_brands, is_private')
            .eq('user_uuid', userData.id)
            .maybeSingle();

          if (profile) {
            setProfileData({
              bio: profile.bio || '',
              interests: profile.favorite_brands || [],
              isPrivate: profile.is_private || false
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isLoaded && user) {
      fetchUserData();
    }
  }, [user, isLoaded]);

  const handleCreatePost = async (postData: PostCreationData) => {
    try {
      const newPost: ExtendedPost = {
        ...postData,
        id: `post-${Date.now()}`,
        userId: userSupabaseId,
        user_id: userSupabaseId,
        username: user?.username || user?.firstName || "User",
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await addPost(newPost);
      if (result.success) {
        setIsPostCreationOpen(false);
      } else {
        console.error("Failed to add post:", result.error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleCreateFirstPost = () => {
    setIsPostCreationOpen(true);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-softspot-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Please sign in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  const username = user.username || user.firstName || "User";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <UserProfileHeader
          username={username}
          isOwnProfile={true}
          profileData={profileData}
          userId={userSupabaseId}
        />
        
        {/* Empty State for Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-softspot-100 dark:bg-softspot-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-8 h-8 text-softspot-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Share your first plushie!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Show off your collection and connect with other plushie lovers.
            </p>
            <Button 
              onClick={handleCreateFirstPost}
              className="bg-softspot-500 hover:bg-softspot-600 text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Your First Post
            </Button>
          </div>
        </div>

        <ProfileTabs />
      </div>

      {/* Post Creation Flow */}
      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={() => setIsPostCreationOpen(false)}
        onPostCreated={handleCreatePost}
      />
    </div>
  );
};

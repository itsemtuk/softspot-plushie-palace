
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useFollowUser = (targetUserId?: string) => {
  const { user } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // Get current user's Supabase ID
  const getCurrentUserSupabaseId = async () => {
    if (!user?.id) return null;
    
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', user.id)
      .maybeSingle();
    
    return data?.id || null;
  };

  // Check if current user is following target user
  const checkFollowStatus = async () => {
    if (!user?.id || !targetUserId) return;

    try {
      const currentUserSupabaseId = await getCurrentUserSupabaseId();
      if (!currentUserSupabaseId) return;

      const { data } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', currentUserSupabaseId)
        .eq('following_id', targetUserId)
        .maybeSingle();

      setIsFollowing(!!data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  // Get follower count for target user
  const getFollowerCount = async () => {
    if (!targetUserId) return;

    try {
      const { count } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId);

      setFollowerCount(count || 0);
    } catch (error) {
      console.error('Error getting follower count:', error);
    }
  };

  // Toggle follow status
  const toggleFollow = async () => {
    if (!user?.id || !targetUserId || isLoading) return;

    setIsLoading(true);
    try {
      const currentUserSupabaseId = await getCurrentUserSupabaseId();
      if (!currentUserSupabaseId) {
        // Create user if doesn't exist
        const { data: createdUser } = await supabase.rpc('create_user_safe', {
          user_data: {
            clerk_id: user.id,
            username: user.username || user.firstName || 'User',
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.emailAddresses?.[0]?.emailAddress,
            avatar_url: user.imageUrl
          }
        });

        if (!createdUser || createdUser.length === 0) {
          throw new Error('Failed to create user');
        }
      }

      // Get the actual Supabase ID again after potential creation
      const actualSupabaseId = await getCurrentUserSupabaseId();
      if (!actualSupabaseId) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Unable to follow user. Please try refreshing the page.'
        });
        return;
      }

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', actualSupabaseId)
          .eq('following_id', targetUserId);

        if (error) throw error;

        setIsFollowing(false);
        setFollowerCount(prev => Math.max(0, prev - 1));
        toast({
          title: 'Unfollowed',
          description: 'You are no longer following this user.'
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('followers')
          .insert({
            follower_id: actualSupabaseId,
            following_id: targetUserId
          });

        if (error) throw error;

        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast({
          title: 'Following',
          description: 'You are now following this user.'
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update follow status. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      checkFollowStatus();
      getFollowerCount();
    }
  }, [user?.id, targetUserId]);

  return {
    isFollowing,
    isLoading,
    followerCount,
    toggleFollow
  };
};

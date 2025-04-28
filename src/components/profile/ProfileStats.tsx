
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

interface ProfileStatsProps {
  postsCount: number;
}

export const ProfileStats = ({ postsCount }: ProfileStatsProps) => {
  const { user } = useUser();
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    // In a real app, this would fetch from the backend
    // For now, we'll just use simple logic for demo purposes
    if (user) {
      // Get following count from user metadata
      const following = user.unsafeMetadata?.following as string[] || [];
      setFollowingCount(following.length);
      
      // Follower count will remain 0 until we implement that functionality
      setFollowerCount(0);
    }
  }, [user]);

  return (
    <div className="flex justify-center mt-6 border-b">
      <div className="flex space-x-8">
        <div className="text-center px-4 py-2 border-b-2 border-softspot-500">
          <span className="block font-medium text-softspot-500">{postsCount}</span>
          <span className="text-xs text-gray-500">Posts</span>
        </div>
        <div className="text-center px-4 py-2">
          <span className="block font-medium">{followerCount}</span>
          <span className="text-xs text-gray-500">Followers</span>
        </div>
        <div className="text-center px-4 py-2">
          <span className="block font-medium">{followingCount}</span>
          <span className="text-xs text-gray-500">Following</span>
        </div>
      </div>
    </div>
  );
};

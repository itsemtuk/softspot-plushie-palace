
import { ExtendedPost } from "@/types/marketplace";

interface ProfileStatsProps {
  postsCount: number;
}

export const ProfileStats = ({ postsCount }: ProfileStatsProps) => {
  return (
    <div className="flex justify-center mt-6 border-b">
      <div className="flex space-x-8">
        <div className="text-center px-4 py-2 border-b-2 border-softspot-500">
          <span className="block font-medium text-softspot-500">{postsCount}</span>
          <span className="text-xs text-gray-500">Posts</span>
        </div>
        <div className="text-center px-4 py-2">
          <span className="block font-medium">1.2k</span>
          <span className="text-xs text-gray-500">Followers</span>
        </div>
        <div className="text-center px-4 py-2">
          <span className="block font-medium">450</span>
          <span className="text-xs text-gray-500">Following</span>
        </div>
      </div>
    </div>
  );
};

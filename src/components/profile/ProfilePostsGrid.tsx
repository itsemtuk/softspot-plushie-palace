import { Grid3X3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtendedPost } from "@/types/core";

interface ProfilePostsGridProps {
  posts: ExtendedPost[];
  onPostClick: (post: ExtendedPost) => void;
  onDeletePost?: (postId: string) => void;
  isOwnProfile: boolean;
  showCreateButton?: boolean;
}

export const ProfilePostsGrid = ({
  posts,
  onPostClick,
  onDeletePost,
  isOwnProfile,
  showCreateButton = true,
}: ProfilePostsGridProps) => {
  if (posts.length === 0 && isOwnProfile && showCreateButton) {
    return (
      <div className="py-12 text-center">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex justify-center">
            <Grid3X3 className="h-12 w-12 text-softspot-300" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No posts yet</h3>
          <p className="mt-2 text-gray-500">Share your plushie adventures!</p>
          <Button className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white">
            Create Post
          </Button>
        </div>
      </div>
    );
  }

  if (posts.length === 0 && !isOwnProfile) {
    return (
      <div className="py-12 text-center">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex justify-center">
            <Grid3X3 className="h-12 w-12 text-softspot-300" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
          <p className="mt-2 text-gray-500">This user hasn't posted yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="relative cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => onPostClick(post)}
        >
          <img
            src={post.image || ''}
            alt={post.title || ''}
            className="object-cover w-full h-full aspect-square rounded-md"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="text-white font-medium p-2 text-center">
              <h3 className="text-lg line-clamp-2">{post.title || ''}</h3>
            </div>
          </div>
          {isOwnProfile && onDeletePost && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the post click
                onDeletePost(post.id);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};


import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtendedPost } from "@/types/core";
import { useCreatePost } from "@/hooks/use-create-post";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData } from "@/types/core";

interface ProfilePostsGridProps {
  posts: ExtendedPost[];
  onPostClick: (post: ExtendedPost) => void;
  isOwnProfile: boolean;
  showCreateButton?: boolean;
  onPostCreated?: (post: PostCreationData) => Promise<void>;
}

export const ProfilePostsGrid: React.FC<ProfilePostsGridProps> = ({
  posts,
  onPostClick,
  isOwnProfile,
  showCreateButton = true,
  onPostCreated
}) => {
  const { isPostCreationOpen, setIsPostCreationOpen } = useCreatePost();

  const handleCreatePost = () => {
    setIsPostCreationOpen(true);
  };

  const handlePostCreated = async (data: PostCreationData) => {
    if (onPostCreated) {
      await onPostCreated(data);
    }
    setIsPostCreationOpen(false);
  };

  return (
    <div className="space-y-4">
      {isOwnProfile && showCreateButton && (
        <Button
          onClick={handleCreatePost}
          className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-col items-center justify-center gap-2"
          variant="outline"
        >
          <Plus className="h-8 w-8 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">Create New Post</span>
        </Button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => onPostClick(post)}
            className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
          >
            {post.image ? (
              <img
                src={post.image}
                alt={post.title || post.content}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                <span className="text-sm text-gray-600 dark:text-gray-300 text-center p-4">
                  {post.title || post.content?.substring(0, 50) + "..."}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Post Creation Flow */}
      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={() => setIsPostCreationOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

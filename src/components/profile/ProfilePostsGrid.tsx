
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtendedPost } from "@/types/core";
import { useCreatePost } from "@/hooks/use-create-post";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData } from "@/types/core";
import { PostCard } from "@/components/post/PostCard";

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
          <PostCard
            key={post.id}
            post={post}
            onPostClick={onPostClick}
            onPostUpdated={(updatedPost) => {
              // Handle post updates if needed
              console.log('Post updated:', updatedPost);
            }}
            onPostDeleted={(postId) => {
              // Handle post deletion if needed  
              console.log('Post deleted:', postId);
            }}
          />
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

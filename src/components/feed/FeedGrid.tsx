import { useState } from "react";
import { PostCard } from "@/components/post/PostCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ExtendedPost } from "@/types/core";

interface FeedGridProps {
  posts: ExtendedPost[];
  onPostClick: (post: ExtendedPost) => void;
  onCreatePostClick?: () => void;
}

export const FeedGrid = ({ posts, onPostClick, onCreatePostClick }: FeedGridProps) => {
  const [showAllPosts, setShowAllPosts] = useState(false);

  const visiblePosts = showAllPosts ? posts : posts.slice(0, 6);

  const hasMorePosts = posts.length > 6 && !showAllPosts;

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
          <p className="mt-2 text-gray-500">Try a different search or create a new post.</p>
          {onCreatePostClick && (
            <Button onClick={onCreatePostClick} className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white">
              Create Post
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {visiblePosts.map((post) => (
          <div key={post.id} className="relative cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onPostClick(post)}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
      {hasMorePosts && (
        <div className="mt-6 flex justify-center">
          <Button onClick={() => setShowAllPosts(true)}>Show More</Button>
        </div>
      )}
    </>
  );
};

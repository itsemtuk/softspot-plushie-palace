
import { useState, useCallback, useEffect } from "react";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { Spinner } from "@/components/ui/spinner";
import { ExtendedPost } from "@/types/core";
import { FeedGrid } from "./FeedGrid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff } from "lucide-react";

interface FeedContentProps {
  initialPosts: ExtendedPost[];
  isLoading: boolean;
  isError: boolean;
  isOnline: boolean;
  onRefresh: () => void;
}

export const FeedContent = ({ initialPosts, isLoading, isError, isOnline, onRefresh }: FeedContentProps) => {
  const { openPostDialog } = usePostDialog();
  const [posts, setPosts] = useState<ExtendedPost[]>([]);

  // Update posts when initialPosts change
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handlePostClick = useCallback((post: ExtendedPost) => {
    openPostDialog(post);
  }, [openPostDialog]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Error loading posts. Please try again.</div>;
  }

  return (
    <div className="space-y-4">
      {!isOnline && (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
          <WifiOff className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Offline Mode:</strong> You're working offline. Changes will be synced when you reconnect.
          </AlertDescription>
        </Alert>
      )}
      {posts.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No posts available.</div>
      ) : (
        <FeedGrid posts={posts} onPostClick={handlePostClick} />
      )}
    </div>
  );
};

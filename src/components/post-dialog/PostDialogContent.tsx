
import { PostImage } from "./PostImage";
import { PostContent } from "./PostContent";
import { ExtendedPost, Comment as MarketplaceComment } from "@/types/marketplace";
import { Comment } from "./PostCommentItem";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PostDialogContentProps {
  post: ExtendedPost | null;
  isLoading: boolean;
  isAuthor: boolean;
  isLiked: boolean;
  likeCount: number;
  commentList: Comment[];
  onLikeToggle: () => void;
  onCommentLikeToggle: (commentId: string) => void;
  onCommentSubmit: (comment: string) => void;
  onFindSimilar: () => void;
  onClose: () => void;
  onSaveEdit: (editedPost: ExtendedPost) => Promise<boolean>;
  onDeletePost: () => void;
}

export function PostDialogContent({
  post,
  isLoading,
  isAuthor,
  isLiked,
  likeCount,
  commentList,
  onLikeToggle,
  onCommentLikeToggle,
  onCommentSubmit,
  onFindSimilar,
  onClose,
  onSaveEdit,
  onDeletePost
}: PostDialogContentProps) {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900">Post not found</h3>
        <p className="mt-2 text-sm text-gray-500">
          The post you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 h-full">
      {/* Only show one close button positioned according to device */}
      <Button 
        variant="ghost" 
        size="icon" 
        className={`absolute ${isMobile ? 'top-2 left-2' : 'top-2 right-2'} z-10 bg-white/80 hover:bg-white rounded-full`} 
        onClick={onClose}
      >
        <X className={`h-${isMobile ? '5' : '4'} w-${isMobile ? '5' : '4'}`} />
      </Button>

      {/* Left side - Image */}
      <PostImage imageUrl={post.image} altText={post.title} />
      
      {/* Right side - Content */}
      <PostContent 
        post={post}
        isAuthor={isAuthor}
        isLiked={isLiked}
        likeCount={likeCount}
        commentList={commentList}
        onLikeToggle={onLikeToggle}
        onCommentLikeToggle={onCommentLikeToggle}
        onCommentSubmit={onCommentSubmit}
        onFindSimilar={onFindSimilar}
        onClose={null} // Remove duplicate close button in PostContent
        onSaveEdit={onSaveEdit}
        onDeletePost={onDeletePost}
      />
    </div>
  );
}


import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { PostDialogContent } from "./post-dialog/PostDialogContent";
import { ExtendedPost, Comment as MarketplaceComment } from "@/types/marketplace";
import { Comment as PostCommentItemComment } from "./post-dialog/PostCommentItem";

interface PostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: ExtendedPost | null;
  isLoading?: boolean;
}

function convertToPostCommentItemComment(comment: MarketplaceComment): PostCommentItemComment {
  // Ensure we have a valid comment object
  if (!comment) return null as any;
  
  return {
    id: comment.id || "",
    text: comment.content || "",
    timestamp: comment.createdAt || new Date().toISOString(),
    userId: comment.userId || "",
    username: comment.username || "Anonymous",
    isLiked: Array.isArray(comment.likes) ? comment.likes.some(like => like.userId === "user-1") : false,
    likes: Array.isArray(comment.likes) ? comment.likes.length : 0
  };
}

export function PostDialog({ isOpen, onClose, post, isLoading = false }: PostDialogProps) {
  const {
    isLiked,
    likeCount,
    commentList,
    isAuthor,
    handleSaveEdit,
    handleLikeToggle,
    handleCommentLikeToggle,
    handleCommentSubmit,
    handleFindSimilar,
    handleDeletePost,
    setIsDialogOpen
  } = usePostDialog(post);

  // Close dialog and cleanup
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    if (onClose) onClose();
  };

  // Convert commentList to format expected by PostCommentItem
  const formattedComments: PostCommentItemComment[] = commentList
    .filter(comment => !!comment) // Filter out any null or undefined comments
    .map(convertToPostCommentItemComment);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <PostDialogContent
          post={post}
          isLoading={isLoading}
          isAuthor={isAuthor}
          isLiked={isLiked}
          likeCount={likeCount}
          commentList={formattedComments}
          onLikeToggle={handleLikeToggle}
          onCommentLikeToggle={handleCommentLikeToggle}
          onCommentSubmit={handleCommentSubmit}
          onFindSimilar={handleFindSimilar}
          onClose={handleCloseDialog}
          onSaveEdit={handleSaveEdit}
          onDeletePost={handleDeletePost}
        />
      </DialogContent>
    </Dialog>
  );
}

export default PostDialog;

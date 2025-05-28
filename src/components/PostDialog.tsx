
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { PostDialogContent } from "./post-dialog/PostDialogContent";
import { ExtendedPost, Comment } from "@/types/marketplace";
import { useEffect, useRef } from "react";

interface PostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: ExtendedPost | null;
  isLoading?: boolean;
}

// Convert any comment format to our unified Comment interface
function convertToUnifiedComment(comment: Comment | any): Comment {
  // Ensure we have a valid comment object
  if (!comment) return {
    id: `comment-${Date.now()}-${Math.random()}`,
    userId: '',
    username: 'Anonymous',
    content: '',
    timestamp: new Date().toISOString(),
    postId: '',
    likes: 0,
    isLiked: false
  };
  
  // Create a unified comment object that satisfies our Comment interface
  return {
    id: comment.id || `comment-${Date.now()}-${Math.random()}`,
    userId: comment.userId || "",
    username: comment.username || "Anonymous",
    content: comment.content || comment.text || "",
    timestamp: comment.timestamp || comment.createdAt || new Date().toISOString(),
    postId: comment.postId || "",
    likes: typeof comment.likes === 'number' ? comment.likes : 0,
    isLiked: Boolean(comment.isLiked)
  };
}

export function PostDialog({ isOpen, onClose, post, isLoading = false }: PostDialogProps) {
  const dialogContentRef = useRef<HTMLDivElement>(null);
  
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

  // Reset dialog scroll position when opened or content changes
  useEffect(() => {
    if (isOpen) {
      // Small timeout to ensure dialog is rendered
      setTimeout(() => {
        if (dialogContentRef.current) {
          dialogContentRef.current.scrollTop = 0;
        }
        
        // Fix for mobile: prevent body scroll when dialog is open
        document.body.style.overflow = 'hidden';
      }, 50);
    } else {
      // Re-enable scrolling when dialog closes
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, post?.id]);

  // Close dialog and cleanup
  const handleCloseDialog = () => {
    document.body.style.overflow = 'auto';
    setIsDialogOpen(false);
    if (onClose) onClose();
  };

  // Convert commentList to unified format expected by components
  const formattedComments: Comment[] = Array.isArray(commentList) ? 
    commentList
      .filter(comment => !!comment) // Filter out any null or undefined comments
      .map(comment => convertToUnifiedComment(comment)) 
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh]" ref={dialogContentRef}>
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

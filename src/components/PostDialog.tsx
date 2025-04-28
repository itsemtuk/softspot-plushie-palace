import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { PostDialogContent } from "./post-dialog/PostDialogContent";
import { ExtendedPost, Comment as MarketplaceComment } from "@/types/marketplace";
import { Comment } from "./post-dialog/PostCommentItem";
import { useEffect, useRef } from "react";

interface PostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: ExtendedPost | null;
  isLoading?: boolean;
}

// This function isn't used, but we'll keep it for future reference
function convertToPostCommentItemComment(comment: MarketplaceComment): Comment {
  // Ensure we have a valid comment object
  if (!comment) return {
    id: '',
    userId: '',
    username: 'Anonymous',
    text: '',
    timestamp: new Date().toISOString(),
    isLiked: false,
    likes: 0
  };
  
  return {
    id: comment.id || "",
    userId: comment.userId || "",
    username: comment.username || "Anonymous",
    text: comment.content || "",
    timestamp: comment.createdAt || new Date().toISOString(),
    isLiked: Array.isArray(comment.likes) ? comment.likes.some(like => like.userId === localStorage.getItem('currentUserId')) : false,
    likes: Array.isArray(comment.likes) ? comment.likes : 0
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
      .map(comment => {
        if (!comment) {
          return {
            id: `comment-${Date.now()}-${Math.random()}`,
            userId: '',
            username: 'Anonymous',
            text: '',
            isLiked: false,
            likes: 0
          };
        }
        
        // Create a consistent comment structure
        return {
          id: comment.id || `comment-${Date.now()}-${Math.random()}`,
          userId: comment.userId || "",
          username: comment.username || "Anonymous",
          text: ('text' in comment) ? comment.text : 
                ('content' in comment) ? comment.content : "",
          timestamp: ('timestamp' in comment) ? comment.timestamp : 
                    ('createdAt' in comment) ? comment.createdAt : new Date().toISOString(),
          isLiked: ('isLiked' in comment) ? Boolean(comment.isLiked) : false,
          likes: ('likes' in comment) 
            ? (Array.isArray(comment.likes) ? comment.likes.length : 
              (typeof comment.likes === 'number' ? comment.likes : 0))
            : 0
        };
      }) : [];

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

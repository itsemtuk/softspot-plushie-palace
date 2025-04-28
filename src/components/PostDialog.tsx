
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Comment } from "./post-dialog/PostCommentItem";
import { PostContent } from "./post-dialog/PostContent";
import { togglePostLike, updatePost } from "@/utils/postStorage";
import { useUser } from "@clerk/clerk-react";
import { ExtendedPost } from "@/types/marketplace";
import { Spinner } from "./ui/spinner";

interface PostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: ExtendedPost | null;
  isLoading?: boolean;
}

export function PostDialog({ isOpen, onClose, post, isLoading = false }: PostDialogProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Update local state when post changes
  useEffect(() => {
    if (post) {
      setLikeCount(post.likes);
      setIsLiked(false); // Reset like state for each post
      
      // Reset comment list when post changes to prevent duplication
      setCommentList(post.comments ? 
        Array.isArray(post.comments) ? 
          post.comments.map((comment: any) => ({
            id: comment.id || `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            username: comment.username || 'Anonymous',
            text: comment.text || comment.content || '',
            timestamp: comment.timestamp || new Date().toISOString(),
            isLiked: comment.isLiked || false,
            likes: comment.likes || 0,
          })) 
        : []
      : []);
    }
  }, [post?.id]); // Only reset when the post ID changes, not on every post prop change

  const { user } = useUser();
  // Only consider the user as author if both user and post exist and usernames match
  const isAuthor = user && post ? user.username === post.username : false;

  const handleSaveEdit = async (newTitle: string, newDescription: string) => {
    if (!post) return;

    try {
      const updatedPost: ExtendedPost = {
        ...post,
        title: newTitle,
        description: newDescription,
        userId: post.userId || user?.id || 'anonymous',
        timestamp: post.timestamp || new Date().toISOString(),
      };

      const result = await updatePost(updatedPost);

      if (result.success) {
        toast({
          title: "Post updated",
          description: "Your changes have been saved successfully.",
        });
      } else {
        throw new Error(result.error || "Failed to update post");
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update post. Please try again.",
      });
    }
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    // Attempt to update the backend (optional, can fail silently)
    if (post) {
      togglePostLike(post.id)
        .catch(err => console.error('Failed to toggle like:', err));
    }
  };

  const handleCommentLikeToggle = (commentId: string) => {
    setCommentList(comments => 
      comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, isLiked: !comment.isLiked }
          : comment
      )
    );
  };

  const handleCommentSubmit = (comment: string) => {
    if (!comment.trim() || !user) return;
    
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      username: user?.username || 'Anonymous',
      text: comment,
      timestamp: new Date().toISOString(),
      isLiked: false,
      likes: 0,
    };
    
    // Add comment to local state
    setCommentList(prev => [...prev, newComment]);
    
    // Update post with new comment (optional)
    if (post) {
      const updatedComments = [...(Array.isArray(post.comments) ? post.comments : []), { 
        id: newComment.id,
        username: newComment.username,
        text: newComment.text,
        timestamp: newComment.timestamp,
        isLiked: false,
        likes: 0
      }];
      
      const updatedPost = {
        ...post,
        comments: updatedComments
      };
      
      // This is optional and can fail silently
      updatePost(updatedPost)
        .catch(err => console.error('Failed to save comment:', err));
    }
  };

  const handleFindSimilar = () => {
    navigate('/feed');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 w-full">
            <Spinner size="lg" />
          </div>
        ) : !post ? (
          <div className="flex flex-col items-center justify-center h-64 w-full p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">Post not found</h3>
            <p className="mt-2 text-sm text-gray-500">
              The post you're looking for doesn't exist or has been removed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {/* Left side - Image */}
            <div className="bg-black flex items-center justify-center">
              <AspectRatio ratio={1} className="w-full">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="object-cover w-full h-full" 
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                    console.error("Failed to load image:", post.image);
                  }}
                />
              </AspectRatio>
            </div>
            
            {/* Right side - Content */}
            <PostContent 
              post={post}
              isAuthor={isAuthor}
              isLiked={isLiked}
              likeCount={likeCount}
              commentList={commentList}
              onLikeToggle={handleLikeToggle}
              onCommentLikeToggle={handleCommentLikeToggle}
              onCommentSubmit={handleCommentSubmit}
              onFindSimilar={handleFindSimilar}
              onClose={onClose}
              onSaveEdit={handleSaveEdit}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PostDialog;

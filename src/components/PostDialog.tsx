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
import { togglePostLike } from "@/utils/postStorage";

interface PostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    image: string;
    title: string;
    username: string;
    likes: number;
    comments: number;
    description?: string;
    tags?: string[];
  } | null;
}

export function PostDialog({ isOpen, onClose, post }: PostDialogProps) {
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
      
      // In a real app, we would fetch comments for this post from Supabase here
      // and check if the current user has liked this post
      setCommentList([]);
    }
  }, [post]);
  
  if (!post) return null;

  const handleLikeToggle = async () => {
    if (isSubmitting) return; // Prevent multiple clicks while processing
    
    setIsSubmitting(true);
    
    // Optimistically update UI
    if (isLiked) {
      // Unlike post
      setLikeCount(prev => Math.max(0, prev - 1));
      setIsLiked(false);
      toast({
        title: "Post unliked",
        description: "You have removed your like from this post."
      });
    } else {
      // Like post
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      
      try {
        // Update in Supabase or local storage
        const result = await togglePostLike(post.id);
        
        if (!result.success) {
          // Revert UI if update failed
          setLikeCount(prev => Math.max(0, prev - 1));
          setIsLiked(false);
          throw new Error("Failed to like post");
        }
      } catch (error) {
        console.error('Error toggling like:', error);
        toast({
          variant: "destructive",
          title: "Failed to like post",
          description: "Please check your connection and try again."
        });
      }
    }
    
    setIsSubmitting(false);
  };

  const handleCommentLikeToggle = (commentId: string) => {
    setCommentList(prevComments => prevComments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  const handleCommentSubmit = (newComment: string) => {
    // Add the new comment
    const currentUsername = localStorage.getItem('currentUsername') || "You"; // Fallback to "You" if not set
    
    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      username: currentUsername,
      text: newComment,
      timestamp: "Just now",
      likes: 0,
      isLiked: false
    };
    
    setCommentList(prev => [...prev, newCommentObj]);
    toast({
      title: "Comment posted",
      description: "Your comment has been added to the post.",
    });
    
    // In a real app, we would save this comment to Supabase here
  };

  const handleFindSimilar = () => {
    // In a real app, navigate to a filtered marketplace view with similar plushies
    navigate("/marketplace?similar=" + encodeURIComponent(post.title));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Left side - Image */}
          <div className="bg-black flex items-center justify-center">
            <AspectRatio ratio={1} className="w-full">
              <img src={post.image} alt={post.title} className="object-cover w-full h-full" />
            </AspectRatio>
          </div>
          
          {/* Right side - Content */}
          <PostContent 
            post={post}
            isLiked={isLiked}
            likeCount={likeCount}
            commentList={commentList}
            onLikeToggle={handleLikeToggle}
            onCommentLikeToggle={handleCommentLikeToggle}
            onCommentSubmit={handleCommentSubmit}
            onFindSimilar={handleFindSimilar}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PostDialog;

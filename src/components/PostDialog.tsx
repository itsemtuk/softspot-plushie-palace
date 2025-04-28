
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Comment } from "./post-dialog/PostCommentItem";
import { PostContent } from "./post-dialog/PostContent";

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
  const navigate = useNavigate();
  
  if (!post) return null;

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
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
    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      username: "currentUser", // In a real app, this would come from auth
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

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

  const { user } = useUser();
  const isAuthor = user?.username === post?.username;

  const handleSaveEdit = async (newTitle: string, newDescription: string) => {
    if (!post) return;

    try {
      const updatedPost = {
        ...post,
        title: newTitle,
        description: newDescription,
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

  if (!post) return null;

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
      </DialogContent>
    </Dialog>
  );
}

export default PostDialog;


import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, MessageCircle, Tag, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

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
  const [newComment, setNewComment] = useState("");
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
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
    setNewComment("");
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
          <div className="p-6 flex flex-col h-full max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{post.title}</DialogTitle>
              <div className="text-sm text-gray-500 flex items-center justify-between mt-2">
                <span>@{post.username}</span>
              </div>
            </DialogHeader>
            
            {post.description && (
              <div className="my-4">
                <p className="text-gray-700">{post.description}</p>
              </div>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 my-4">
                {post.tags.map(tag => (
                  <div key={tag} className="bg-softspot-100 text-softspot-700 px-2 py-1 rounded-full text-xs flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-4 my-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`flex items-center gap-2 ${isLiked ? "text-rose-500" : "text-gray-700"}`}
                onClick={handleLikeToggle}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-rose-500" : ""}`} />
                <span>{likeCount}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>{commentList.length}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-auto text-softspot-600"
                onClick={handleFindSimilar}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Find Similar
              </Button>
            </div>
            
            <Separator className="my-2" />
            
            {commentList.length > 0 && (
              <div className="mt-4 mb-4 space-y-3">
                <h3 className="font-medium text-sm">Comments</h3>
                {commentList.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">@{comment.username}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
                    <div className="flex items-center mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-1 p-0 h-auto text-xs ${comment.isLiked ? "text-rose-500" : "text-gray-500"}`}
                        onClick={() => handleCommentLikeToggle(comment.id)}
                      >
                        <Heart className={`h-3 w-3 ${comment.isLiked ? "fill-rose-500" : ""}`} />
                        <span>{comment.likes}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t pt-4 mt-auto">
              <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
                <Textarea 
                  placeholder="Add a comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="resize-none"
                />
                <Button 
                  type="submit" 
                  className="bg-softspot-400 hover:bg-softspot-500 self-end"
                  disabled={!newComment.trim()}
                >
                  Post
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PostDialog;

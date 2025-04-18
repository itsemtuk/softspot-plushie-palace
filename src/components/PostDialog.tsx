
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would handle saving the comment to backend here
    setNewComment("");
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
                <span>{post.comments}</span>
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
            
            <div className="border-t pt-4 mt-auto">
              <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
                <Textarea 
                  placeholder="Add a comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="resize-none"
                />
                <Button type="submit" className="bg-softspot-400 hover:bg-softspot-500 self-end">
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

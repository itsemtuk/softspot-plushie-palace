
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
import { 
  Heart, 
  MessageCircle, 
  Tag, 
  Package, 
  Shirt,
  Box,
  PawPrint,
  Ruler,
  TruckIcon,
  GlobeIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarketplacePlushie } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface PlushieDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plushie: MarketplacePlushie;
}

export function PlushieDetailDialog({ isOpen, onClose, plushie }: PlushieDetailDialogProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(plushie?.likes || 0);
  const [comments, setComments] = useState<Comment[]>([
    { 
      id: "c1", 
      username: "plushmaster", 
      text: "This looks amazing! How soft is it?",
      timestamp: "2 days ago",
      likes: 3,
      isLiked: false
    }
  ]);
  
  const handleLikeToggle = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCommentLikeToggle = (commentId: string) => {
    setComments(prevComments => prevComments.map(comment => {
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
    
    setComments(prev => [...prev, newCommentObj]);
    setNewComment("");
    toast({
      title: "Comment posted",
      description: "Your comment has been added to the discussion.",
    });
  };

  if (!plushie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left side - Image */}
          <div className="bg-black flex items-center justify-center">
            <AspectRatio ratio={1} className="w-full">
              <img src={plushie.image} alt={plushie.title} className="object-cover w-full h-full" />
            </AspectRatio>
          </div>
          
          {/* Right side - Content */}
          <div className="p-6 flex flex-col h-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{plushie.title}</DialogTitle>
              <div className="text-sm text-gray-500 flex items-center justify-between mt-2">
                <span>Listed by @{plushie.username}</span>
                <Badge variant="outline" className="bg-softspot-50 text-softspot-500">
                  {plushie.condition}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-softspot-500 mt-2">£{plushie.price.toFixed(2)}</p>
            </DialogHeader>
            
            {/* Plushie Details */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Brand: <span className="font-medium">{plushie.brand}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Shirt className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Material: <span className="font-medium">{plushie.material}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Filling: <span className="font-medium">{plushie.filling}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Species: <span className="font-medium">{plushie.species}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: plushie.color }}></div>
                <span className="text-sm">Color: <span className="font-medium">{plushie.color}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Size: <span className="font-medium">Medium</span></span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="my-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700">{plushie.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 my-4">
              <h3 className="font-medium w-full mb-2">Tags</h3>
              {["plushie", plushie.species, plushie.brand, plushie.condition.toLowerCase()].map(tag => (
                <div key={tag} className="bg-softspot-100 text-softspot-700 px-2 py-1 rounded-full text-xs flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </div>
              ))}
            </div>
            
            <div className="my-4">
              <h3 className="font-medium mb-2">Delivery Information</h3>
              <div className="flex items-center gap-2 text-sm">
                <TruckIcon className="h-4 w-4 text-gray-400" />
                <span>Delivery Cost: £3.99</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <GlobeIcon className="h-4 w-4 text-gray-400" />
                <span>Ships to: United Kingdom</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
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
                <span>{comments.length}</span>
              </Button>
              
              <Button 
                className="ml-auto bg-softspot-500 hover:bg-softspot-600 text-white"
              >
                Contact Seller
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="mt-4">
              <h3 className="font-medium mb-4">Comments ({comments.length})</h3>
              <div className="space-y-4 mb-4">
                {comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">@{comment.username}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="mt-1 text-gray-700">{comment.text}</p>
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
            </div>
            
            <div className="mt-auto pt-4">
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

export default PlushieDetailDialog;


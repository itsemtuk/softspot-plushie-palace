
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ShoppingBag } from "lucide-react";

interface PostActionsProps {
  likes: number;
  comments: number;
  isLiked: boolean;
  onLikeToggle: () => void;
  onFindSimilar: () => void;
}

export function PostActions({ 
  likes, 
  comments, 
  isLiked, 
  onLikeToggle, 
  onFindSimilar 
}: PostActionsProps) {
  return (
    <div className="flex items-center gap-4 my-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-2 ${isLiked ? "text-rose-500" : "text-gray-700"}`}
        onClick={onLikeToggle}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-rose-500" : ""}`} />
        <span>{likes}</span>
      </Button>
      
      <Button variant="ghost" size="sm" className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <span>{comments}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm"
        className="ml-auto text-softspot-600"
        onClick={onFindSimilar}
      >
        <ShoppingBag className="h-5 w-5 mr-2" />
        Find Similar
      </Button>
    </div>
  );
}

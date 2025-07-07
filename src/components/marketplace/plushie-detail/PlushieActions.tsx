
import { Heart, MessageCircle, Loader, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostMenu } from "@/components/post-dialog/PostMenu";

interface PlushieActionsProps {
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  onLikeToggle: () => void;
  isLoading?: boolean;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PlushieActions({ 
  isLiked, 
  likeCount, 
  commentCount, 
  onLikeToggle,
  isLoading = false,
  isOwner = false,
  onEdit,
  onDelete
}: PlushieActionsProps) {
  return (
    <div className="flex items-center gap-4 my-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-2 ${isLiked ? "text-rose-500" : "text-gray-700"}`}
        onClick={onLikeToggle}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="h-5 w-5 animate-spin" />
        ) : (
          <Heart className={`h-5 w-5 ${isLiked ? "fill-rose-500" : ""}`} />
        )}
        <span>{likeCount}</span>
      </Button>
      
      <Button variant="ghost" size="sm" className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <span>{commentCount}</span>
      </Button>
      
      {isOwner ? (
        <div className="ml-auto flex items-center gap-2">
          <PostMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      ) : (
        <Button 
          className="ml-auto bg-softspot-500 hover:bg-softspot-600 text-white"
          disabled={isLoading}
        >
          Contact Seller
        </Button>
      )}
    </div>
  );
}

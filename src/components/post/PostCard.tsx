
import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtendedPost } from "@/types/core";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { PostMenu } from "@/components/post-dialog/PostMenu";
import { useUser } from "@clerk/clerk-react";
import { usePostActions } from "@/hooks/usePostActions";

interface PostCardProps {
  post: ExtendedPost;
  onPostClick?: (post: ExtendedPost) => void;
}

export const PostCard = ({ post, onPostClick }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useUser();
  const { handleEditPost, handleDeletePost } = usePostActions();

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    console.log("PostCard clicked:", post);
    if (onPostClick) {
      onPostClick(post);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    console.log("Post liked:", post.id);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Comment clicked for post:", post.id);
    if (onPostClick) {
      onPostClick(post);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Share clicked for post:", post.id);
    // Add share functionality here
  };

  const handleEdit = () => {
    handleEditPost(post);
  };

  const handleDelete = async () => {
    await handleDeletePost(post.id);
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={handleClick}>
      {post.image && (
        <AspectRatio ratio={1} className="bg-gray-100">
          <img
            src={post.image}
            alt={post.title || post.content}
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-plushie.jpg';
            }}
          />
        </AspectRatio>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{post.username}</span>
          {user?.id === post.userId && (
            <PostMenu onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
        
        {post.title && <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description || post.content}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`p-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="ml-1 text-xs">{post.likes || 0}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 text-gray-500"
              onClick={handleComment}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="ml-1 text-xs">{post.comments || 0}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 text-gray-500"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          <span className="text-xs text-gray-400">
            {new Date(post.timestamp).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

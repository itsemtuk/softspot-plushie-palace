
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExtendedPost } from '@/types/marketplace';
import { useUser } from "@clerk/clerk-react";

interface PostCardProps {
  post: ExtendedPost;
  onLike?: (postId: string) => void;
}

export const PostCard = ({ post, onLike }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLikeClick = () => {
    if (onLike) {
      onLike(post.id);
    }
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // Check if this post belongs to the current user
  const isCurrentUserPost = user?.id === post.userId;
  
  // Profile link routing
  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrentUserPost) {
      navigate('/me'); // Use /me route for current user
    } else if (post.userId) {
      navigate(`/user/${post.userId}`);
    }
  };

  // Extract first letter from username for avatar fallback
  const avatarFallback = post.username ? post.username[0].toUpperCase() : '?';

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/post/${post.id}`}>
        <div className="relative aspect-square">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300?text=Image+Error';
            }}
          />
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleProfileClick}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.username}`} alt={post.username} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium hover:text-softspot-500 transition-colors">{post.username}</p>
          </div>
        </div>
        
        <Link to={`/post/${post.id}`}>
          <h3 className="text-lg font-semibold mb-1 line-clamp-1">{post.title}</h3>
        </Link>
        
        {post.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.description}</p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center gap-1 text-gray-500 hover:text-softspot-500 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleLikeClick();
              }}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-softspot-500 text-softspot-500' : ''}`} />
              <span className="text-xs">{likesCount}</span>
            </button>
            <Link to={`/post/${post.id}`} className="flex items-center gap-1 text-gray-500 hover:text-softspot-500 transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{post.comments}</span>
            </Link>
          </div>
          
          <button className="flex items-center gap-1 text-gray-500 hover:text-softspot-500 transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;

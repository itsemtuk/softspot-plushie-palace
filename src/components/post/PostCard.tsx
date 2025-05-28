
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare } from 'lucide-react';
import { ExtendedPost } from '@/types/marketplace';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: ExtendedPost;
  onLike?: (postId: string) => void;
  onClick?: () => void;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike,
  onClick,
  className 
}) => {
  const { id, username, image, likes, comments, forSale, createdAt, price } = post;
  
  const formattedTime = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';
  
  // Safely handle price formatting
  const safePrice = typeof price === 'number' ? price : 
                    typeof price === 'string' ? parseFloat(price) : 0;
  const displayPrice = isNaN(safePrice) ? 0 : safePrice;
  
  return (
    <Card 
      className={cn("overflow-hidden cursor-pointer transition-all hover:shadow-md bg-white", 
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{username?.[0] || 'U'}</AvatarFallback>
            <AvatarImage src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${username}`} />
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{username}</span>
            {formattedTime && <span className="text-[10px] text-gray-500">{formattedTime}</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-2">
        <div className="aspect-square max-h-72 overflow-hidden">
          <img
            src={image}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(id);
            }}
          >
            <Heart className="h-4 w-4" />
            <span className="ml-1 text-xs">{likes || 0}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="ml-1 text-xs">{comments || 0}</span>
          </Button>
        </div>
        {forSale && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
              For Sale
            </span>
            {price && (
              <span className="text-xs font-medium text-gray-600">
                ${displayPrice.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

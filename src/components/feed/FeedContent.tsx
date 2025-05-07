
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { ExtendedPost } from "@/types/marketplace";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedContentProps {
  posts: ExtendedPost[];
  onPostClick: (post: ExtendedPost) => void;
}

export const FeedContent = ({ posts, onPostClick }: FeedContentProps) => {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex items-center p-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage 
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.username}`}
                alt={post.username} 
              />
              <AvatarFallback>{post.username?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">{post.username}</h3>
              <p className="text-xs text-gray-500">
                {post.timestamp ? new Date(post.timestamp).toLocaleString('en-US', { 
                  hour: 'numeric',
                  minute: 'numeric',
                  day: 'numeric',
                  month: 'short'
                }) : 'Recently'}
                {post.forSale && <span className="text-softspot-500 ml-2">• Selling</span>}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-softspot-500">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="px-4 pb-2">
            <p>{post.description || post.title}</p>
          </div>
          
          {post.image && (
            <div 
              className="w-full bg-gray-100"
              onClick={() => onPostClick(post)}
            >
              <img 
                src={post.image} 
                alt={post.title || "Post"} 
                className="w-full object-cover max-h-96 cursor-pointer"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Error';
                }}
              />
            </div>
          )}
          
          {post.forSale ? (
            <div className="p-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="font-bold text-softspot-500 text-lg">
                    ${post.price?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <Button 
                  className="bg-softspot-500 hover:bg-softspot-600 text-white"
                  onClick={() => onPostClick(post)}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 flex justify-between">
              <Button variant="ghost" size="sm" className="flex items-center text-gray-600 hover:text-softspot-500">
                <Heart className="mr-2 h-4 w-4" />
                <span>{post.likes || 0}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center text-gray-600 hover:text-softspot-500"
                onClick={() => onPostClick(post)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>{post.comments || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center text-gray-600 hover:text-softspot-500">
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

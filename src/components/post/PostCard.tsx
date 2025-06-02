import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ExtendedPost } from "@/types/core";

interface PostCardProps {
  post: ExtendedPost;
  onPostClick: (post: ExtendedPost) => void;
}

export const PostCard = ({ post, onPostClick }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPostClick(post);
  };

  return (
    <Card
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
      onClick={() => onPostClick(post)}
    >
      <CardContent className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-3">{post.description}</p>
          <div className="flex items-center mt-4 space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLikeClick}
              className="hover:bg-softspot-100"
            >
              <Heart
                className={`h-5 w-5 ${isLiked ? "text-red-500" : "text-gray-500"}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCommentClick}
              className="hover:bg-softspot-100"
            >
              <MessageCircle className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-softspot-100">
              <Share2 className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageIcon, Tag, BarChart2 } from "lucide-react";

interface QuickPostFormProps {
  onCreatePost: () => void;
  value: string;
  onChange: (value: string) => void;
}

export const QuickPostForm = ({ onCreatePost, value, onChange }: QuickPostFormProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const handleSellClick = () => {
    navigate('/marketplace/sell');
  };
  
  const handlePollClick = () => {
    // Open create post dialog with poll option pre-selected
    onCreatePost();
  };
  
  return (
    <Card className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage 
            src={user?.imageUrl || `https://api.dicebear.com/6.x/initials/svg?seed=${user?.firstName || 'User'}`} 
            alt="Profile" 
          />
          <AvatarFallback>{user?.firstName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <input 
          type="text"
          placeholder="Share your plushie news..." 
          className="flex-1 py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-softspot-400 focus:bg-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={onCreatePost}
        />
      </div>
      <div className="flex justify-between mt-3 pt-3 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-gray-600 hover:text-softspot-500"
          onClick={onCreatePost}
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          <span>Photo</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-gray-600 hover:text-softspot-500"
          onClick={handleSellClick}
        >
          <Tag className="mr-2 h-4 w-4" />
          <span>Sell</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-gray-600 hover:text-softspot-500"
          onClick={handlePollClick}
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          <span>Poll</span>
        </Button>
      </div>
    </Card>
  );
};

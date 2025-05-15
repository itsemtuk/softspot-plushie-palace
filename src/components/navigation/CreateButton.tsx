
import { useState } from "react";
import { PlusCircle, Image, Send, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { v4 as uuidv4 } from "uuid";
import { ExtendedPost } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface CreateButtonProps {
  onCreatePost: () => void;
}

export const CreateButton = ({ onCreatePost }: CreateButtonProps) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post."
      });
      navigate('/sign-in');
      return;
    }

    setIsDropdownOpen(false);
    onCreatePost();
  };

  const handleCreateDemoPlushie = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add a plushie."
      });
      navigate('/sign-in');
      return;
    }

    const demoPost: Partial<ExtendedPost> = {
      id: uuidv4(),
      userId: user.id,
      image: "https://i.pravatar.cc/300?img=1",
      title: "Lovely Teddy Bear",
      username: user.username || "user",
      description: "A lovely teddy bear for sale. Great condition and very huggable!",
      tags: ["teddy", "bear", "plushie"],
      timestamp: new Date().toISOString(),
      price: 24.99,
      forSale: false,
      condition: "Like New",
      color: "Brown",
      material: "Cotton",
      location: "New York",
      deliveryCost: 5.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log("Created demo plushie:", demoPost);
    setIsDropdownOpen(false);
    
    toast({
      title: "Demo Plushie Created",
      description: "Your demo plushie was created successfully!"
    });
  };

  const handleSellItem = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to sell an item."
      });
      navigate('/sign-in');
      return;
    }

    setIsDropdownOpen(false);
    navigate('/sell-item');
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          className="bg-softspot-500 hover:bg-softspot-600 text-white rounded-full px-4"
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span>Create</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Create New</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCreatePost} className="cursor-pointer">
          <Image className="mr-2 h-4 w-4" />
          <span>Post</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSellItem} className="cursor-pointer">
          <Send className="mr-2 h-4 w-4" />
          <span>Sell a Plushie</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCreateDemoPlushie} className="cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>Create Demo Plushie</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

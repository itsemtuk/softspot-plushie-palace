
import { useState } from "react";
import { PlusCircle, Image, Tag, Handshake } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/hooks/use-create-post";

export const CreateDropdown = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { setIsPostCreationOpen } = useCreatePost();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post.",
        variant: "destructive"
      });
      navigate('/sign-in');
      return;
    }

    setIsDropdownOpen(false);
    setIsPostCreationOpen(true);
  };

  const handleSellItem = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to sell an item.",
        variant: "destructive"
      });
      navigate('/sign-in');
      return;
    }

    setIsDropdownOpen(false);
    navigate('/sell');
  };
  
  const handleTradeRequest = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a trade request.",
        variant: "destructive"
      });
      navigate('/sign-in');
      return;
    }

    setIsDropdownOpen(false);
    navigate('/messages');
    
    toast({
      title: "Trade Request",
      description: "Trade request feature coming soon!"
    });
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          className="bg-softspot-500 hover:bg-softspot-600 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span>Create</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[220px] bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 z-50"
      >
        <DropdownMenuLabel className="text-gray-900 dark:text-gray-100 font-medium">
          Create New
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        <DropdownMenuItem 
          onClick={handleCreatePost} 
          className="cursor-pointer rounded-lg mx-1 hover:bg-softspot-50 dark:hover:bg-softspot-900/20 text-gray-700 dark:text-gray-200 transition-colors focus:bg-softspot-50 dark:focus:bg-softspot-900/20 focus:text-gray-900 dark:focus:text-gray-100"
        >
          <Image className="mr-2 h-4 w-4" />
          <span>New Post</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleTradeRequest} 
          className="cursor-pointer rounded-lg mx-1 hover:bg-softspot-50 dark:hover:bg-softspot-900/20 text-gray-700 dark:text-gray-200 transition-colors focus:bg-softspot-50 dark:focus:bg-softspot-900/20 focus:text-gray-900 dark:focus:text-gray-100"
        >
          <Handshake className="mr-2 h-4 w-4" />
          <span>Trade Request</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSellItem} 
          className="cursor-pointer rounded-lg mx-1 hover:bg-softspot-50 dark:hover:bg-softspot-900/20 text-gray-700 dark:text-gray-200 transition-colors focus:bg-softspot-50 dark:focus:bg-softspot-900/20 focus:text-gray-900 dark:focus:text-gray-100"
        >
          <Tag className="mr-2 h-4 w-4" />
          <span>Sell Plushie</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

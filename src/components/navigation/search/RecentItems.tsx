
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentItemsProps {
  setIsOpen: (isOpen: boolean) => void;
}

export const RecentItems = ({ setIsOpen }: RecentItemsProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Recent Plushies</h3>
      <div className="space-y-2">
        <Link 
          to="/marketplace/plushie-1"
          className="flex items-center p-2 hover:bg-gray-100 rounded-md"
          onClick={() => setIsOpen(false)}
        >
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Teddy" />
            <AvatarFallback>TB</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Vintage Teddy Bear</p>
            <p className="text-xs text-gray-500">$24.99</p>
          </div>
        </Link>
        <Link 
          to="/marketplace/plushie-2"
          className="flex items-center p-2 hover:bg-gray-100 rounded-md"
          onClick={() => setIsOpen(false)}
        >
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="https://i.pravatar.cc/150?img=2" alt="Bunny" />
            <AvatarFallback>RB</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Rainbow Bunny</p>
            <p className="text-xs text-gray-500">$19.50</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

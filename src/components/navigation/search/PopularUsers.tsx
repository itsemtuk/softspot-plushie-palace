
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PopularUsersProps {
  setIsOpen: (isOpen: boolean) => void;
}

export const PopularUsers = ({ setIsOpen }: PopularUsersProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Popular Users</h3>
      <div className="space-y-2">
        <Link 
          to="/profile"
          className="flex items-center p-2 hover:bg-gray-100 rounded-md"
          onClick={() => setIsOpen(false)}
        >
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="https://i.pravatar.cc/150?img=10" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Jane Doe</p>
            <p className="text-xs text-gray-500">@janeplushie</p>
          </div>
        </Link>
        <Link 
          to="/profile"
          className="flex items-center p-2 hover:bg-gray-100 rounded-md"
          onClick={() => setIsOpen(false)}
        >
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="https://i.pravatar.cc/150?img=11" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-gray-500">@teddymaster</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

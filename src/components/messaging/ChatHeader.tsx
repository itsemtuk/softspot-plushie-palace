
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface ChatHeaderProps {
  conversation: Conversation;
  isMobile: boolean;
  onBackToList: () => void;
}

export const ChatHeader = ({ conversation, isMobile, onBackToList }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBackToList}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.avatar} />
            <AvatarFallback className="bg-softspot-500 text-white">
              {conversation.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {conversation.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {conversation.online ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Active now
                </span>
              ) : (
                'Last seen 1h ago'
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

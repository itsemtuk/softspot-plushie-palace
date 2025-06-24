
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
}

export const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation 
}: ConversationListProps) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
              selectedConversation === conversation.id
                ? 'bg-softspot-100 dark:bg-softspot-900'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-softspot-500 text-white">
                  {conversation.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {conversation.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {conversation.name}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {conversation.timestamp}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {conversation.lastMessage}
              </p>
            </div>
            
            {conversation.unread > 0 && (
              <Badge className="ml-2 bg-softspot-500 text-white">
                {conversation.unread}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

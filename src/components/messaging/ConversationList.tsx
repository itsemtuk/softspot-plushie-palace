
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${
              selectedConversation === conversation.id
                ? 'bg-softspot-100 dark:bg-softspot-900 border-l-4 border-softspot-500'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback className="bg-softspot-500 text-white">
                    {conversation.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {conversation.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {conversation.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread > 0 && (
                <div className="bg-softspot-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {conversation.unread}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

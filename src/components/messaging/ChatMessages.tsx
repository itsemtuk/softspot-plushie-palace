
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  conversation: Conversation;
}

export const ChatMessages = ({ messages, conversation }: ChatMessagesProps) => {
  return (
    <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
      <div className="space-y-4 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
              message.sender === 'me' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {message.sender === 'them' && (
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-gray-400 text-xs">
                    {conversation.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`px-4 py-2 rounded-2xl shadow-sm ${
                  message.sender === 'me'
                    ? 'bg-softspot-500 text-white rounded-br-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {messages[messages.length - 1]?.timestamp}
          </span>
        </div>
      </div>
    </ScrollArea>
  );
};

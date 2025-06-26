
import { useState } from "react";
import { ArrowLeft, Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "/placeholder.svg",
    lastMessage: "Hey, is the Jellycat bunny still available?",
    timestamp: "2 min ago",
    unread: true
  },
  {
    id: "2", 
    name: "Sarah Smith",
    avatar: "/placeholder.svg",
    lastMessage: "Thanks for the quick delivery!",
    timestamp: "1 hour ago",
    unread: false
  }
];

export default function MobileMessages() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  if (selectedConversation) {
    const conversation = mockConversations.find(c => c.id === selectedConversation);
    
    return (
      <MainLayout>
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
          {/* Chat Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedConversation(null)}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <img
                src={conversation?.avatar}
                alt={conversation?.name}
                className="w-10 h-10 rounded-full bg-gray-200"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {conversation?.name}
                </h3>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="bg-softspot-500 text-white p-3 rounded-2xl rounded-br-md max-w-xs">
                  <p className="text-sm">Hi! Is the Jellycat bunny still available?</p>
                  <p className="text-xs opacity-75 mt-1">2:30 PM</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-md max-w-xs">
                  <p className="text-sm text-gray-900 dark:text-white">Yes, it's still available! Would you like to make an offer?</p>
                  <p className="text-xs text-gray-500 mt-1">2:32 PM</p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button size="sm" className="bg-softspot-500 hover:bg-softspot-600">
                Send
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-0 rounded-none"
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full bg-gray-200"
                    />
                    {conversation.unread && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-softspot-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium truncate ${conversation.unread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <p className={`text-sm truncate mt-1 ${conversation.unread ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  );
}

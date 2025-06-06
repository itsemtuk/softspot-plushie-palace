
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/layout/MainLayout';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

const MessagesPage = () => {
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'PlushieLover123',
      content: 'Hey! I saw your Jellycat collection post. Amazing!',
      timestamp: '2 min ago',
      isRead: false
    },
    {
      id: '2',
      sender: 'SquishCollector',
      content: 'Are you interested in trading your rare Squishmallow?',
      timestamp: '1 hour ago',
      isRead: true
    }
  ]);

  return (
    <MainLayout>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Messages</h2>
          <Button className="bg-softspot-500 hover:bg-softspot-600 text-white flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Message
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No messages yet. Start a conversation!
                  </p>
                </div>
              ) : (
                messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow ${
                      !message.isRead ? 'border-l-4 border-l-softspot-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {message.sender}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{message.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MessagesPage;

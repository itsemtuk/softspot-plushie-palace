
import { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ConversationHeader } from './ConversationHeader';
import { ConversationList } from './ConversationList';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { MessageInput } from './MessageInput';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    avatar: '',
    lastMessage: 'Is the Jellycat bunny still available?',
    timestamp: '2m ago',
    unread: 2,
    online: true
  },
  {
    id: '2',
    name: 'PlushieCollector23',
    avatar: '',
    lastMessage: 'Thanks for the quick shipping!',
    timestamp: '1h ago',
    unread: 0,
    online: false
  },
  {
    id: '3',
    name: 'SanrioFan88',
    avatar: '',
    lastMessage: 'Hello! Are you interested in trading?',
    timestamp: '3h ago',
    unread: 1,
    online: true
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hi! I\'m interested in your Jellycat bunny listing',
    sender: 'them',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    text: 'Hello! Yes, it\'s still available. Would you like to see more photos?',
    sender: 'me',
    timestamp: '10:32 AM'
  },
  {
    id: '3',
    text: 'That would be great, thank you!',
    sender: 'them',
    timestamp: '10:33 AM'
  },
  {
    id: '4',
    text: 'Here are some additional photos of the bunny. It\'s in excellent condition!',
    sender: 'me',
    timestamp: '10:35 AM'
  }
];

export const MessengerInterface = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleNewConversation = () => {
    console.log('Starting new conversation');
  };

  const handleBackToList = () => {
    setSelectedConversation('');
  };

  const selectedConv = mockConversations.find(c => c.id === selectedConversation);

  if (isMobile) {
    // Mobile: Show either conversation list or chat
    if (selectedConversation && selectedConv) {
      return (
        <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
          {/* Mobile Chat Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToList}
              className="p-2 h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedConv.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {selectedConv.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedConv.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ChatMessages
              messages={mockMessages}
              conversation={selectedConv}
            />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 pb-safe">
            <MessageInput
              message={newMessage}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      );
    }

    // Mobile: Show conversation list
    return (
      <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
        <ConversationHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onNewConversation={handleNewConversation}
        />
        
        <div className="flex-1 overflow-hidden">
          <ConversationList
            conversations={mockConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <ConversationHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onNewConversation={handleNewConversation}
        />
        
        <ConversationList
          conversations={mockConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConv ? (
          <>
            <ChatHeader
              conversation={selectedConv}
              isMobile={false}
              onBackToList={handleBackToList}
            />

            <div className="flex-1 overflow-hidden">
              <ChatMessages
                messages={mockMessages}
                conversation={selectedConv}
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <MessageInput
                message={newMessage}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Your Messages
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                Send private messages to friends and other collectors
              </p>
              <Button 
                onClick={handleNewConversation}
                className="bg-softspot-500 hover:bg-softspot-600 text-white w-full"
              >
                Send Message
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

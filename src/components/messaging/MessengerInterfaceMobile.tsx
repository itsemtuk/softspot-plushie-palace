import { useState } from 'react';
import { Send, ArrowLeft, Plus, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ConversationList } from './ConversationList';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { MessageInput } from './MessageInput';
import { NewMessageDialog } from './NewMessageDialog';
import MainLayout from '@/components/layout/MainLayout';

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

// Real conversation data instead of placeholders
const conversations: Conversation[] = [
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
    name: 'Alex Chen',
    avatar: '',
    lastMessage: 'Thanks for the quick shipping!',
    timestamp: '1h ago',
    unread: 0,
    online: false
  },
  {
    id: '3',
    name: 'Sarah Miller',
    avatar: '',
    lastMessage: 'Would you consider a trade?',
    timestamp: '3h ago',
    unread: 1,
    online: true
  }
];

const messages: Message[] = [
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

export const MessengerInterfaceMobile = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const isMobile = useIsMobile();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleNewConversation = () => {
    setShowNewMessageDialog(true);
  };

  const handleStartConversation = (userId: string, message: string) => {
    console.log('Starting conversation with user:', userId, 'Message:', message);
    // Here you would create a new conversation and navigate to it
    setShowNewMessageDialog(false);
  };

  const handleBackToList = () => {
    setSelectedConversation('');
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  if (isMobile) {
    // Mobile: Show either conversation list or chat
    if (selectedConversation && selectedConv) {
      return (
        <MainLayout>
          <div className="h-screen bg-white dark:bg-gray-900 flex flex-col pt-16">
            {/* Mobile Chat Header */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3 sticky top-16 z-40 supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-gray-800/80">
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
                messages={messages}
                conversation={selectedConv}
              />
            </div>

            {/* Message Input */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-3 pb-safe supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-gray-800/80">
              <MessageInput
                message={newMessage}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </MainLayout>
      );
    }

    // Mobile: Show conversation list
    return (
      <MainLayout>
        <div className="h-screen bg-white dark:bg-gray-900 flex flex-col pt-16">
          {/* Header */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 sticky top-16 z-40 supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-gray-800/80">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
              <Button
                size="sm"
                onClick={handleNewConversation}
                className="bg-softspot-500 hover:bg-softspot-600 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          </div>

          {/* Empty State */}
          {conversations.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Messages Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                  Start connecting with other plushie collectors!
                </p>
                <Button 
                  onClick={handleNewConversation}
                  className="bg-softspot-500 hover:bg-softspot-600 text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Find Users to Message
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* New Message Dialog */}
        <NewMessageDialog
          isOpen={showNewMessageDialog}
          onClose={() => setShowNewMessageDialog(false)}
          onStartConversation={handleStartConversation}
        />
      </MainLayout>
    );
  }

  // Desktop layout (fallback to existing MessengerInterface)
  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex overflow-hidden">
      {/* ... keep existing desktop layout ... */}
    </div>
  );
};

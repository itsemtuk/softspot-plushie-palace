import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  isFollowing?: boolean;
  isFollower?: boolean;
}

interface NewMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (userId: string, message: string) => void;
}

// Mock users data - replace with real data from your API
const mockUsers: User[] = [
  {
    id: '1',
    username: 'emma_plushie_lover',
    name: 'Emma Johnson',
    avatar: '',
    isFollowing: true,
    isFollower: true
  },
  {
    id: '2',
    username: 'collector_pro',
    name: 'Alex Chen',
    avatar: '',
    isFollowing: false,
    isFollower: true
  },
  {
    id: '3',
    username: 'sanrio_fan',
    name: 'Sarah Miller',
    avatar: '',
    isFollowing: true,
    isFollower: false
  },
  {
    id: '4',
    username: 'jellycat_collector',
    name: 'Mike Wilson',
    avatar: '',
    isFollowing: false,
    isFollower: false
  }
];

export function NewMessageDialog({ isOpen, onClose, onStartConversation }: NewMessageDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate users by relationship
  const followers = filteredUsers.filter(user => user.isFollower);
  const following = filteredUsers.filter(user => user.isFollowing);
  const others = filteredUsers.filter(user => !user.isFollowing && !user.isFollower);

  const handleSendMessage = () => {
    if (selectedUser && message.trim()) {
      onStartConversation(selectedUser.id, message);
      setSelectedUser(null);
      setMessage('');
      setSearchQuery('');
      onClose();
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
    setMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {selectedUser ? `Message ${selectedUser.name}` : 'New Message'}
          </DialogTitle>
        </DialogHeader>

        {!selectedUser ? (
          <>
            {/* Search Users */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Users List */}
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {/* Following */}
                {following.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Following</h4>
                    <div className="space-y-2">
                      {following.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-softspot-500 text-white">
                              {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Followers */}
                {followers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Followers</h4>
                    <div className="space-y-2">
                      {followers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-softspot-500 text-white">
                              {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Users */}
                {others.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Other Users</h4>
                    <div className="space-y-2">
                      {others.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-softspot-500 text-white">
                              {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredUsers.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No users found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <>
            {/* Selected User Header */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedUser.avatar} />
                <AvatarFallback className="bg-softspot-500 text-white">
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedUser.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{selectedUser.username}
                </p>
              </div>
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="flex-1 bg-softspot-500 hover:bg-softspot-600 text-white"
              >
                Send Message
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

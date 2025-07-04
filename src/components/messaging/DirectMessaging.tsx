
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserStatusBadge } from "./UserStatusBadge";
import { MessageCircle, Users, Send, Image as ImageIcon, PlusCircle, ShoppingBag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
  imageUrl?: string;
  productUrl?: string;
  productTitle?: string;
  productPrice?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status?: 'online' | 'offline' | 'away' | 'busy';
  isGroup?: boolean;
  participants?: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

interface DirectMessagingProps {
  initialConversations?: Conversation[];
}

export const DirectMessaging = ({ initialConversations = [] }: DirectMessagingProps) => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Use initial conversations or mock data if none provided
  useEffect(() => {
    if (initialConversations.length === 0) {
      const mockConversations: Conversation[] = [
        {
          id: "1",
          name: "JellycatFan",
          avatar: "/assets/avatars/PLUSH_Cat.PNG",
          lastMessage: "Do you have any more photos?",
          timestamp: "10:30 AM",
          unread: 2,
          status: "online"
        },
        {
          id: "2",
          name: "SquishCollector",
          avatar: "/assets/avatars/PLUSH_Panda.PNG",
          lastMessage: "I'll consider your offer",
          timestamp: "Yesterday",
          unread: 0,
          status: "away"
        },
        {
          id: "3",
          name: "PlushieEnthusiasts",
          avatar: "/assets/avatars/PLUSH_Bear.PNG",
          lastMessage: "TeddyBearOwner: New listing alert!",
          timestamp: "2 days ago",
          unread: 5,
          isGroup: true,
          participants: [
            { id: "1", name: "JellycatFan", avatar: "/assets/avatars/PLUSH_Cat.PNG" },
            { id: "2", name: "SquishCollector", avatar: "/assets/avatars/PLUSH_Panda.PNG" },
            { id: "3", name: "TeddyBearOwner", avatar: "/assets/avatars/PLUSH_Bunny.PNG" }
          ]
        }
      ];
      setConversations(mockConversations);
    }
  }, [initialConversations]);

  // Mock messages for the active conversation
  useEffect(() => {
    if (activeConversation) {
      // In a real app, you would fetch messages based on the activeConversation.id
      const mockMessages: Message[] = [
        {
          id: "1",
          text: "Hello! I saw your listing for the Jellycat bunny.",
          sender: activeConversation.name,
          timestamp: "10:25 AM",
          isOwn: false
        },
        {
          id: "2",
          text: "Yes, it's still available! Are you interested?",
          sender: "You",
          timestamp: "10:26 AM",
          isOwn: true
        },
        {
          id: "3",
          text: "Could you share more photos?",
          sender: activeConversation.name,
          timestamp: "10:28 AM",
          isOwn: false
        },
        {
          id: "4",
          text: "Here's another angle",
          sender: "You",
          timestamp: "10:29 AM",
          isOwn: true,
          imageUrl: "https://via.placeholder.com/300x200"
        },
        {
          id: "5",
          text: "Do you have any more photos?",
          sender: activeConversation.name,
          timestamp: "10:30 AM",
          isOwn: false
        }
      ];

      // If it's a group, add some group messages
      if (activeConversation.isGroup) {
        mockMessages.push({
          id: "6",
          text: "I just listed this new item!",
          sender: "TeddyBearOwner",
          timestamp: "10:32 AM",
          isOwn: false,
          productUrl: "/marketplace/123",
          productTitle: "Limited Edition Squishmallow",
          productPrice: "$35.99"
        });
        
        mockMessages.push({
          id: "7",
          text: "That looks amazing! I might be interested.",
          sender: "JellycatFan",
          timestamp: "10:33 AM",
          isOwn: false
        });
      }

      setMessages(mockMessages);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Also update the conversation's last message
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === activeConversation.id
          ? { ...conv, lastMessage: newMessage, timestamp: "Just now", unread: 0 }
          : conv
      )
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    const participants = conversations
      .filter(conv => selectedUsers.includes(conv.id))
      .map(conv => ({
        id: conv.id,
        name: conv.name,
        avatar: conv.avatar
      }));

    const newGroup: Conversation = {
      id: `group-${Date.now()}`,
      name: groupName,
      avatar: "/assets/avatars/PLUSH_Bear.PNG", // Default group avatar
      lastMessage: "Group created",
      timestamp: "Just now",
      unread: 0,
      isGroup: true,
      participants: participants
    };

    setConversations([newGroup, ...conversations]);
    setShowCreateGroup(false);
    setGroupName("");
    setSelectedUsers([]);
  };

  return (
    <Card className="h-[calc(100vh-200px)] min-h-[500px] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        {/* Left panel - Conversations */}
        <div className="border-r border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <Tabs defaultValue="direct">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="direct" className="flex items-center justify-center">
                  <MessageCircle className="mr-2 h-4 w-4" /> Direct
                </TabsTrigger>
                <TabsTrigger value="groups" className="flex items-center justify-center">
                  <Users className="mr-2 h-4 w-4" /> Groups
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="direct">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Messages</h3>
                </div>
                <Input placeholder="Search messages..." className="mb-2" />
              </TabsContent>
              
              <TabsContent value="groups">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Group Chats</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowCreateGroup(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" /> New
                  </Button>
                </div>
                <Input placeholder="Search group chats..." className="mb-2" />
              </TabsContent>
            </Tabs>
          </div>

          {showCreateGroup ? (
            <div className="p-4">
              <h3 className="text-sm font-medium mb-2">Create New Group</h3>
              <Input 
                placeholder="Group name" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="mb-3"
              />
              <h4 className="text-xs font-medium mb-1">Select Members</h4>
              <ScrollArea className="h-[300px] pr-3">
                {conversations.filter(c => !c.isGroup).map(conv => (
                  <div 
                    key={conv.id}
                    className={`
                      flex items-center justify-between p-2 mb-1 rounded-md
                      ${selectedUsers.includes(conv.id) ? 'bg-softspot-50' : ''}
                    `}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={conv.avatar} />
                        <AvatarFallback>{conv.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="ml-2 text-sm">{conv.name}</span>
                    </div>
                    <Button
                      variant={selectedUsers.includes(conv.id) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedUsers.includes(conv.id)) {
                          setSelectedUsers(selectedUsers.filter(id => id !== conv.id));
                        } else {
                          setSelectedUsers([...selectedUsers, conv.id]);
                        }
                      }}
                    >
                      {selectedUsers.includes(conv.id) ? "Selected" : "Add"}
                    </Button>
                  </div>
                ))}
              </ScrollArea>
              
              <div className="flex justify-end mt-3 space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowCreateGroup(false);
                    setGroupName("");
                    setSelectedUsers([]);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim() || selectedUsers.length === 0}
                >
                  Create Group
                </Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-2">
                {conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`
                      flex items-center p-3 rounded-md cursor-pointer mb-1 relative
                      ${activeConversation?.id === conversation.id ? 'bg-softspot-50' : 'hover:bg-gray-50'}
                    `}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                      </Avatar>
                      {!conversation.isGroup && conversation.status && (
                        <div className="absolute -bottom-1 -right-1">
                          <UserStatusBadge status={conversation.status} />
                        </div>
                      )}
                      {conversation.isGroup && (
                        <div className="absolute -bottom-1 -right-1 bg-softspot-100 rounded-full p-0.5">
                          <Users className="h-3 w-3 text-softspot-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium truncate">{conversation.name}</p>
                        <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="absolute right-3 top-3">
                        <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {conversation.unread}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Right panel - Messages */}
        <div className="col-span-2 flex flex-col h-full">
          {activeConversation ? (
            <>
              {/* Conversation header */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeConversation.avatar} />
                    <AvatarFallback>{activeConversation.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium">{activeConversation.name}</p>
                    {activeConversation.isGroup ? (
                      <div className="flex -space-x-1 mt-1">
                        {activeConversation.participants?.slice(0, 3).map(participant => (
                          <Avatar key={participant.id} className="h-5 w-5 border border-white">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>{participant.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                        {(activeConversation.participants?.length || 0) > 3 && (
                          <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-white">
                            +{(activeConversation.participants?.length || 0) - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">
                        {activeConversation.status === 'online' ? 'Online' : 
                         activeConversation.status === 'away' ? 'Away' : 
                         activeConversation.status === 'busy' ? 'Busy' : 'Offline'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-grow p-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.isOwn ? 'order-2' : ''}`}>
                        {!message.isOwn && activeConversation.isGroup && (
                          <p className="text-xs text-gray-500 ml-2 mb-1">{message.sender}</p>
                        )}
                        
                        <div
                          className={`
                            rounded-lg px-4 py-2 relative
                            ${message.isOwn
                              ? 'bg-softspot-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                            }
                          `}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        
                        {message.imageUrl && (
                          <div className="mt-2 rounded-lg overflow-hidden">
                            <img 
                              src={message.imageUrl} 
                              alt="Shared image" 
                              className="max-h-[200px] w-auto"
                            />
                          </div>
                        )}
                        
                        {message.productUrl && (
                          <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden flex">
                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="p-2 flex-1">
                              <p className="text-xs font-medium">{message.productTitle}</p>
                              <p className="text-xs text-softspot-500">{message.productPrice}</p>
                              <p className="text-xs text-blue-500 underline">View listing</p>
                            </div>
                          </div>
                        )}
                        
                        <p className={`text-xs text-gray-500 mt-1 ${message.isOwn ? 'text-right' : ''}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" type="button">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" type="button">
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder={`Message ${activeConversation.isGroup ? 'group' : activeConversation.name}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    className={newMessage.trim() ? "bg-softspot-500 hover:bg-softspot-600" : ""}
                    disabled={!newMessage.trim()}
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-2 text-lg font-medium">No conversation selected</h3>
                <p className="text-sm text-gray-500 mt-1">Choose a conversation from the list to start messaging.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

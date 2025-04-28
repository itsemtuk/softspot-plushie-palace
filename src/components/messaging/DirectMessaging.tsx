
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserStatusBadge } from "@/components/messaging/UserStatusBadge";
import { Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  status: "online" | "offline" | "away" | "busy";
  lastMessage?: {
    text: string;
    timestamp: Date;
    unread: boolean;
  };
}

export const DirectMessaging = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample mock data
  const contacts: Contact[] = [
    {
      id: "1",
      name: "Jane Cooper",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      status: "online",
      lastMessage: {
        text: "Hey! Do you have that plushie still available?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        unread: true,
      },
    },
    {
      id: "2",
      name: "Wade Warren",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      status: "busy",
      lastMessage: {
        text: "I'll send payment today",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        unread: false,
      },
    },
    {
      id: "3",
      name: "Esther Howard",
      avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      status: "away",
      lastMessage: {
        text: "Thanks for the trade!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unread: false,
      },
    },
    {
      id: "4",
      name: "Cameron Williamson",
      avatarUrl: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
      status: "offline",
      lastMessage: {
        text: "Is the pink bunny still available?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        unread: false,
      },
    },
  ];
  
  const messages: Record<string, Message[]> = {
    "1": [
      {
        id: "m1",
        text: "Hi there! I saw your listing for the limited edition bear.",
        sender: "1",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        read: true,
      },
      {
        id: "m2",
        text: "Yes, it's still available! Are you interested?",
        sender: "current-user",
        timestamp: new Date(Date.now() - 1000 * 60 * 8),
        read: true,
      },
      {
        id: "m3",
        text: "Definitely! How much are you asking for it?",
        sender: "1",
        timestamp: new Date(Date.now() - 1000 * 60 * 6),
        read: true,
      },
      {
        id: "m4",
        text: "Hey! Do you have that plushie still available?",
        sender: "1",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
      },
    ],
    "2": [
      {
        id: "m5",
        text: "I'm interested in trading my limited edition fox for your unicorn",
        sender: "2",
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        read: true,
      },
      {
        id: "m6",
        text: "That sounds interesting! Can you send me some photos?",
        sender: "current-user",
        timestamp: new Date(Date.now() - 1000 * 60 * 100),
        read: true,
      },
      {
        id: "m7",
        text: "I'll send payment today",
        sender: "2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true,
      },
    ],
  };
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedContact) return;
    
    console.log("Sending message to", selectedContact, ":", messageText);
    // In a real app, we'd add this to the messages array and send to an API
    
    setMessageText("");
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="w-full h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm border overflow-hidden">
      <Tabs defaultValue="direct" className="h-full flex flex-col">
        <div className="border-b px-4">
          <TabsList className="h-16">
            <TabsTrigger value="direct" className="data-[state=active]:bg-transparent">Direct Messages</TabsTrigger>
            <TabsTrigger value="groups" className="data-[state=active]:bg-transparent">Groups</TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-transparent">Requests</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="direct" className="flex-1 flex overflow-hidden m-0 p-0">
          {/* Contact List */}
          <div className="w-1/3 border-r h-full flex flex-col">
            <div className="p-3 border-b">
              <Input 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <ScrollArea className="flex-1">
              {filteredContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className={`p-3 flex items-center hover:bg-slate-100 cursor-pointer ${selectedContact === contact.id ? 'bg-slate-100' : ''}`}
                  onClick={() => setSelectedContact(contact.id)}
                >
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img 
                        src={contact.avatarUrl} 
                        alt={contact.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <UserStatusBadge status={contact.status} className="absolute bottom-0 right-0" />
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{contact.name}</h3>
                      {contact.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(contact.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    {contact.lastMessage && (
                      <p className={`text-sm truncate ${contact.lastMessage.unread ? 'font-semibold' : 'text-gray-500'}`}>
                        {contact.lastMessage.text}
                      </p>
                    )}
                  </div>
                  
                  {contact.lastMessage?.unread && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full ml-2"></div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
          
          {/* Message Area */}
          <div className="flex-1 flex flex-col h-full">
            {selectedContact ? (
              <>
                {/* Header */}
                <div className="p-4 border-b flex items-center">
                  {contacts.find(c => c.id === selectedContact) && (
                    <>
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img 
                            src={contacts.find(c => c.id === selectedContact)?.avatarUrl} 
                            alt={contacts.find(c => c.id === selectedContact)?.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <UserStatusBadge 
                          status={contacts.find(c => c.id === selectedContact)?.status || "offline"} 
                          className="absolute bottom-0 right-0"
                          size="sm"
                        />
                      </div>
                      <div className="ml-3">
                        <h2 className="font-semibold">
                          {contacts.find(c => c.id === selectedContact)?.name}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {contacts.find(c => c.id === selectedContact)?.status === "online" ? "Active now" : "Last seen recently"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages[selectedContact]?.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'current-user' 
                              ? 'bg-softspot-500 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p>{message.text}</p>
                          <div className={`text-xs mt-1 ${
                            message.sender === 'current-user' ? 'text-softspot-200' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type a message..." 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-softspot-500 hover:bg-softspot-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <h3 className="font-medium text-lg mb-2">No conversation selected</h3>
                  <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="groups" className="flex-1 m-0 p-0">
          <div className="h-full flex items-center justify-center">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Group Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Group messaging functionality coming soon!</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="requests" className="flex-1 m-0 p-0">
          <div className="h-full flex items-center justify-center">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Message Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">You have no pending message requests.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

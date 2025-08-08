'use client';

import { useState } from 'react';
import { MessageCircle, Building, MapPin, Star, Send, MoreHorizontal, Sparkles, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

// Dummy data for conversations
const dummyConversations = [
  {
    id: 1,
    employerName: 'TechCorp Indonesia',
    position: 'Senior Frontend Developer',
    location: 'Jakarta, Indonesia',
    isOnline: true,
    lastMessage: 'Hi! We loved your profile and would love to discuss the opportunity.',
    lastMessageTime: '2 min ago',
    unreadCount: 2,
    logo: 'https://placehold.co/60x60/6366f1/ffffff?text=TC',
    messages: [
      { id: 1, sender: 'employer', text: 'Hi! We loved your profile and would love to discuss the opportunity.', time: '2 min ago' },
      { id: 2, sender: 'employer', text: 'Are you available for a call tomorrow?', time: '1 min ago' }
    ]
  },
  {
    id: 2,
    employerName: 'StartupXYZ',
    position: 'Product Manager',
    location: 'Bandung, Indonesia',
    isOnline: false,
    lastMessage: 'Your experience looks perfect for our team!',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    logo: 'https://placehold.co/60x60/ec4899/ffffff?text=SX',
    messages: [
      { id: 1, sender: 'employer', text: 'Your experience looks perfect for our team!', time: '1 hour ago' },
      { id: 2, sender: 'talent', text: 'Thank you! I would love to learn more about the role.', time: '45 min ago' }
    ]
  },
  {
    id: 3,
    employerName: 'Global Solutions',
    position: 'DevOps Engineer',
    location: 'Surabaya, Indonesia',
    isOnline: true,
    lastMessage: 'When would you be available for an interview?',
    lastMessageTime: '3 hours ago',
    unreadCount: 1,
    logo: 'https://placehold.co/60x60/10b981/ffffff?text=GS',
    messages: [
      { id: 1, sender: 'employer', text: 'When would you be available for an interview?', time: '3 hours ago' }
    ]
  }
];

export default function TalentMessagesPage() {
  const [conversations, setConversations] = useState(dummyConversations);
  const [selectedConversation, setSelectedConversation] = useState<typeof dummyConversations[0] | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Chats', count: conversations.length },
    { id: 'unread', label: 'Unread', count: conversations.filter(conv => conv.unreadCount > 0).length },
    { id: 'online', label: 'Online', count: conversations.filter(conv => conv.isOnline).length }
  ];

  const filteredConversations = activeFilter === 'all' 
    ? conversations 
    : activeFilter === 'unread'
    ? conversations.filter(conv => conv.unreadCount > 0)
    : conversations.filter(conv => conv.isOnline);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      sender: 'talent' as const,
      text: newMessage,
      time: 'Just now'
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, messages: [...conv.messages, message], lastMessage: newMessage, lastMessageTime: 'Just now', unreadCount: 0 }
        : conv
    ));

    setSelectedConversation(prev => prev ? { ...prev, messages: [...prev.messages, message], lastMessage: newMessage, lastMessageTime: 'Just now', unreadCount: 0 } : null);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Messages</h1>
              <p className="text-white/80 text-sm">Chat with your matches</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Users className="w-3 h-3 mr-1" />
              {conversations.length} chats
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 pb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/20 text-white/80 hover:bg-white/30'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-[calc(100vh-280px)]">
        {/* Conversations List */}
        <div className="w-full md:w-1/3 px-6 pb-24">
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Card 
                key={conversation.id} 
                className={`bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer transition-all hover:bg-white/20 ${
                  selectedConversation?.id === conversation.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                        <img 
                          src={conversation.logo} 
                          alt={conversation.employerName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-white truncate">{conversation.employerName}</h3>
                        <span className="text-xs text-white/60">{conversation.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-white/80 truncate mb-1">{conversation.position}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-white/70 truncate flex-1 mr-2">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="secondary" className="bg-red-500 text-white border-0 text-xs min-w-[20px] h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col px-6 pb-24">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
                        <img 
                          src={selectedConversation.logo} 
                          alt={selectedConversation.employerName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {selectedConversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{selectedConversation.employerName}</h3>
                      <div className="flex items-center space-x-2 text-white/80 text-sm">
                        <Building className="w-3 h-3" />
                        <span>{selectedConversation.position}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span>{selectedConversation.location}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-white/80 hover:text-white">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 overflow-y-auto">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'talent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender === 'talent'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-white/20 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'talent' ? 'text-white/80' : 'text-white/60'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Select a conversation</h3>
                <p className="text-white/80">Choose a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
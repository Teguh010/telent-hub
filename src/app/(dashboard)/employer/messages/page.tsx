'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, MapPin, Star, Send, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  talentId: string;
  talentName: string;
  talentImage?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  cultureScore: number;
  country: string;
  messages: Message[];
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // TODO: Implement fetching conversations from Firestore
        // For now, using dummy data
        const dummyConversations: Conversation[] = [
          {
            id: '1',
            talentId: 'talent1',
            talentName: 'Sarah Johnson',
            lastMessage: 'Hi! I\'m interested in the frontend position.',
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            unreadCount: 2,
            isOnline: true,
            cultureScore: 92,
            country: 'UK',
            messages: [
              {
                id: '1',
                senderId: 'talent1',
                text: 'Hi! I\'m interested in the frontend position.',
                timestamp: new Date(Date.now() - 1000 * 60 * 5),
                isRead: false
              },
              {
                id: '2',
                senderId: 'employer',
                text: 'Great! Can you tell me more about your experience?',
                timestamp: new Date(Date.now() - 1000 * 60 * 3),
                isRead: true
              },
              {
                id: '3',
                senderId: 'talent1',
                text: 'I have 5+ years experience with React and TypeScript.',
                timestamp: new Date(Date.now() - 1000 * 60 * 1),
                isRead: false
              }
            ]
          },
          {
            id: '2',
            talentId: 'talent2',
            talentName: 'Alex Chen',
            lastMessage: 'When can we schedule an interview?',
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            unreadCount: 0,
            isOnline: false,
            cultureScore: 88,
            country: 'Singapore',
            messages: [
              {
                id: '1',
                senderId: 'employer',
                text: 'Hi Alex! Thanks for your interest.',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
                isRead: true
              },
              {
                id: '2',
                senderId: 'talent2',
                text: 'When can we schedule an interview?',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
                isRead: true
              }
            ]
          }
        ];
        
        setConversations(dummyConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // TODO: Implement sending message to Firestore
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <p className="text-white/80 text-sm">{conversations.length} conversations</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
            <p className="text-white/80">Start matching to begin conversations!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <Card 
                key={conversation.id} 
                className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors cursor-pointer ${
                  selectedConversation?.id === conversation.id ? 'bg-white/20 border-purple-400' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* Avatar with online indicator */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                        {conversation.talentImage ? (
                          <img 
                            src={conversation.talentImage} 
                            alt={conversation.talentName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold">
                            {conversation.talentName.charAt(0)}
                          </div>
                        )}
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-semibold truncate">{conversation.talentName}</h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {conversation.cultureScore}%
                          </div>
                          <span className="text-white/60 text-xs">{formatTime(conversation.lastMessageTime)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-white/80 text-sm truncate flex-1 mr-2">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="secondary" className="bg-red-500 text-white border-0 text-xs min-w-5 h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center text-white/60 text-xs mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{conversation.country}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Chat Modal (simplified) */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full h-3/4 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 rounded-t-3xl">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {selectedConversation.talentName.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{selectedConversation.talentName}</h3>
                  <p className="text-white/60 text-xs">{selectedConversation.isOnline ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedConversation(null)}
                className="text-white/60 hover:text-white"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'employer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.senderId === 'employer'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/20 text-white backdrop-blur-sm'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-full px-4 py-2 border border-white/30 focus:outline-none focus:border-purple-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
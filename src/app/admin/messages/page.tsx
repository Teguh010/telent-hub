'use client';

import { useState } from 'react';
import { MessageCircle, Search, Filter, Eye, Users, Building, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

// Dummy data for messages
const dummyMessages = [
  {
    id: 1,
    talent: {
      name: 'John Doe',
      email: 'john.doe@email.com'
    },
    employer: {
      name: 'TechCorp Solutions',
      email: 'hr@techcorp.com'
    },
    lastMessage: 'Hi John, we loved your profile! Would you be interested in discussing a Senior React Developer position?',
    lastMessageTime: '2 hours ago',
    messageCount: 12,
    status: 'active',
    unreadCount: 2,
    conversationStart: '2024-01-20'
  },
  {
    id: 2,
    talent: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com'
    },
    employer: {
      name: 'StartupXYZ',
      email: 'contact@startupxyz.com'
    },
    lastMessage: 'Sarah, your Python skills are exactly what we need. Can we schedule a call this week?',
    lastMessageTime: '1 day ago',
    messageCount: 8,
    status: 'active',
    unreadCount: 0,
    conversationStart: '2024-01-18'
  },
  {
    id: 3,
    talent: {
      name: 'Mike Chen',
      email: 'mike.chen@email.com'
    },
    employer: {
      name: 'FinTech Innovations',
      email: 'careers@fintech.com'
    },
    lastMessage: 'Thanks for your interest, but we\'ve decided to move forward with other candidates.',
    lastMessageTime: '1 week ago',
    messageCount: 3,
    status: 'inactive',
    unreadCount: 0,
    conversationStart: '2024-01-15'
  }
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(dummyMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.employer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Messages</h1>
          <p className="text-gray-600 mt-2">View and manage all conversations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <MessageCircle className="w-3 h-3 mr-1" />
            {messages.length} conversations
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="rounded-md border border-gradient-to-r from-orange-500/20 to-red-500/20 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {message.talent.name} ↔ {message.employer.name}
                    </h3>
                    <p className="text-sm text-gray-600">{message.talent.email} • {message.employer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {message.unreadCount > 0 && (
                    <Badge variant="default" className="bg-red-500 text-white">
                      {message.unreadCount} new
                    </Badge>
                  )}
                  <Badge 
                    variant="secondary"
                    className={getStatusColor(message.status)}
                  >
                    {message.status}
                  </Badge>
                </div>
              </div>

              {/* Message Preview */}
              <div className="mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {message.lastMessage}
                  </p>
                </div>
              </div>

              {/* Conversation Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Started: {message.conversationStart}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{message.messageCount} messages</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{message.lastMessageTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Participants */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Talent:</span> {message.talent.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Employer:</span> {message.employer.name}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
} 
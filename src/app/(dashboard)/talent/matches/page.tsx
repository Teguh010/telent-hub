'use client';

import { useState } from 'react';
import { Heart, Building, MapPin, Star, MessageCircle, Sparkles, Users, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

// Dummy data for matches
const dummyMatches = [
  {
    id: 1,
    employerName: 'TechCorp Indonesia',
    position: 'Senior Frontend Developer',
    location: 'Jakarta, Indonesia',
    industry: 'Technology',
    companySize: '50-100 employees',
    cultureScore: 85,
    matchDate: '2 days ago',
    isOnline: true,
    lastMessage: 'Hi! We loved your profile and would love to discuss the opportunity.',
    unreadCount: 2,
    logo: 'https://via.placeholder.com/60x60/6366f1/ffffff?text=TC',
    mutualLikes: true
  },
  {
    id: 2,
    employerName: 'StartupXYZ',
    position: 'Product Manager',
    location: 'Bandung, Indonesia',
    industry: 'E-commerce',
    companySize: '10-50 employees',
    cultureScore: 92,
    matchDate: '1 day ago',
    isOnline: false,
    lastMessage: 'Your experience looks perfect for our team!',
    unreadCount: 0,
    logo: 'https://via.placeholder.com/60x60/ec4899/ffffff?text=SX',
    mutualLikes: true
  },
  {
    id: 3,
    employerName: 'Global Solutions',
    position: 'DevOps Engineer',
    location: 'Surabaya, Indonesia',
    industry: 'Fintech',
    companySize: '100-500 employees',
    cultureScore: 78,
    matchDate: '3 days ago',
    isOnline: true,
    lastMessage: 'When would you be available for an interview?',
    unreadCount: 1,
    logo: 'https://via.placeholder.com/60x60/10b981/ffffff?text=GS',
    mutualLikes: true
  },
  {
    id: 4,
    employerName: 'Innovation Labs',
    position: 'UI/UX Designer',
    location: 'Yogyakarta, Indonesia',
    industry: 'Design',
    companySize: '20-50 employees',
    cultureScore: 88,
    matchDate: '5 days ago',
    isOnline: false,
    lastMessage: 'Your portfolio is amazing!',
    unreadCount: 0,
    logo: 'https://via.placeholder.com/60x60/f59e0b/ffffff?text=IL',
    mutualLikes: true
  }
];

export default function TalentMatchesPage() {
  const [matches, setMatches] = useState(dummyMatches);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Matches', count: matches.length },
    { id: 'online', label: 'Online Now', count: matches.filter(match => match.isOnline).length },
    { id: 'unread', label: 'Unread', count: matches.filter(match => match.unreadCount > 0).length }
  ];

  const filteredMatches = activeFilter === 'all' 
    ? matches 
    : activeFilter === 'online'
    ? matches.filter(match => match.isOnline)
    : matches.filter(match => match.unreadCount > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Matches</h1>
              <p className="text-white/80 text-sm">Companies that liked you back</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Users className="w-3 h-3 mr-1" />
              {matches.length} matches
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{matches.length}</div>
            <div className="text-white/60 text-sm">Total Matches</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{matches.filter(m => m.isOnline).length}</div>
            <div className="text-white/60 text-sm">Online Now</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{matches.reduce((sum, m) => sum + m.unreadCount, 0)}</div>
            <div className="text-white/60 text-sm">Unread Messages</div>
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

      {/* Content */}
      <div className="px-6 pb-24 space-y-4">
        {filteredMatches.map((match) => (
          <Card key={match.id} className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              {/* Match Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                      <img 
                        src={match.logo} 
                        alt={match.employerName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {match.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{match.employerName}</h3>
                      {match.mutualLikes && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Mutual
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      <Building className="w-4 h-4" />
                      <span>{match.position}</span>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{match.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {match.cultureScore}%
                  </div>
                </div>
              </div>

              {/* Match Details */}
              <div className="mb-4">
                <div className="flex items-center space-x-4 text-sm text-white/80 mb-3">
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                    {match.industry}
                  </span>
                  <span className="text-white/60">{match.companySize}</span>
                  <span className="text-white/60">Matched {match.matchDate}</span>
                </div>
              </div>

              {/* Last Message */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Last Message</span>
                  {match.unreadCount > 0 && (
                    <Badge variant="secondary" className="bg-red-500 text-white border-0 text-xs">
                      {match.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-white/80 text-sm line-clamp-2">
                  {match.lastMessage}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Message</span>
                </button>
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-all">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">View Profile</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {filteredMatches.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No matches yet</h3>
            <p className="text-white/80">Start swiping to find your perfect match!</p>
          </div>
        )}
      </div>
    </div>
  );
} 
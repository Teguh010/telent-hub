'use client';

import { useState } from 'react';
import { Heart, Search, Filter, Eye, MessageCircle, Users, Building, Calendar, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

// Dummy data for matches
const dummyMatches = [
  {
    id: 1,
    talent: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      skills: ['React', 'TypeScript', 'Node.js'],
      cultureScore: 85
    },
    employer: {
      name: 'TechCorp Solutions',
      email: 'hr@techcorp.com',
      industry: 'Technology',
      companySize: '50-200'
    },
    matchDate: '2024-01-20',
    status: 'active',
    messagesCount: 12,
    lastMessage: '2 hours ago',
    mutualInterest: 92
  },
  {
    id: 2,
    talent: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      skills: ['Python', 'Django', 'AWS'],
      cultureScore: 92
    },
    employer: {
      name: 'StartupXYZ',
      email: 'contact@startupxyz.com',
      industry: 'E-commerce',
      companySize: '10-50'
    },
    matchDate: '2024-01-18',
    status: 'active',
    messagesCount: 8,
    lastMessage: '1 day ago',
    mutualInterest: 88
  },
  {
    id: 3,
    talent: {
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      cultureScore: 78
    },
    employer: {
      name: 'FinTech Innovations',
      email: 'careers@fintech.com',
      industry: 'Fintech',
      companySize: '200-500'
    },
    matchDate: '2024-01-15',
    status: 'inactive',
    messagesCount: 3,
    lastMessage: '1 week ago',
    mutualInterest: 75
  }
];

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState(dummyMatches);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.employer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || match.status === statusFilter;
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Matches</h1>
          <p className="text-gray-600 mt-2">View and manage all talent-employer matches</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Heart className="w-3 h-3 mr-1" />
            {matches.length} matches
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search matches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <Card key={match.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {match.talent.name} ↔ {match.employer.name}
                    </h3>
                    <p className="text-sm text-gray-600">{match.talent.email} • {match.employer.email}</p>
                  </div>
                </div>
                <Badge 
                  variant="secondary"
                  className={getStatusColor(match.status)}
                >
                  {match.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Talent Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="font-medium text-gray-900">Talent</span>
                  </div>
                  <div className="pl-6 space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Skills:</span> {match.talent.skills.join(', ')}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">
                        Culture Score: {match.talent.cultureScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Employer Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-900">Employer</span>
                  </div>
                  <div className="pl-6 space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Industry:</span> {match.employer.industry}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Size:</span> {match.employer.companySize} employees
                    </p>
                  </div>
                </div>
              </div>

              {/* Match Details */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Matched: {match.matchDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{match.messagesCount} messages</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>{match.mutualInterest}% match</span>
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
                <p className="text-xs text-gray-500 mt-2">
                  Last message: {match.lastMessage}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMatches.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
} 
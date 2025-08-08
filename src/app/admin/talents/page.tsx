'use client';

import { useState } from 'react';
import { Users, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

// Dummy data for talents
const dummyTalents = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@email.com',
    country: 'Indonesia',
    skills: ['React', 'TypeScript', 'Node.js'],
    languages: ['English', 'Indonesian'],
    cultureScore: 85,
    status: 'active',
    joinedDate: '2024-01-15',
    lastActive: '2 hours ago',
    matches: 12,
    messages: 8
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    country: 'Singapore',
    skills: ['Python', 'Django', 'AWS'],
    languages: ['English', 'Mandarin'],
    cultureScore: 92,
    status: 'active',
    joinedDate: '2024-01-20',
    lastActive: '1 day ago',
    matches: 8,
    messages: 15
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    country: 'Malaysia',
    skills: ['Java', 'Spring Boot', 'MySQL'],
    languages: ['English', 'Malay'],
    cultureScore: 78,
    status: 'inactive',
    joinedDate: '2024-01-10',
    lastActive: '1 week ago',
    matches: 5,
    messages: 3
  }
];

export default function AdminTalentsPage() {
  const [talents, setTalents] = useState(dummyTalents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || talent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (talentId: number) => {
    setTalents(prev => prev.filter(talent => talent.id !== talentId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Talents</h1>
          <p className="text-gray-600 mt-2">View and manage all talent profiles</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Users className="w-3 h-3 mr-1" />
            {talents.length} talents
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search talents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Talents List */}
      <div className="space-y-4">
        {filteredTalents.map((talent) => (
          <Card key={talent.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {talent.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{talent.name}</h3>
                    <p className="text-gray-600">{talent.email}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{talent.country}</span>
                      <Badge 
                        variant={talent.status === 'active' ? 'default' : 'secondary'}
                        className={talent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {talent.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{talent.matches} matches</span>
                      <span>{talent.messages} messages</span>
                    </div>
                    <p className="text-xs text-gray-500">Last active: {talent.lastActive}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(talent.id)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Skills and Languages */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {talent.languages.map((language, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTalents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No talents found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { Building, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Mail, Users, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

// Dummy data for employers
const dummyEmployers = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    email: 'hr@techcorp.com',
    industry: 'Technology',
    companySize: '50-200',
    country: 'Indonesia',
    status: 'active',
    joinedDate: '2024-01-10',
    lastActive: '1 hour ago',
    totalTalents: 45,
    matches: 23,
    messages: 67
  },
  {
    id: 2,
    name: 'StartupXYZ',
    email: 'contact@startupxyz.com',
    industry: 'E-commerce',
    companySize: '10-50',
    country: 'Singapore',
    status: 'active',
    joinedDate: '2024-01-15',
    lastActive: '3 hours ago',
    totalTalents: 28,
    matches: 15,
    messages: 42
  },
  {
    id: 3,
    name: 'FinTech Innovations',
    email: 'careers@fintech.com',
    industry: 'Fintech',
    companySize: '200-500',
    country: 'Malaysia',
    status: 'inactive',
    joinedDate: '2024-01-05',
    lastActive: '1 week ago',
    totalTalents: 12,
    matches: 8,
    messages: 19
  }
];

export default function AdminEmployersPage() {
  const [employers, setEmployers] = useState(dummyEmployers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || employer.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || employer.industry === industryFilter;
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const handleDelete = (employerId: number) => {
    setEmployers(prev => prev.filter(employer => employer.id !== employerId));
  };

  const industries = ['Technology', 'E-commerce', 'Fintech', 'Healthcare', 'Education'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Employers</h1>
          <p className="text-gray-600 mt-2">View and manage all employer profiles</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Building className="w-3 h-3 mr-1" />
            {employers.length} employers
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Industries</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      {/* Employers List */}
      <div className="space-y-4">
        {filteredEmployers.map((employer) => (
          <Card key={employer.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {employer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{employer.name}</h3>
                    <p className="text-gray-600">{employer.email}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{employer.country}</span>
                      <Badge 
                        variant={employer.status === 'active' ? 'default' : 'secondary'}
                        className={employer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {employer.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{employer.totalTalents} talents</span>
                      <span>{employer.matches} matches</span>
                      <span>{employer.messages} messages</span>
                    </div>
                    <p className="text-xs text-gray-500">Last active: {employer.lastActive}</p>
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
                      onClick={() => handleDelete(employer.id)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {employer.industry}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                    {employer.companySize} employees
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span>Joined: {employer.joinedDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployers.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No employers found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
} 
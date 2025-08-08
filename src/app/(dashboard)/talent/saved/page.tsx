'use client';

import { useState } from 'react';
import { Bookmark, Building, MapPin, Star, Heart, Share2, MessageCircle, Sparkles, Trash2, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

// Dummy data for saved items
const dummySavedItems = [
  {
    id: 1,
    type: 'job',
    companyName: 'TechCorp Indonesia',
    position: 'Senior Frontend Developer',
    location: 'Jakarta, Indonesia',
    salary: '$3,000 - $5,000',
    jobType: 'Full-time',
    savedDate: '2 days ago',
    description: 'We are looking for a passionate Frontend Developer to join our growing team. Experience with React, TypeScript, and modern web technologies required.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    companySize: '50-100 employees',
    industry: 'Technology',
    cultureScore: 85,
    logo: 'https://via.placeholder.com/60x60/6366f1/ffffff?text=TC'
  },
  {
    id: 2,
    type: 'company',
    companyName: 'StartupXYZ',
    position: null,
    location: 'Bandung, Indonesia',
    salary: null,
    jobType: null,
    savedDate: '1 day ago',
    description: 'Fast-growing startup focused on e-commerce solutions. We have a collaborative culture and offer great opportunities for growth.',
    skills: null,
    companySize: '10-50 employees',
    industry: 'E-commerce',
    cultureScore: 92,
    logo: 'https://via.placeholder.com/60x60/ec4899/ffffff?text=SX'
  },
  {
    id: 3,
    type: 'job',
    companyName: 'Global Solutions',
    position: 'DevOps Engineer',
    location: 'Surabaya, Indonesia',
    salary: '$4,000 - $6,000',
    jobType: 'Full-time',
    savedDate: '3 days ago',
    description: 'We need a DevOps Engineer to help us scale our infrastructure and improve our deployment processes.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    companySize: '100-500 employees',
    industry: 'Fintech',
    cultureScore: 78,
    logo: 'https://via.placeholder.com/60x60/10b981/ffffff?text=GS'
  },
  {
    id: 4,
    type: 'company',
    companyName: 'Innovation Labs',
    position: null,
    location: 'Yogyakarta, Indonesia',
    salary: null,
    jobType: null,
    savedDate: '5 days ago',
    description: 'Creative design agency specializing in UI/UX and digital products. We foster innovation and creativity.',
    skills: null,
    companySize: '20-50 employees',
    industry: 'Design',
    cultureScore: 88,
    logo: 'https://via.placeholder.com/60x60/f59e0b/ffffff?text=IL'
  }
];

export default function TalentSavedPage() {
  const [savedItems, setSavedItems] = useState(dummySavedItems);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleRemove = (itemId: number) => {
    setSavedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const filters = [
    { id: 'all', label: 'All Saved', count: savedItems.length },
    { id: 'jobs', label: 'Jobs', count: savedItems.filter(item => item.type === 'job').length },
    { id: 'companies', label: 'Companies', count: savedItems.filter(item => item.type === 'company').length }
  ];

  const filteredItems = activeFilter === 'all' 
    ? savedItems 
    : savedItems.filter(item => item.type === activeFilter.slice(0, -1)); // Remove 's' from 'jobs'/'companies'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Saved</h1>
              <p className="text-white/80 text-sm">Your saved jobs and companies</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              {savedItems.length} items
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{savedItems.length}</div>
            <div className="text-white/60 text-sm">Total Saved</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{savedItems.filter(item => item.type === 'job').length}</div>
            <div className="text-white/60 text-sm">Jobs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{savedItems.filter(item => item.type === 'company').length}</div>
            <div className="text-white/60 text-sm">Companies</div>
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
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              {/* Item Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                    <img 
                      src={item.logo} 
                      alt={item.companyName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-bold text-white">
                        {item.type === 'job' ? item.position : item.companyName}
                      </h3>
                      <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30 text-xs">
                        {item.type === 'job' ? 'Job' : 'Company'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      <Building className="w-4 h-4" />
                      <span>{item.companyName}</span>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {item.cultureScore}%
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="mb-4">
                {item.type === 'job' && (
                  <div className="flex items-center space-x-4 text-sm text-white/80 mb-3">
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                      {item.salary}
                    </span>
                                         <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                       {item.jobType}
                     </span>
                  </div>
                )}
                
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  {item.description}
                </p>

                {item.skills && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Company Info */}
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>{item.companySize} • {item.industry}</span>
                  <span>Saved {item.savedDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-all">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Message</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-all">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-all">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">View Details</span>
                  </button>
                  
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Remove</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No saved items</h3>
            <p className="text-white/80">Start saving jobs and companies you're interested in!</p>
          </div>
        )}
      </div>
    </div>
  );
} 
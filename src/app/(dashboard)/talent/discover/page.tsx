'use client';

import { useState } from 'react';
import { Briefcase, Building, MapPin, Star, Heart, Bookmark, Share2, MessageCircle, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

// Dummy data for jobs/companies
const dummyJobs = [
  {
    id: 1,
    companyName: 'TechCorp Indonesia',
    position: 'Senior Frontend Developer',
    location: 'Jakarta, Indonesia',
    salary: '$3,000 - $5,000',
    type: 'Full-time',
    postedDate: '2 days ago',
    description: 'We are looking for a passionate Frontend Developer to join our growing team. Experience with React, TypeScript, and modern web technologies required.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    companySize: '50-100 employees',
    industry: 'Technology',
    cultureScore: 85,
    isLiked: false,
    isSaved: false,
    logo: 'https://placehold.co/60x60/6366f1/ffffff?text=TC'
  },
  {
    id: 2,
    companyName: 'StartupXYZ',
    position: 'Product Manager',
    location: 'Bandung, Indonesia',
    salary: '$2,500 - $4,000',
    type: 'Full-time',
    postedDate: '1 day ago',
    description: 'Join our fast-growing startup as a Product Manager. You will be responsible for product strategy, roadmap, and execution.',
    skills: ['Product Management', 'Agile', 'User Research', 'Analytics'],
    companySize: '10-50 employees',
    industry: 'E-commerce',
    cultureScore: 92,
    isLiked: false,
    isSaved: false,
    logo: 'https://placehold.co/60x60/ec4899/ffffff?text=SX'
  },
  {
    id: 3,
    companyName: 'Global Solutions',
    position: 'DevOps Engineer',
    location: 'Surabaya, Indonesia',
    salary: '$4,000 - $6,000',
    type: 'Full-time',
    postedDate: '3 days ago',
    description: 'We need a DevOps Engineer to help us scale our infrastructure and improve our deployment processes.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    companySize: '100-500 employees',
    industry: 'Fintech',
    cultureScore: 78,
    isLiked: false,
    isSaved: false,
    logo: 'https://placehold.co/60x60/10b981/ffffff?text=GS'
  }
];

export default function TalentDiscoverPage() {
  const [jobs, setJobs] = useState(dummyJobs);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleLike = (jobId: number) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isLiked: !job.isLiked } : job
    ));
  };

  const handleSave = (jobId: number) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
    ));
  };

  const filters = [
    { id: 'all', label: 'All Jobs', count: jobs.length },
    { id: 'technology', label: 'Technology', count: jobs.filter(job => job.industry === 'Technology').length },
    { id: 'ecommerce', label: 'E-commerce', count: jobs.filter(job => job.industry === 'E-commerce').length },
    { id: 'fintech', label: 'Fintech', count: jobs.filter(job => job.industry === 'Fintech').length }
  ];

  const filteredJobs = activeFilter === 'all' 
    ? jobs 
    : jobs.filter(job => job.industry.toLowerCase() === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Discover Jobs</h1>
              <p className="text-white/80 text-sm">Find your next opportunity</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              {jobs.length} jobs
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

      {/* Content */}
      <div className="px-6 pb-24 space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              {/* Job Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                    <img 
                      src={job.logo} 
                      alt={job.companyName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1">{job.position}</h3>
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      <Building className="w-4 h-4" />
                      <span>{job.companyName}</span>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {job.cultureScore}%
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="mb-4">
                <div className="flex items-center space-x-4 text-sm text-white/80 mb-3">
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                    {job.salary}
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                    {job.type}
                  </span>
                  <span className="text-white/60">{job.postedDate}</span>
                </div>
                
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  {job.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Company Info */}
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>{job.companySize} • {job.industry}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(job.id)}
                    className={`flex items-center space-x-2 transition-all ${
                      job.isLiked ? 'text-red-500' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${job.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">Like</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-all">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">Message</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-all">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
                
                <button
                  onClick={() => handleSave(job.id)}
                  className={`flex items-center space-x-2 transition-all ${
                    job.isSaved ? 'text-yellow-400' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${job.isSaved ? 'fill-current' : ''}`} />
                  <span className="text-sm">{job.isSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
            <p className="text-white/80">Try adjusting your filters or check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
} 
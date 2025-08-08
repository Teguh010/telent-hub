'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bookmark, Heart, MapPin, Star, Briefcase, Languages } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

interface SavedTalent {
  id: string;
  name: string;
  country: string;
  bio: string;
  cultureStyle: string;
  cultureScore: number;
  skills: string[];
  languages: string[];
  profileImageUrl?: string;
  savedAt: Date;
}

export default function SavedPage() {
  const [savedTalents, setSavedTalents] = useState<SavedTalent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSavedTalents = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // TODO: Implement fetching saved talents from Firestore
        // For now, using dummy data
        const dummySavedTalents: SavedTalent[] = [
          {
            id: '1',
            name: 'Jane Doe',
            country: 'USA',
            bio: 'Experienced frontend developer with a passion for building scalable web apps.',
            cultureStyle: 'Collaborative',
            cultureScore: 85,
            skills: ['React', 'TypeScript', 'Node.js'],
            languages: ['English', 'Spanish'],
            savedAt: new Date()
          },
          {
            id: '2',
            name: 'John Smith',
            country: 'Canada',
            bio: 'Backend engineer focused on cloud-native solutions and automation.',
            cultureStyle: 'Innovative',
            cultureScore: 72,
            skills: ['Python', 'Django', 'Docker'],
            languages: ['English', 'French'],
            savedAt: new Date()
          }
        ];
        
        setSavedTalents(dummySavedTalents);
      } catch (error) {
        console.error('Error fetching saved talents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTalents();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading saved talents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Saved Talents</h1>
            <p className="text-white/80 text-sm">{savedTalents.length} talents saved</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24">
        {savedTalents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No saved talents yet</h3>
            <p className="text-white/80">Start discovering and save talents you like!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedTalents.map((talent) => (
              <Card key={talent.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full border-2 border-white/30 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                      {talent.profileImageUrl ? (
                        <img 
                          src={talent.profileImageUrl} 
                          alt={talent.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                          {talent.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white truncate">{talent.name}</h3>
                        <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {talent.cultureScore}%
                        </div>
                      </div>

                      <div className="flex items-center text-white/80 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{talent.country}</span>
                      </div>

                      <p className="text-white/90 text-sm mb-3 line-clamp-2">{talent.bio}</p>

                      {/* Skills */}
                      <div className="mb-3">
                        <div className="flex items-center mb-1">
                          <Briefcase className="w-3 h-3 mr-1 text-white/80" />
                          <span className="text-xs font-medium text-white">Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {talent.skills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {talent.skills.length > 2 && (
                            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                              +{talent.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex items-center">
                        <Languages className="w-3 h-3 mr-1 text-white/80" />
                        <span className="text-xs font-medium text-white mr-2">Languages:</span>
                        <div className="flex flex-wrap gap-1">
                          {talent.languages.map((language, index) => (
                            <Badge key={index} variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30 text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <button className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Bookmark className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
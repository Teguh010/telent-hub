'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageCircle, MapPin, Star, Briefcase, Languages, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

interface Match {
  id: string;
  name: string;
  country: string;
  bio: string;
  cultureStyle: string;
  cultureScore: number;
  skills: string[];
  languages: string[];
  profileImageUrl?: string;
  matchedAt: Date;
  isOnline?: boolean;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // TODO: Implement fetching matches from Firestore
        // For now, using dummy data
        const dummyMatches: Match[] = [
          {
            id: '1',
            name: 'Sarah Johnson',
            country: 'UK',
            bio: 'Full-stack developer with 5+ years experience in React and Node.js.',
            cultureStyle: 'Collaborative',
            cultureScore: 92,
            skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
            languages: ['English', 'French'],
            matchedAt: new Date(),
            isOnline: true
          },
          {
            id: '2',
            name: 'Alex Chen',
            country: 'Singapore',
            bio: 'Product manager with expertise in agile methodologies and user experience.',
            cultureStyle: 'Innovative',
            cultureScore: 88,
            skills: ['Product Management', 'Agile', 'UX Design', 'Analytics'],
            languages: ['English', 'Mandarin'],
            matchedAt: new Date(),
            isOnline: false
          }
        ];
        
        setMatches(dummyMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Matches</h1>
            <p className="text-white/80 text-sm">{matches.length} mutual connections</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No matches yet</h3>
            <p className="text-white/80">Keep swiping to find your perfect match!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Avatar with online indicator */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-white/30 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                        {match.profileImageUrl ? (
                          <img 
                            src={match.profileImageUrl} 
                            alt={match.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                            {match.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      {match.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-white truncate">{match.name}</h3>
                          {match.isOnline && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              Online
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {match.cultureScore}%
                        </div>
                      </div>

                      <div className="flex items-center text-white/80 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{match.country}</span>
                      </div>

                      <p className="text-white/90 text-sm mb-3 line-clamp-2">{match.bio}</p>

                      {/* Skills */}
                      <div className="mb-3">
                        <div className="flex items-center mb-1">
                          <Briefcase className="w-3 h-3 mr-1 text-white/80" />
                          <span className="text-xs font-medium text-white">Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {match.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {match.skills.length > 3 && (
                            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                              +{match.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex items-center">
                        <Languages className="w-3 h-3 mr-1 text-white/80" />
                        <span className="text-xs font-medium text-white mr-2">Languages:</span>
                        <div className="flex flex-wrap gap-1">
                          {match.languages.map((language, index) => (
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
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Sparkles className="w-5 h-5" />
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
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, MapPin, Building, Mail, Phone, Settings, LogOut, Edit, Star, TrendingUp, Heart, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

interface EmployerProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  position: string;
  location: string;
  phone?: string;
  bio?: string;
  joinedAt: Date;
  stats: {
    totalSwipes: number;
    totalLikes: number;
    totalMatches: number;
    totalSaved: number;
  };
}

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // TODO: Implement fetching employer profile from Firestore
        // For now, using dummy data
        const dummyProfile: EmployerProfile = {
          id: user.uid,
          name: 'John Employer',
          email: user.email || '',
          company: 'TechCorp Inc.',
          position: 'Senior HR Manager',
          location: 'San Francisco, CA',
          phone: '+1 (555) 123-4567',
          bio: 'Passionate about finding the best talent for our growing tech company. Specialized in engineering and product roles.',
          joinedAt: new Date('2024-01-15'),
          stats: {
            totalSwipes: 247,
            totalLikes: 89,
            totalMatches: 23,
            totalSaved: 12
          }
        };
        
        setProfile(dummyProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-lg">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Profile</h1>
              <p className="text-white/80 text-sm">Manage your account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24 space-y-6">
        {/* Profile Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                  {profile.name.charAt(0)}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                  <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-white/80">
                    <Building className="w-4 h-4 mr-2" />
                    <span>{profile.position} at {profile.company}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center text-white/80">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-white/90 text-sm mt-3 leading-relaxed">{profile.bio}</p>
                )}

                <div className="flex items-center text-white/60 text-xs mt-3">
                  <span>Member since {profile.joinedAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{profile.stats.totalSwipes}</div>
              <div className="text-white/80 text-sm">Total Swipes</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{profile.stats.totalLikes}</div>
              <div className="text-white/80 text-sm">Likes Given</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{profile.stats.totalMatches}</div>
              <div className="text-white/80 text-sm">Matches</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{profile.stats.totalSaved}</div>
              <div className="text-white/80 text-sm">Saved</div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5" />
                  <span>Account Settings</span>
                </div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5" />
                  <span>Preferences</span>
                </div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5" />
                  <span>Privacy</span>
                </div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>Notifications</span>
                </div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
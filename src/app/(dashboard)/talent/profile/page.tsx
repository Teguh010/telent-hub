'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Languages, Star, Edit, User, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

type TalentProfile = {
  name: string;
  email: string;
  country: string;
  skills: string[];
  languages: string[];
  bio: string;
  videoPitch?: string;
  cultureStyle?: string;
  cultureScore?: number;
  profileImageUrl?: string;
};

export default function TalentProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching profile for user:', user.uid);
        
        const docRef = doc(db, 'talents', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log('Profile found:', docSnap.data());
          const data = docSnap.data();
          setProfile({
            name: data.name || 'New Talent',
            email: data.email || '',
            country: data.country || 'Unknown',
            skills: data.skills || [],
            languages: data.languages || [],
            bio: data.bio || 'No bio available yet.',
            videoPitch: data.videoPitch || '',
            cultureStyle: data.cultureStyle || '',
            cultureScore: data.cultureScore || 0,
            profileImageUrl: data.profileImageUrl || ''
          });
        } else {
          console.log('No profile found, redirecting to edit');
          // Redirect to edit profile if no profile exists
          router.push('/talent/edit');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Show error to user
        alert('Gagal memuat profil. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

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
        <div className="text-center p-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No profile found</h2>
          <p className="text-white/80 mb-6">Please complete your profile to get started.</p>
          <Link
            href="/talent/edit"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Edit className="w-4 h-4 mr-2" />
            Complete Profile
          </Link>
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
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <p className="text-white/80 text-sm">Your personal information and skills</p>
            </div>
          </div>
          <Link
            href="/talent/edit"
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all border border-white/30"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
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
                {profile.profileImageUrl ? (
                  <img 
                    src={profile.profileImageUrl} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                    {profile.name ? profile.name.charAt(0) : 'T'}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white mb-2">{profile.name}</h2>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-white/80">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{profile.country}</span>
                  </div>
                  {profile.cultureScore && (
                    <div className="flex items-center text-white/80">
                      <Star className="w-4 h-4 mr-2" />
                      <span>Culture Score: {profile.cultureScore}%</span>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-white/90 text-sm mt-3 leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Briefcase className="w-5 h-5 mr-2 text-white/80" />
              <h3 className="text-lg font-semibold text-white">Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-white/20 text-white border-white/30">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-white/60 text-sm">No skills added yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Languages className="w-5 h-5 mr-2 text-white/80" />
              <h3 className="text-lg font-semibold text-white">Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.languages && profile.languages.length > 0 ? (
                profile.languages.map((language, index) => (
                  <Badge key={index} variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30">
                    {language}
                  </Badge>
                ))
              ) : (
                <p className="text-white/60 text-sm">No languages added yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Culture Style */}
        {profile.cultureStyle && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Sparkles className="w-5 h-5 mr-2 text-white/80" />
                <h3 className="text-lg font-semibold text-white">Culture Style</h3>
              </div>
              <p className="text-white/90">{profile.cultureStyle}</p>
            </CardContent>
          </Card>
        )}

        {/* Video Pitch */}
        {profile.videoPitch && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Video Pitch</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={profile.videoPitch}
                  className="w-full h-full object-cover"
                  controls
                  poster={profile.profileImageUrl}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

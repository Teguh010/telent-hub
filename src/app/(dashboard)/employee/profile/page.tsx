'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Briefcase, Building, MapPin, Mail, Phone, Globe, Edit, User, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';

type EmployeeProfile = {
  companyName: string;
  companyWebsite?: string;
  position: string;
  industry: string;
  location: string;
  email: string;
  phone?: string;
  about?: string;
  companySize?: string;
  foundedYear?: number;
  profileImageUrl?: string;
};

export default function EmployeeProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
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
        console.log('Fetching employee profile for user:', user.uid);
        
        const docRef = doc(db, 'employers', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log('Employee profile found:', docSnap.data());
          setProfile(docSnap.data() as EmployeeProfile);
        } else {
          console.log('No employee profile found, redirecting to edit');
          router.push('/dashboard/employee/edit');
        }
      } catch (error) {
        console.error('Error fetching employee profile:', error);
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
            <Building className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No profile found</h2>
          <p className="text-white/80 mb-6">Please complete your employer profile to get started.</p>
          <Link
            href="/dashboard/employee/edit"
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
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.companyName}</h1>
              <p className="text-white/80 text-sm">{profile.position}</p>
            </div>
          </div>
          <Link
            href="/dashboard/employee/edit"
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all border border-white/30"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24 space-y-6">
        {/* Company Info Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {/* Company Logo/Avatar */}
              <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                {profile.profileImageUrl ? (
                  <img 
                    src={profile.profileImageUrl} 
                    alt={profile.companyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                    {profile.companyName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white mb-2">{profile.companyName}</h2>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-white/80">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{profile.position}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{profile.location}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center text-white/80">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                {profile.about && (
                  <p className="text-white/90 text-sm mt-3 leading-relaxed">{profile.about}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Details */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Building className="w-5 h-5 mr-2 text-white/80" />
              <h3 className="text-lg font-semibold text-white">Company Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-sm">Industry</p>
                <p className="text-white font-medium">{profile.industry}</p>
              </div>
              {profile.companySize && (
                <div>
                  <p className="text-white/60 text-sm">Company Size</p>
                  <p className="text-white font-medium">{profile.companySize}</p>
                </div>
              )}
              {profile.foundedYear && (
                <div>
                  <p className="text-white/60 text-sm">Founded</p>
                  <p className="text-white font-medium">{profile.foundedYear}</p>
                </div>
              )}
              {profile.companyWebsite && (
                <div>
                  <p className="text-white/60 text-sm">Website</p>
                  <a 
                    href={profile.companyWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-white font-medium"
                  >
                    {profile.companyWebsite}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Industry Badge */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Sparkles className="w-5 h-5 mr-2 text-white/80" />
              <h3 className="text-lg font-semibold text-white">Industry</h3>
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30 text-lg px-4 py-2">
              {profile.industry}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

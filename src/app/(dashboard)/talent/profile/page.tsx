'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Languages, Star, Edit } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type TalentProfile = {
  name: string;
  country: string;
  skills: string[];
  languages: string[];
  bio: string;
  videoPitch?: string;
  cultureStyle?: string;
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
          setProfile(docSnap.data() as TalentProfile);
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No profile found</h2>
        <p className="text-gray-600 mb-6">Please complete your profile to get started.</p>
        <Link
          href="/dashboard/talent/edit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Complete Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">My Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your personal information and skills</p>
        </div>
        <Link
          href="/dashboard/talent/edit"
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Link>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {profile.name || 'Not provided'}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> Location
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {profile.country || 'Not specified'}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-start">
              <Briefcase className="h-4 w-4 mr-1 mt-0.5" /> Skills
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                'No skills added'
              )}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-start">
              <Languages className="h-4 w-4 mr-1 mt-0.5" /> Languages
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {profile.languages && profile.languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((language, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              ) : (
                'No languages specified'
              )}
            </dd>
          </div>
          {profile.cultureStyle && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Star className="h-4 w-4 mr-1" /> Culture Style
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile.cultureStyle}
              </dd>
            </div>
          )}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">About</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {profile.bio || 'No bio provided'}
            </dd>
          </div>
          {profile.videoPitch && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Video Pitch</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                  <video
                    src={profile.videoPitch}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

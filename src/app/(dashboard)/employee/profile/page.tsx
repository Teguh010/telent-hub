'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Briefcase, Building, MapPin, Mail, Phone, Globe, Edit } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
          router.push('/employee/edit');
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No profile found. Please create your employer profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.companyName}</h1>
              <p className="mt-1 text-sm text-gray-500">{profile.position}</p>
            </div>
            <Link 
              href="/employee/edit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Building className="h-5 w-5 text-gray-400 mr-2" />
                  Company
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.companyName}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                  Position
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.position}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.location}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
              </div>
              
              {profile.phone && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.phone}</dd>
                </div>
              )}
              
              {profile.companyWebsite && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-2" />
                    Website
                  </dt>
                  <dd className="mt-1 text-sm">
                    <a 
                      href={profile.companyWebsite.startsWith('http') ? profile.companyWebsite : `https://${profile.companyWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {profile.companyWebsite}
                    </a>
                  </dd>
                </div>
              )}
              
              {profile.companySize && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Company Size
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.companySize}</dd>
                </div>
              )}
              
              {profile.foundedYear && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Founded
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.foundedYear}</dd>
                </div>
              )}
              
              {profile.about && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    About {profile.companyName}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                    {profile.about}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

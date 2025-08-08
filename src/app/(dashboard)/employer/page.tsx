'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Button from '@/components/buttons/Button';

export default function EmployerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Employer Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Discover Talents</h2>
            <p className="text-gray-600 mb-4">
              Browse through talented candidates and find the perfect match for your company.
            </p>
            <Link href="/dashboard/employer/discover">
              <Button className="w-full">Start Browsing</Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Saved Candidates</h2>
            <p className="text-gray-600 mb-4">
              View candidates you've shown interest in or saved for later.
            </p>
            <Link href="/dashboard/employer/saved">
              <Button variant="outline" className="w-full">View Saved</Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Your Company Profile</h2>
            <p className="text-gray-600 mb-4">
              Manage your company information and job postings.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard/employer/profile">
                <Button variant="outline">View Profile</Button>
              </Link>
              <Link href="/dashboard/employer/jobs">
                <Button variant="outline">Manage Jobs</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

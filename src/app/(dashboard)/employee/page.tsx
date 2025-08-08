'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the employee's profile page with correct route group
    router.replace('/employee/profile');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">Loading employee dashboard...</p>
      </div>
    </div>
  );
}

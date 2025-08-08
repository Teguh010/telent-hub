'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the employee's profile page
    router.replace('/employee/profile');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}

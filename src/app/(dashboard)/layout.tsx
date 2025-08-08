'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { SidebarNav } from '@/components/dashboard/SidebarNav';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  
  // Determine user role from pathname
  const userRole = pathname.startsWith('/employer') ? 'employer' : 'talent';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <SidebarNav userRole={userRole} />

      {/* Page Content */}
      <div className="md:pl-64 md:pb-0">
        <main>{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNav userRole={userRole} />
      </div>
    </div>
  );
} 
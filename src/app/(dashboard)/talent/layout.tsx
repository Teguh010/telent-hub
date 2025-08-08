import { ReactNode } from 'react';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function TalentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav userType="talent" />
      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

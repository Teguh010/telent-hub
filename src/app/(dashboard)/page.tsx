'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const checkUserRole = async () => {
      if (!user) return;
      
      try {
        // Cek apakah pengguna adalah talent
        const talentDoc = await getDoc(doc(db, 'talents', user.uid));
        if (talentDoc.exists()) {
          router.push('/talent/profile');
          return;
        }
        
        // Cek apakah pengguna adalah employer
        const employerDoc = await getDoc(doc(db, 'employers', user.uid));
        if (employerDoc.exists()) {
          router.push('/employer/discover');
          return;
        }
        
        // Jika tidak keduanya, arahkan ke halaman pemilihan peran
        router.push('/select-role');
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    if (user) {
      checkUserRole();
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}

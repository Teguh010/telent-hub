'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { debugUserProfile, addDebugUser } from '@/lib/debugUtils';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    console.log('🔍 RouteGuard Debug:', {
      user: user?.uid,
      userProfile: userProfile?.role,
      pathname,
      loading
    });

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/admin/login', '/admin/setup', '/debug'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is not authenticated and trying to access protected route
    if (!user && !isPublicRoute) {
      console.log('❌ No user, redirecting to login');
      router.push('/login');
      return;
    }

    // If user is authenticated
    if (user && userProfile) {
      console.log('✅ User authenticated with profile:', userProfile.role);
      
      // Handle admin routes
      if (pathname.startsWith('/admin')) {
        if (userProfile.role !== 'admin') {
          console.log('❌ Non-admin trying to access admin routes');
          router.push('/dashboard');
          return;
        }
      }

      // Handle dashboard routes
      if (pathname.startsWith('/dashboard')) {
        if (userProfile.role === 'admin') {
          console.log('🔄 Admin accessing dashboard, redirecting to admin panel');
          router.push('/admin/dashboard');
          return;
        }
      }

      // If user is on login/register page but already authenticated
      if (isPublicRoute) {
        console.log('🔄 Authenticated user on public route, redirecting to dashboard');
        // Redirect to appropriate dashboard based on role
        if (userProfile.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (userProfile.role === 'talent') {
          router.push('/talent/discover');
        } else if (userProfile.role === 'employer') {
          router.push('/employer/discover');
        }
        return;
      }

      // Handle root path redirects
      if (pathname === '/') {
        console.log('🔄 Root path redirect based on role:', userProfile.role);
        if (userProfile.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (userProfile.role === 'talent') {
          router.push('/talent/discover');
        } else if (userProfile.role === 'employer') {
          router.push('/employer/discover');
        }
        return;
      }
    }

    // If user is authenticated but no profile (new user)
    if (user && !userProfile && !isPublicRoute) {
      console.log('⚠️ User authenticated but no profile, redirecting to role selection');
      
      // Debug: Check if user profile exists in Firestore
      debugUserProfile(user.uid).then((result) => {
        if (result) {
          console.log('🔍 Found user profile in Firestore:', result);
          // Force refresh auth context
          window.location.reload();
        } else {
          console.log('❌ No user profile found, redirecting to role selection');
          router.push('/select-role');
        }
      });
      return;
    }

    // If user is authenticated but no profile and on public route
    if (user && !userProfile && isPublicRoute) {
      console.log('⚠️ User authenticated but no profile on public route');
      // Don't redirect, let them stay on login/register page
    }
  }, [user, userProfile, loading, pathname, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 
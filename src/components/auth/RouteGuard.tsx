'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/admin/login', '/admin/setup'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is not authenticated and trying to access protected route
    if (!user && !isPublicRoute) {
      router.push('/login');
      return;
    }

    // If user is authenticated
    if (user && userProfile) {
      // Handle admin routes
      if (pathname.startsWith('/admin')) {
        if (userProfile.role !== 'admin') {
          // Redirect non-admin users away from admin routes
          router.push('/dashboard');
          return;
        }
      }

      // Handle dashboard routes
      if (pathname.startsWith('/dashboard')) {
        if (userProfile.role === 'admin') {
          // Admin should be in admin panel
          router.push('/admin/dashboard');
          return;
        }
      }

      // If user is on login/register page but already authenticated
      if (isPublicRoute) {
        // Redirect to appropriate dashboard based on role
        if (userProfile.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (userProfile.role === 'talent') {
          router.push('/dashboard/talent/discover');
        } else if (userProfile.role === 'employer') {
          router.push('/dashboard/employer/discover');
        }
        return;
      }

      // Handle root path redirects
      if (pathname === '/') {
        if (userProfile.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (userProfile.role === 'talent') {
          router.push('/dashboard/talent/discover');
        } else if (userProfile.role === 'employer') {
          router.push('/dashboard/employer/discover');
        }
        return;
      }
    }

    // If user is authenticated but no profile (new user)
    if (user && !userProfile && !isPublicRoute) {
      // Redirect to role selection or onboarding
      router.push('/select-role');
      return;
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
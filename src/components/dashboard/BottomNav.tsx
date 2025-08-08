'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Heart, 
  MessageCircle, 
  User, 
  Briefcase, 
  Settings, 
  Users,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  userRole: 'employer' | 'talent';
}

export function BottomNav({ userRole }: BottomNavProps) {
  const pathname = usePathname();

  const employerNavItems = [
    {
      href: '/dashboard/employer/discover',
      icon: Home,
      label: 'Discover',
      active: pathname === '/dashboard/employer/discover'
    },
    {
      href: '/dashboard/employer/saved',
      icon: Bookmark,
      label: 'Saved',
      active: pathname === '/dashboard/employer/saved'
    },
    {
      href: '/dashboard/employer/matches',
      icon: Heart,
      label: 'Matches',
      active: pathname === '/dashboard/employer/matches'
    },
    {
      href: '/dashboard/employer/messages',
      icon: MessageCircle,
      label: 'Messages',
      active: pathname === '/dashboard/employer/messages'
    },
    {
      href: '/dashboard/employer/profile',
      icon: User,
      label: 'Profile',
      active: pathname === '/dashboard/employer/profile'
    }
  ];

  const talentNavItems = [
    {
      href: '/dashboard/talent',
      icon: Home,
      label: 'Home',
      active: pathname === '/dashboard/talent'
    },
    {
      href: '/dashboard/talent/matches',
      icon: Heart,
      label: 'Matches',
      active: pathname === '/dashboard/talent/matches'
    },
    {
      href: '/dashboard/talent/messages',
      icon: MessageCircle,
      label: 'Messages',
      active: pathname === '/dashboard/talent/messages'
    },
    {
      href: '/dashboard/talent/profile',
      icon: User,
      label: 'Profile',
      active: pathname === '/dashboard/talent/profile'
    },
    {
      href: '/dashboard/talent/settings',
      icon: Settings,
      label: 'Settings',
      active: pathname === '/dashboard/talent/settings'
    }
  ];

  const navItems = userRole === 'employer' ? employerNavItems : talentNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0 flex-1",
                item.active
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50"
              )}
            >
              <div className={cn(
                "relative p-2 rounded-full transition-all duration-200",
                item.active && "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
              )}>
                <Icon className="w-5 h-5" />
                {item.active && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium mt-1 transition-all duration-200",
                item.active ? "text-purple-600" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
    </div>
  );
} 
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Heart,
  MessageCircle,
  User,
  Settings,
  Bookmark,
  LogOut,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarNavProps {
  userRole: 'employer' | 'talent';
}

export function SidebarNav({ userRole }: SidebarNavProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const employerNavItems = [
    { href: '/dashboard/employer/discover', icon: Home, label: 'Discover' },
    { href: '/dashboard/employer/saved', icon: Bookmark, label: 'Saved' },
    { href: '/dashboard/employer/matches', icon: Heart, label: 'Matches' },
    { href: '/dashboard/employer/messages', icon: MessageCircle, label: 'Messages' },
    { href: '/dashboard/employer/profile', icon: User, label: 'Profile' },
  ];

  const talentNavItems = [
    { href: '/dashboard/talent', icon: Home, label: 'Home' },
    { href: '/dashboard/talent/matches', icon: Heart, label: 'Matches' },
    { href: '/dashboard/talent/messages', icon: MessageCircle, label: 'Messages' },
    { href: '/dashboard/talent/profile', icon: User, label: 'Profile' },
    { href: '/dashboard/talent/settings', icon: Settings, label: 'Settings' },
  ];

  const navItems = userRole === 'employer' ? employerNavItems : talentNavItems;

  return (
    <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 z-40">
      <div className="flex flex-col w-64 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/60 shadow-sm">
        {/* Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200/60">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Talent Hub</div>
              <div className="text-xs text-gray-500 capitalize">{userRole}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                      active
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-gray-200/60">
          <button
            onClick={async () => {
              try { await logout(); } catch {}
            }}
            className="w-full flex items-center gap-2 justify-center px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
} 
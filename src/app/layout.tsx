'use client';
import * as React from 'react';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import { AuthProvider } from '@/contexts/AuthContext';
import RouteGuard from '@/components/auth/RouteGuard';
import { ToastProvider } from '@/components/ui/Toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ToastProvider>
          <AuthProvider>
            <RouteGuard>
            {children}
            </RouteGuard>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

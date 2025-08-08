import { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="w-full md:w-[475px] max-w-full md:rounded-3xl md:overflow-hidden md:shadow-2xl">
        {children}
      </div>
    </div>
  );
} 
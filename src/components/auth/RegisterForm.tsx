'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, UserCheck, UserPlus, ArrowRight, Sparkles } from 'lucide-react';

type UserType = 'talent' | 'employer';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('talent');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await register(email, password, userType);
      // RouteGuard will handle the redirect based on user role
    } catch (error) {
      setError('Failed to create an account');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
      </div>
      <h2 className="text-center text-2xl md:text-3xl font-extrabold text-white">Create account</h2>
      <p className="mt-2 text-center text-sm text-white/70">
        Join the Talent Hub community
      </p>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-500/20 border border-red-500/40 text-red-100 px-4 py-3 rounded-lg" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {/* Role Selection */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setUserType('talent')}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all border ${
              userType === 'talent'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
                : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Talent
          </button>
          <button
            type="button"
            onClick={() => setUserType('employer')}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all border ${
              userType === 'employer'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
                : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Employer
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400">
              <Mail className="w-5 h-5 text-white/70 mr-2" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="flex-1 bg-transparent placeholder-white/50 text-white focus:outline-none py-1"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400">
              <Lock className="w-5 h-5 text-white/70 mr-2" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="flex-1 bg-transparent placeholder-white/50 text-white focus:outline-none py-1"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400">
              <Lock className="w-5 h-5 text-white/70 mr-2" />
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="flex-1 bg-transparent placeholder-white/50 text-white focus:outline-none py-1"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all focus:ring-2 focus:ring-purple-400"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>

        <p className="mt-4 text-center text-sm text-white/70">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-medium hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

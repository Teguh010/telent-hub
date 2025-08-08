'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      // RouteGuard will handle the redirect based on user role
    } catch (error) {
      setError('Failed to sign in');
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
      <h2 className="text-center text-2xl md:text-3xl font-extrabold text-white">Welcome back</h2>
      <p className="mt-2 text-center text-sm text-white/70">
        Sign in to your account
      </p>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-500/20 border border-red-500/40 text-red-100 px-4 py-3 rounded-lg" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Form */}
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
                autoComplete="current-password"
                required
                className="flex-1 bg-transparent placeholder-white/50 text-white focus:outline-none py-1"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-white/80">
            <input type="checkbox" className="form-checkbox mr-2 bg-white/10 border-white/30" />
            Remember me
          </label>
          <div className="flex gap-2">
            <a href="#" className="text-purple-200 hover:text-white">Forgot password?</a>
            <span className="text-white/50">|</span>
            <Link href="/debug" className="text-purple-200 hover:text-white">
              Debug
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="w-full group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all focus:ring-2 focus:ring-purple-400"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>

        <p className="mt-4 text-center text-sm text-white/70">
          Don't have an account?{' '}
          <Link href="/register" className="text-white font-medium hover:underline">Create one</Link>
        </p>
      </form>
    </div>
  );
}

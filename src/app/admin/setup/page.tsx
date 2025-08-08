'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, UserPlus, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { setupAdminUser, checkAdminStatus } from '@/lib/adminUtils';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminSetupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // First, sign in with the provided credentials
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is already admin
      const isAlreadyAdmin = await checkAdminStatus(user.uid);
      
      if (isAlreadyAdmin) {
        setMessage('This user is already an admin!');
        setMessageType('error');
        return;
      }

      // Setup admin user in Firestore
      const success = await setupAdminUser(user.uid, email, name);
      
      if (success) {
        setMessage('Admin user created successfully! You can now login at /admin/login');
        setMessageType('success');
        
        // Sign out after setup
        await auth.signOut();
      } else {
        setMessage('Failed to create admin user. Please try again.');
        setMessageType('error');
      }
    } catch (error: any) {
      console.error('Setup admin error:', error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setMessage('Invalid email or password. Please use existing user credentials.');
      } else if (error.code === 'auth/too-many-requests') {
        setMessage('Too many failed attempts. Please try again later.');
      } else {
        setMessage('Setup failed. Please try again.');
      }
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Setup Admin User</h1>
          <p className="text-white/80">Create the first admin user for your platform</p>
        </div>

        {/* Setup Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          {message && (
            <div className={`mb-6 border rounded-lg p-4 ${
              messageType === 'success' 
                ? 'bg-green-500/20 border-green-500/40 text-green-100' 
                : 'bg-red-500/20 border-red-500/40 text-red-100'
            }`}>
              <div className="flex items-center space-x-2">
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSetupAdmin} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Admin Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="Admin Name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email (must be existing user)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="existing@user.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Setting up...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Setup Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <h3 className="text-white font-medium mb-2">Instructions:</h3>
            <ol className="text-white/80 text-sm space-y-1">
              <li>1. Use existing user credentials from Firebase Auth</li>
              <li>2. Enter the user's email and password</li>
              <li>3. Provide an admin name</li>
              <li>4. Click "Setup Admin" to grant admin privileges</li>
              <li>5. Login at /admin/login after setup</li>
            </ol>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/admin/login')}
              className="text-white/60 hover:text-white text-sm flex items-center justify-center space-x-1 mx-auto"
            >
              <span>Already have admin? Login here</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
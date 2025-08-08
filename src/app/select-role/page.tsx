'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Building, Shield, ArrowRight } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<'talent' | 'employer' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleRoleSelect = async (role: 'talent' | 'employer') => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Create user profile in Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
        role: role
      };

      await setDoc(doc(db, role === 'talent' ? 'talents' : 'employers', user.uid), userData);

      // Redirect to appropriate dashboard
      if (role === 'talent') {
        router.push('/talent/discover');
      } else {
        router.push('/employer/discover');
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Role</h1>
          <p className="text-white/80">Select how you want to use Talent Hub</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Talent Option */}
          <div 
            className={`bg-white/10 backdrop-blur-xl border rounded-2xl p-8 cursor-pointer transition-all ${
              selectedRole === 'talent' 
                ? 'border-purple-400 bg-purple-500/20' 
                : 'border-white/20 hover:border-purple-400/50'
            }`}
            onClick={() => setSelectedRole('talent')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">I'm a Talent</h3>
              <p className="text-white/80 mb-6">
                I'm looking for job opportunities and want to showcase my skills
              </p>
              <ul className="text-white/70 text-sm space-y-2 text-left">
                <li>• Create your professional profile</li>
                <li>• Upload video pitch</li>
                <li>• Discover job opportunities</li>
                <li>• Connect with employers</li>
              </ul>
            </div>
          </div>

          {/* Employer Option */}
          <div 
            className={`bg-white/10 backdrop-blur-xl border rounded-2xl p-8 cursor-pointer transition-all ${
              selectedRole === 'employer' 
                ? 'border-blue-400 bg-blue-500/20' 
                : 'border-white/20 hover:border-blue-400/50'
            }`}
            onClick={() => setSelectedRole('employer')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">I'm an Employer</h3>
              <p className="text-white/80 mb-6">
                I'm hiring and want to find talented professionals
              </p>
              <ul className="text-white/70 text-sm space-y-2 text-left">
                <li>• Create company profile</li>
                <li>• Browse talent profiles</li>
                <li>• Make connections</li>
                <li>• Hire the best talent</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {selectedRole && (
          <div className="mt-8 text-center">
            <button
              onClick={() => handleRoleSelect(selectedRole)}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Setting up...</span>
                </>
              ) : (
                <>
                  <span>Continue as {selectedRole === 'talent' ? 'Talent' : 'Employer'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Note */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            You can change your role later in settings
          </p>
        </div>
      </div>
    </div>
  );
} 
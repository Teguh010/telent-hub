'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  UserCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type UserRole = 'talent' | 'employer' | 'admin';

interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
}

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string, role: UserRole) => Promise<UserCredential>;
  logout: () => Promise<void>;
  getUserRole: () => UserRole | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user role from Firestore
  const getUserRole = async (uid: string): Promise<UserRole | null> => {
    try {
      // Check if user is admin first
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      if (adminDoc.exists()) {
        return 'admin';
      }

      // Check if user is talent
      const talentDoc = await getDoc(doc(db, 'talents', uid));
      if (talentDoc.exists()) {
        return 'talent';
      }

      // Check if user is employer
      const employerDoc = await getDoc(doc(db, 'employers', uid));
      if (employerDoc.exists()) {
        return 'employer';
      }

      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };

  // Get user profile data
  const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const role = await getUserRole(uid);
      if (!role) return null;

      const userDoc = await getDoc(doc(db, role === 'admin' ? 'admins' : role === 'talent' ? 'talents' : 'employers', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email || '',
          role,
          name: data.name || data.companyName || ''
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = (email: string, password: string, role: UserRole) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const getUserRoleSync = () => {
    return userProfile?.role || null;
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    getUserRole: getUserRoleSync,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

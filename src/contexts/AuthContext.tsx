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
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
  const getUserProfile = async (uid: string, userEmail?: string | null): Promise<UserProfile | null> => {
    try {
      const role = await getUserRole(uid);
      
      // If no role found, check if we have an email to create a basic profile
      if (!role) {
        if (userEmail) {
          console.log(`No role found for user ${uid}, creating basic profile`);
          return {
            uid,
            email: userEmail,
            role: 'talent', // Default role
            name: userEmail.split('@')[0] // Use username part of email as name
          };
        }
        return null;
      }

      // Try to get the user's profile from the appropriate collection
      const collectionName = role === 'admin' ? 'admins' : role === 'talent' ? 'talents' : 'employers';
      const userDoc = await getDoc(doc(db, collectionName, uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email || userEmail || '',
          role,
          name: data.name || data.companyName || userEmail?.split('@')[0] || 'User'
        };
      } else {
        // If document doesn't exist but we have a role, create a basic profile
        console.log(`Profile document not found for ${role} ${uid}, creating basic profile`);
        return {
          uid,
          email: userEmail || '',
          role,
          name: userEmail?.split('@')[0] || 'User'
        };
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          console.log('Auth state changed, user signed in:', user.uid);
          const profile = await getUserProfile(user.uid, user.email);
          console.log('User profile loaded:', profile);
          setUserProfile(profile);
          setUser(user);
        } else {
          console.log('Auth state changed, no user signed in');
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, role: UserRole) => {
    // First create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create a user profile in the appropriate collection based on role
    if (role === 'talent' || role === 'employer') {
      const userData = {
        uid: user.uid,
        email: email,
        role: role,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to the appropriate collection
      const collectionName = role === 'talent' ? 'talents' : 'employers';
      await setDoc(doc(db, collectionName, user.uid), userData);
      
      // Update the local user profile
      setUserProfile({
        uid: user.uid,
        email: email,
        role: role,
        name: email.split('@')[0]
      });
    }
    
    return userCredential;
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

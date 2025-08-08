import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const debugUserProfile = async (uid: string) => {
  console.log('🔍 Debugging user profile for UID:', uid);
  
  try {
    // Check admin
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if (adminDoc.exists()) {
      console.log('✅ User is ADMIN');
      return { role: 'admin', data: adminDoc.data() };
    }

    // Check talent
    const talentDoc = await getDoc(doc(db, 'talents', uid));
    if (talentDoc.exists()) {
      console.log('✅ User is TALENT');
      return { role: 'talent', data: talentDoc.data() };
    }

    // Check employer
    const employerDoc = await getDoc(doc(db, 'employers', uid));
    if (employerDoc.exists()) {
      console.log('✅ User is EMPLOYER');
      return { role: 'employer', data: employerDoc.data() };
    }

    console.log('❌ User has NO PROFILE in Firestore');
    return null;
  } catch (error) {
    console.error('❌ Error checking user profile:', error);
    return null;
  }
};

export const createUserProfile = async (uid: string, email: string, role: 'talent' | 'employer') => {
  console.log('🛠️ Creating user profile:', { uid, email, role });
  
  try {
    const userData = {
      uid,
      email,
      role,
      createdAt: new Date().toISOString(),
      name: role === 'talent' ? 'New Talent' : 'New Employer',
      country: 'Unknown',
      skills: [],
      languages: [],
      bio: 'No bio available yet.',
      cultureScore: 0,
      ...(role === 'employer' && { companyName: 'New Company' })
    };

    const collection = role === 'talent' ? 'talents' : 'employers';
    await setDoc(doc(db, collection, uid), userData);
    
    console.log('✅ User profile created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating user profile:', error);
    return false;
  }
};

export const addDebugUser = async (uid: string, email: string) => {
  console.log('🛠️ Adding debug user profile for:', email);
  
  // Create as talent by default
  const success = await createUserProfile(uid, email, 'talent');
  
  if (success) {
    console.log('✅ Debug user profile created');
    console.log('📋 User can now access talent dashboard');
  }
  
  return success;
}; 
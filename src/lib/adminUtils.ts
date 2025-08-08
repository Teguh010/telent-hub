import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin';
  name: string;
  createdAt: string;
  permissions: string[];
}

/**
 * Setup admin user in Firestore
 * @param uid - User UID from Firebase Auth
 * @param email - Admin email
 * @param name - Admin name
 */
export const setupAdminUser = async (uid: string, email: string, name: string) => {
  try {
    const adminData: AdminUser = {
      uid,
      email,
      role: 'admin',
      name,
      createdAt: new Date().toISOString(),
      permissions: ['read', 'write', 'delete']
    };

    await setDoc(doc(db, 'admins', uid), adminData);
    console.log('Admin user created successfully:', email);
    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return false;
  }
};

/**
 * Check if user is admin
 * @param uid - User UID
 */
export const checkAdminStatus = async (uid: string): Promise<boolean> => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Get admin user data
 * @param uid - User UID
 */
export const getAdminUser = async (uid: string): Promise<AdminUser | null> => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if (adminDoc.exists()) {
      return adminDoc.data() as AdminUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
};

/**
 * Get all admin users
 */
export const getAllAdmins = async (): Promise<AdminUser[]> => {
  try {
    const adminsQuery = query(collection(db, 'admins'));
    const querySnapshot = await getDocs(adminsQuery);
    
    const admins: AdminUser[] = [];
    querySnapshot.forEach((doc) => {
      admins.push(doc.data() as AdminUser);
    });
    
    return admins;
  } catch (error) {
    console.error('Error getting all admins:', error);
    return [];
  }
};

/**
 * Remove admin privileges
 * @param uid - User UID
 */
export const removeAdminUser = async (uid: string): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'admins', uid), {});
    console.log('Admin privileges removed for UID:', uid);
    return true;
  } catch (error) {
    console.error('Error removing admin user:', error);
    return false;
  }
}; 
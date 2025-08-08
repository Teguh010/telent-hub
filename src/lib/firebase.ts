import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcnBf2km-CRokEQM3P7gEMwcIVWs4ZD6E",
  authDomain: "talent-hub-21bca.firebaseapp.com",
  projectId: "talent-hub-21bca",
  storageBucket: "talent-hub-21bca.firebasestorage.app",
  messagingSenderId: "884212955873",
  appId: "1:884212955873:web:e5d308384e35df198895a0",
  measurementId: "G-4MJL5RCT3E"
};

// Initialize Firebase
let firebaseApp: FirebaseApp;

if (typeof window !== 'undefined' && getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
  
  // Initialize Analytics only in browser environment
  if (typeof window !== 'undefined') {
    isSupported().then(yes => yes && getAnalytics(firebaseApp));
  }
} else if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// Initialize Firebase services
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// Analytics will be initialized in the browser only
export { firebaseApp, auth, db, storage };

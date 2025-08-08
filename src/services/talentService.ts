import { db, storage } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

export interface TalentProfile {
  id: string;
  name: string;
  email: string;
  country: string;
  bio: string;
  cultureStyle: string;
  cultureScore: number;
  skills: string[];
  languages: string[];
  profileImageUrl?: string;
  videoPitch?: string;  // Direct video URL
  videoPitchUrl?: string; // Kept for backward compatibility
  videoPitchPath?: string;
  createdAt?: any;
  updatedAt?: any;
  userId?: string;
}

export interface SwipeAction {
  employerId: string;
  talentId: string;
  status: 'liked' | 'passed' | 'saved';
  timestamp: any;
}

// Get all talents (for employer view)
export const getAllTalents = async (): Promise<TalentProfile[]> => {
  try {
    const talentsRef = collection(db, 'talents');
    const snapshot = await getDocs(talentsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TalentProfile[];
  } catch (error) {
    console.error('Error fetching talents:', error);
    throw error;
  }
};

// Get a single talent by ID
export const getTalentById = async (talentId: string): Promise<TalentProfile | null> => {
  try {
    const talentRef = doc(db, 'talents', talentId);
    const talentDoc = await getDoc(talentRef);
    
    if (!talentDoc.exists()) {
      return null;
    }
    
    return {
      id: talentDoc.id,
      ...talentDoc.data()
    } as TalentProfile;
  } catch (error) {
    console.error('Error fetching talent:', error);
    throw error;
  }
};

// Upload video pitch for talent
export const uploadTalentVideo = async (
  talentId: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ videoUrl: string, videoPath: string }> => {
  try {
    const storageRef = ref(storage, `talent-videos/${talentId}/profile-video.${file.name.split('.').pop()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // Track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error('Error uploading video:', error);
          reject(error);
        },
        async () => {
          // Upload completed successfully
          const videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            videoUrl,
            videoPath: uploadTask.snapshot.ref.fullPath
          });
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadTalentVideo:', error);
    throw error;
  }
};

// Update talent profile with video URL
export const updateTalentWithVideo = async (
  talentId: string, 
  videoData: { videoUrl: string, videoPath: string }
): Promise<void> => {
  try {
    const talentRef = doc(db, 'talents', talentId);
    await updateDoc(talentRef, {
      videoPitchUrl: videoData.videoUrl,
      videoPitchPath: videoData.videoPath,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating talent with video:', error);
    throw error;
  }
};

// Record swipe action
export const recordSwipeAction = async (
  employerId: string,
  talentId: string,
  status: 'liked' | 'passed' | 'saved'
): Promise<void> => {
  try {
    const swipeRef = doc(db, 'swipes', `${employerId}_${talentId}`);
    await setDoc(swipeRef, {
      employerId,
      talentId,
      status,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error recording swipe action:', error);
    throw error;
  }
};

// Get talents that haven't been swiped by employer
export const getUnseenTalents = async (employerId: string): Promise<TalentProfile[]> => {
  try {
    // First get all swipes by this employer
    const swipesRef = collection(db, 'swipes');
    const q = query(swipesRef, where('employerId', '==', employerId));
    const swipesSnapshot = await getDocs(q);
    
    const seenTalentIds = swipesSnapshot.docs.map(doc => doc.data().talentId);
    
    // Get all talents
    console.log('Fetching all talents...');
    const talentsRef = collection(db, 'talents');
    const talentsSnapshot = await getDocs(talentsRef);
    
    console.log('Total talents in database:', talentsSnapshot.docs.length);
    console.log('Seen talent IDs:', seenTalentIds);
    
    // Filter out seen talents and those without videoPitch
    const unseenTalents = talentsSnapshot.docs
      .filter(doc => !seenTalentIds.includes(doc.id) && doc.data().videoPitch)
      .map(doc => {
        const data = doc.data();
        console.log('Processing talent with video pitch:', doc.id, data.name);
        return {
          id: doc.id,
          ...data
        };
      }) as TalentProfile[];
    
    console.log('Unseen talents count:', unseenTalents.length);
    return unseenTalents;
  } catch (error) {
    console.error('Error getting unseen talents:', error);
    throw error;
  }
};

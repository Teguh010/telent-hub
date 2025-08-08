'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Briefcase, MapPin, Languages, Star, Upload, X, Video } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

const countries = [
  'Indonesia',
  'Malaysia',
  'Singapore',
  'Thailand',
  'Vietnam',
  'Philippines',
  'Japan',
  'South Korea',
  'China',
  'India',
  'United States',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Other'
];

const skillsList = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Python', 'Django', 'Flask', 'Java', 'Spring Boot',
  'PHP', 'Laravel', 'Ruby', 'Ruby on Rails', 'Go',
  'C#', '.NET', 'Swift', 'Kotlin', 'Flutter',
  'React Native', 'Docker', 'Kubernetes', 'AWS', 'GCP',
  'Azure', 'MongoDB', 'PostgreSQL', 'MySQL', 'GraphQL',
  'REST API', 'UI/UX Design', 'Product Management', 'Project Management',
  'DevOps', 'Machine Learning', 'Data Science', 'Blockchain', 'Cybersecurity'
];

type TalentProfile = {
  name: string;
  country: string;
  skills: string[];
  languages: string[];
  bio: string;
  videoPitch?: string;
  cultureStyle?: string;
};

export default function EditTalentProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState<TalentProfile>({
    name: '',
    country: '',
    skills: [],
    languages: [],
    bio: '',
    cultureStyle: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  // Filter skills based on input
  useEffect(() => {
    if (newSkill.trim() === '') {
      setAvailableSkills([]);
      return;
    }
    
    const filtered = skillsList
      .filter(skill => 
        skill.toLowerCase().includes(newSkill.toLowerCase()) && 
        !formData.skills.includes(skill)
      )
      .slice(0, 5);
    
    setAvailableSkills(filtered);
  }, [newSkill, formData.skills]);

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const docRef = doc(db, 'talents', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData(docSnap.data() as TalentProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile');
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = (skill: string) => {
    if (!formData.skills.includes(skill) && skill.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setNewSkill('');
      setAvailableSkills([]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() !== '' && !formData.languages.includes(newLanguage)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== languageToRemove)
    }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid video file');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('Video file size should be less than 50MB');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    const storageRef = ref(storage, `talents/${user.uid}/video-pitch/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        setError('Failed to upload video. Please try again.');
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData(prev => ({
            ...prev,
            videoPitch: downloadURL
          }));
          setSuccess('Video uploaded successfully!');
        } catch (error) {
          console.error('Error getting download URL:', error);
          setError('Failed to get video URL. Please try again.');
        } finally {
          setIsUploading(false);
        }
      }
    );
  };

  const handleRemoveVideo = () => {
    setFormData(prev => ({
      ...prev,
      videoPitch: undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to save your profile');
      return;
    }

    // Basic validation
    if (!formData.name || !formData.country || formData.skills.length === 0 || formData.languages.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const docRef = doc(db, 'talents', user.uid);
      await setDoc(
        docRef,
        {
          ...formData,
          updatedAt: serverTimestamp(),
          userId: user.uid,
          email: user.email,
        },
        { merge: true }
      );
      
      setSuccess('Profile updated successfully!');
      // Redirect to profile page after a short delay
      setTimeout(() => {
        router.push('/dashboard/talent/profile');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Edit Profile
          </h2>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Star className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This information will be displayed publicly so be careful what you share.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Full name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    required
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Bio <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="cultureStyle" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Work Culture Style
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="cultureStyle"
                    id="cultureStyle"
                    value={formData.cultureStyle || ''}
                    onChange={handleInputChange}
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    placeholder="E.g., Agile, Remote-first, Startup, etc."
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <div className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Skills <span className="text-red-500">*</span>
                </div>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
                      >
                        {skill}
                        <button
                          type="button"
                          className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          <span className="sr-only">Remove skill</span>
                          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                      placeholder="Add a skill"
                    />
                    {availableSkills.length > 0 && (
                      <ul className="absolute z-10 mt-1 max-w-xs rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {availableSkills.map((skill) => (
                          <li
                            key={skill}
                            className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-100"
                            onClick={() => handleAddSkill(skill)}
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-1 text-xs text-gray-500">
                      Type to search and add skills from the list
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <div className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Languages <span className="text-red-500">*</span>
                </div>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.languages.map((language) => (
                      <span
                        key={language}
                        className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                      >
                        {language}
                        <button
                          type="button"
                          className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:bg-green-500 focus:text-white focus:outline-none"
                          onClick={() => handleRemoveLanguage(language)}
                        >
                          <span className="sr-only">Remove language</span>
                          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLanguage();
                        }
                      }}
                      className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Add a language"
                    />
                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <div className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Video Pitch
                </div>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  {formData.videoPitch ? (
                    <div className="relative">
                      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                        <video
                          src={formData.videoPitch}
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="video-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a video pitch</span>
                            <input
                              id="video-upload"
                              name="video-upload"
                              type="file"
                              className="sr-only"
                              accept="video/*"
                              onChange={handleVideoUpload}
                              ref={fileInputRef}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          MP4, WebM up to 50MB (30-60 seconds recommended)
                        </p>
                      </div>
                    </div>
                  )}
                  {isUploading && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Uploading: {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`ml-3 inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isSubmitting || isUploading
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

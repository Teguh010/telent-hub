'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Briefcase, MapPin, Languages, Star, Upload, X, Video, User, Save, ArrowLeft } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';
import Link from 'next/link';

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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setError('');

    try {
      const storageRef = ref(storage, `talents/${user.uid}/video-pitch/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          uploadedBy: user.uid,
          originalName: file.name
        }
      });

      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress function
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          // Error function
          console.error('Upload error:', error);
          setError('Upload failed: ' + error.message);
          setIsUploading(false);
        },
        async () => {
          // Complete function
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setFormData(prev => ({
              ...prev,
              videoPitch: downloadURL
            }));
            setSuccess('Video uploaded successfully!');
          } catch (error) {
            console.error('Error getting download URL:', error);
            setError('Failed to get download URL');
          } finally {
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to start upload');
      setIsUploading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
              <p className="text-white/80 text-sm">Update your talent profile</p>
            </div>
          </div>
          <Link
            href="/dashboard/talent/profile"
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all border border-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24 space-y-6">
        {/* Error/Success Messages */}
        {error && (
          <Card className="bg-red-500/20 backdrop-blur-sm border-red-500/40">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <X className="w-5 h-5 text-red-400" />
                <p className="text-red-100">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="bg-green-500/20 backdrop-blur-sm border-green-500/40">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-green-400" />
                <p className="text-green-100">{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 mr-2 text-white/80" />
                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Full name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-white mb-2">
                    Country <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
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

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-white mb-2">
                    Bio <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cultureStyle" className="block text-sm font-medium text-white mb-2">
                    Work Culture Style
                  </label>
                  <input
                    type="text"
                    name="cultureStyle"
                    id="cultureStyle"
                    value={formData.cultureStyle || ''}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="E.g., Agile, Remote-first, Startup, etc."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Briefcase className="w-5 h-5 mr-2 text-white/80" />
                <h3 className="text-lg font-semibold text-white">Skills <span className="text-red-400">*</span></h3>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-white/20 text-white border-white/30">
                    {skill}
                    <button
                      type="button"
                      className="ml-1.5 hover:text-red-400"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Add a skill"
                />
                {availableSkills.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
                    {availableSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        className="w-full text-left px-3 py-2 text-white hover:bg-white/20"
                        onClick={() => handleAddSkill(skill)}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Languages className="w-5 h-5 mr-2 text-white/80" />
                <h3 className="text-lg font-semibold text-white">Languages <span className="text-red-400">*</span></h3>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.languages.map((language) => (
                  <Badge key={language} variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30">
                    {language}
                    <button
                      type="button"
                      className="ml-1.5 hover:text-red-400"
                      onClick={() => handleRemoveLanguage(language)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
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
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Add a language"
                />
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Add
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Video Pitch */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Video className="w-5 h-5 mr-2 text-white/80" />
                <h3 className="text-lg font-semibold text-white">Video Pitch</h3>
              </div>
              
              {formData.videoPitch ? (
                <div className="relative">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={formData.videoPitch}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-white/20 border-dashed rounded-lg p-6 text-center">
                  <Video className="w-12 h-12 text-white/50 mx-auto mb-4" />
                  <div className="text-white/70 mb-4">
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer text-purple-300 hover:text-purple-200"
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
                    <p className="text-sm mt-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-white/50">
                    MP4, WebM up to 50MB (30-60 seconds recommended)
                  </p>
                </div>
              )}
              
              {isUploading && (
                <div className="mt-4">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-white/70">
                    Uploading: {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/dashboard/talent/profile"
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all border border-white/30"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

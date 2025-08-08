'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Building, Briefcase, MapPin, Mail, Phone, Globe, Save } from 'lucide-react';
import Link from 'next/link';

type EmployeeProfile = {
  companyName: string;
  companyWebsite?: string;
  position: string;
  industry: string;
  location: string;
  email: string;
  phone?: string;
  about?: string;
  companySize?: string;
  foundedYear?: number;
};

export default function EditEmployeeProfile() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<EmployeeProfile>({
    companyName: '',
    position: '',
    industry: '',
    location: '',
    email: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        router.push('/login');
        return;
      }
      
      try {
        setLoading(true);
        const docRef = doc(db, 'employers', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData(docSnap.data() as EmployeeProfile);
        } else {
          // Set default email from auth user if new profile
          setFormData(prev => ({
            ...prev,
            email: user.email || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      const docRef = doc(db, 'employers', user.uid);
      await setDoc(docRef, {
        ...formData,
        updatedAt: serverTimestamp(),
        userId: user.uid,
      }, { merge: true });
      
      // Redirect to profile page after successful save
      router.push('/employee/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold leading-7 text-gray-900 sm:text-xl sm:truncate">
              {formData.companyName ? `Edit ${formData.companyName}` : 'Create Employer Profile'}
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/employee/profile"
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Company Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Basic information about your company.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name *
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="companyName"
                        id="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                        placeholder="Company Name"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Your Position *
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="position"
                        id="position"
                        required
                        value={formData.position}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                        placeholder="e.g. HR Manager, Recruiter"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                    Industry *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="industry"
                      id="industry"
                      required
                      value={formData.industry}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g. Technology, Healthcare, Finance"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">
                    Company Website
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="companyWebsite"
                        id="companyWebsite"
                        value={formData.companyWebsite || ''}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div className='mt-1 pt-2'>
                  <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                    Company Size
                  </label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select size</option>
                    <option value="1-10 employees">1-10 employees</option>
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="51-200 employees">51-200 employees</option>
                    <option value="201-500 employees">201-500 employees</option>
                    <option value="501-1000 employees">501-1000 employees</option>
                    <option value="1001-5000 employees">1001-5000 employees</option>
                    <option value="5001+ employees">5001+ employees</option>
                  </select>
                </div>
                 <div className="sm:col-span-2 pt-2">
                  <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    name="foundedYear"
                    id="foundedYear"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.foundedYear || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. 2010"
                  />
                </div>
                <div className="pt-2">
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    About Your Company
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      name="about"
                      rows={5}
                      value={formData.about || ''}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Tell us about your company, culture, and what makes it a great place to work..."
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Brief description about your company.
                  </p>
                </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <Link
                href="/employee/profile"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

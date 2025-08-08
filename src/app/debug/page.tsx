'use client';

import { useAuth } from '@/contexts/AuthContext';
import { debugUserProfile, createUserProfile } from '@/lib/debugUtils';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DebugPage() {
  const { user, userProfile } = useAuth();
  const [debugResult, setDebugResult] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createResult, setCreateResult] = useState<string>('');

  const handleDebugProfile = async () => {
    if (!user) return;
    
    const result = await debugUserProfile(user.uid);
    setDebugResult(result);
  };

  const handleCreateProfile = async (role: 'talent' | 'employer') => {
    if (!user) return;
    
    setIsCreating(true);
    setCreateResult('');
    
    try {
      const success = await createUserProfile(user.uid, user.email || '', role);
      if (success) {
        setCreateResult(`✅ Profile created successfully as ${role}! Please refresh the page.`);
        // Force reload to update auth context
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setCreateResult('❌ Failed to create profile');
      }
    } catch (error) {
      setCreateResult(`❌ Error: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">🔧 Debug Panel</h1>
          <p className="text-white/80">Debug and fix authentication issues</p>
        </div>

        {/* Current Auth Status */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Current Auth Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Firebase Auth</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-white/80">
                    <span className="font-medium">User:</span> {user ? '✅ Authenticated' : '❌ Not authenticated'}
                  </p>
                  {user && (
                    <>
                      <p className="text-white/80">
                        <span className="font-medium">UID:</span> {user.uid}
                      </p>
                      <p className="text-white/80">
                        <span className="font-medium">Email:</span> {user.email}
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Firestore Profile</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-white/80">
                    <span className="font-medium">Profile:</span> {userProfile ? '✅ Found' : '❌ Not found'}
                  </p>
                  {userProfile && (
                    <>
                      <p className="text-white/80">
                        <span className="font-medium">Role:</span> 
                        <Badge variant="outline" className="ml-2 bg-white/20 text-white border-white/30">
                          {userProfile.role}
                        </Badge>
                      </p>
                      <p className="text-white/80">
                        <span className="font-medium">Name:</span> {userProfile.name || 'N/A'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Actions */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Debug Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleDebugProfile}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                🔍 Debug Profile
              </Button>
              
              {user && !userProfile && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleCreateProfile('talent')}
                    disabled={isCreating}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isCreating ? 'Creating...' : '➕ Create Talent Profile'}
                  </Button>
                  
                  <Button 
                    onClick={() => handleCreateProfile('employer')}
                    disabled={isCreating}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {isCreating ? 'Creating...' : '➕ Create Employer Profile'}
                  </Button>
                </div>
              )}
            </div>

            {createResult && (
              <div className={`p-4 rounded-lg ${createResult.includes('✅') ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                <p className="text-white">{createResult}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug Results */}
        {debugResult && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Debug Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Profile Status</h3>
                  <Badge 
                    variant="outline" 
                    className={`${debugResult ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}
                  >
                    {debugResult ? `Found as ${debugResult.role}` : 'Not Found'}
                  </Badge>
                </div>
                
                {debugResult && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">Profile Data</h3>
                    <pre className="bg-black/20 p-4 rounded-lg text-white/80 text-sm overflow-auto">
                      {JSON.stringify(debugResult.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">How to Fix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-white/80">
              <p><strong>Scenario 1:</strong> User authenticated but no profile → Click "Create Talent Profile" or "Create Employer Profile"</p>
              <p><strong>Scenario 2:</strong> Profile exists but auth context not updated → Refresh the page</p>
              <p><strong>Scenario 3:</strong> Wrong role assigned → Create new profile with correct role</p>
              <p><strong>Note:</strong> After creating profile, you'll be automatically redirected to the appropriate dashboard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
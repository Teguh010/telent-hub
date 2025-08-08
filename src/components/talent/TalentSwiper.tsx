'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, X, Star, Play, Pause } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { Badge } from '@/components/badge';
import { useAuth } from '@/contexts/AuthContext';
import { TalentProfile } from '@/services/talentService';
import { recordSwipeAction } from '@/services/talentService';

interface TalentSwiperProps {
  onSwipeComplete?: () => void;
}

export function TalentSwiper({ onSwipeComplete }: TalentSwiperProps) {
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const { user } = useAuth();

  // Fetch talents from Firestore
  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching talents for user:', user?.uid);
        const { getUnseenTalents } = await import('@/services/talentService');
        const fetchedTalents = await getUnseenTalents(user?.uid || '');
        console.log('Fetched talents:', fetchedTalents);
        setTalents(fetchedTalents);
      } catch (err) {
        console.error('Error fetching talents:', err);
        setError('Failed to load talents. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.uid) {
      fetchTalents();
    }
  }, [user?.uid]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!user || currentIndex >= talents.length) return;

    const currentTalent = talents[currentIndex];
    
    try {
      // Record the swipe action
      await recordSwipeAction(
        user.uid,
        currentTalent.id,
        direction === 'right' ? 'liked' : 'passed'
      );

      // Move to next talent
      if (currentIndex < talents.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsPlaying(false);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.pause();
        }
      } else {
        // No more talents
        onSwipeComplete?.();
      }
    } catch (error) {
      console.error('Error recording swipe:', error);
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const offset = currentX - startX.current;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    // Determine if the swipe was significant enough
    if (dragOffset > 100) {
      // Swiped right (like)
      handleSwipe('right');
    } else if (dragOffset < -100) {
      // Swiped left (pass)
      handleSwipe('left');
    }
    
    // Reset drag state
    setDragOffset(0);
    setIsDragging(false);
  };

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const offset = currentX - startX.current;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    // Determine if the drag was significant enough
    if (dragOffset > 100) {
      // Swiped right (like)
      handleSwipe('right');
    } else if (dragOffset < -100) {
      // Swiped left (pass)
      handleSwipe('left');
    }
    
    // Reset drag state
    setDragOffset(0);
    setIsDragging(false);
  };

  // Add/remove mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.error('Error playing video:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (talents.length === 0) {
    return (
      <div className="text-center p-6">
        <h3 className="text-lg font-medium text-gray-900">No more talents to show</h3>
        <p className="mt-2 text-sm text-gray-500">Check back later for new talent profiles.</p>
      </div>
    );
  }

  const currentTalent = talents[currentIndex];
  const rotation = dragOffset * 0.1;
  const opacity = Math.min(1, 100 / Math.abs(dragOffset || 1));

  return (
    <div className="relative w-full h-full">
      <div 
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <Card
          ref={cardRef}
          className={`relative w-full h-full transition-transform duration-200 ease-out ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
            opacity,
          }}
        >
          <CardContent className="p-0 h-full">
            {/* Video Player */}
            <div className="relative w-full h-96 bg-black rounded-t-lg overflow-hidden">
              {currentTalent.videoPitch || currentTalent.videoPitchUrl ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={currentTalent.videoPitch || currentTalent.videoPitchUrl}
                    className="w-full h-full object-cover"
                    loop
                    onClick={togglePlayPause}
                    poster={currentTalent.profileImageUrl}
                    onError={(e) => {
                      console.error('Error loading video:', e);
                      setVideoError(true);
                      const videoElement = e.target as HTMLVideoElement;
                      if (videoElement) {
                        videoElement.poster = '/placeholder-video.jpg';
                      }
                    }}
                  />
                  <button
                    onClick={togglePlayPause}
                    className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full z-10"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                </div>
              ) : videoError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">Video tidak dapat dimuat</span>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">Tidak ada video</span>
                </div>
              )}
            </div>

            {/* Talent Info */}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{currentTalent.name}</h3>
                  <p className="text-gray-600">{currentTalent.country}</p>
                </div>
                <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  {currentTalent.cultureScore}%
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-1">About</h4>
                <p className="text-sm text-gray-700">{currentTalent.bio}</p>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-1">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {currentTalent.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-1">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {currentTalent.languages.map((language, index) => (
                    <Badge key={index} variant="secondary">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium">Culture Style</h4>
                <p className="text-sm text-gray-700">{currentTalent.cultureStyle}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Swipe indicators */}
        {isDragging && (
          <>
            {dragOffset > 50 && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none rounded-lg">
                <div className="bg-green-500 rounded-full p-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
            {dragOffset < -50 && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center pointer-events-none rounded-lg">
                <div className="bg-red-500 rounded-full p-4">
                  <X className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-8 mt-6">
        <button
          onClick={() => handleSwipe('left')}
          className="p-4 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
          aria-label="Pass"
        >
          <X className="w-8 h-8" />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="p-4 bg-green-100 text-green-500 rounded-full hover:bg-green-200 transition-colors"
          aria-label="Like"
        >
          <Heart className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}

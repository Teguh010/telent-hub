'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, X, Star, Play, Pause, MessageCircle, Share2, Bookmark, MoreHorizontal, MapPin, Briefcase, Languages, Sparkles, Zap, TrendingUp } from 'lucide-react';
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
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
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
        setIsLiked(false);
        setIsSaved(false);
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      handleSwipe('right');
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading amazing talents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (talents.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="text-center p-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No more talents to show</h3>
          <p className="text-white/80">Check back later for new amazing profiles!</p>
        </div>
      </div>
    );
  }

  const currentTalent = talents[currentIndex];
  const rotation = dragOffset * 0.1;
  const opacity = Math.min(1, 100 / Math.abs(dragOffset || 1));

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 overflow-hidden">
      {/* Mobile: Full screen, Desktop: Mobile width, full height */}
      <div className="md:flex md:items-center md:justify-center md:h-full">
        <div className="relative w-full h-full md:w-[475px] md:h-full  md:overflow-hidden md:shadow-2xl">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 p-4">
            <div className="flex space-x-1 mb-2">
              {talents.slice(currentIndex, currentIndex + 5).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                    index === 0 ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm font-medium">
                {currentIndex + 1}/{talents.length}
              </span>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            </div>
          </div>

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
              } border-0 shadow-2xl`}
              style={{
                transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
                opacity,
              }}
            >
              <CardContent className="p-0 h-full">
                {/* Video Player */}
                <div className="relative w-full h-full bg-black overflow-hidden">
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
                      
                      {/* Video Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Play/Pause Button */}
                      <button
                        onClick={togglePlayPause}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full z-10 hover:bg-white/30 transition-all duration-200"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                      </button>
                    </div>
                  ) : videoError ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
                      <div className="text-center text-white">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <X className="w-10 h-10" />
                        </div>
                        <span className="text-lg font-medium">Video tidak dapat dimuat</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
                      <div className="text-center text-white">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Play className="w-10 h-10 ml-1" />
                        </div>
                        <span className="text-lg font-medium">Tidak ada video</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side Action Buttons (TikTok Style) */}
                <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 z-20">
                  {/* Profile Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
                      {currentTalent.profileImageUrl ? (
                        <img 
                          src={currentTalent.profileImageUrl} 
                          alt={currentTalent.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                          {currentTalent.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                      isLiked ? 'text-red-500 scale-110' : 'text-white hover:scale-110'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
                      isLiked ? 'bg-red-500/20' : 'bg-white/20 hover:bg-white/30'
                    }`}>
                      <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-xs font-medium">Like</span>
                  </button>

                  {/* Comment Button */}
                  <button className="flex flex-col items-center space-y-1 text-white hover:scale-110 transition-all duration-200">
                    <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium">Comment</span>
                  </button>

                  {/* Share Button */}
                  <button className="flex flex-col items-center space-y-1 text-white hover:scale-110 transition-all duration-200">
                    <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium">Share</span>
                  </button>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                      isSaved ? 'text-yellow-400 scale-110' : 'text-white hover:scale-110'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
                      isSaved ? 'bg-yellow-400/20' : 'bg-white/20 hover:bg-white/30'
                    }`}>
                      <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-xs font-medium">Save</span>
                  </button>

                  {/* More Options */}
                  <button className="flex flex-col items-center space-y-1 text-white hover:scale-110 transition-all duration-200">
                    <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm">
                      <MoreHorizontal className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium">More</span>
                  </button>
                </div>

                {/* Bottom Info Section */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  {/* Talent Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-2xl font-bold text-white">{currentTalent.name}</h3>
                        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                          <Zap className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        {currentTalent.cultureScore}%
                      </div>
                    </div>

                    <div className="flex items-center text-white/80 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{currentTalent.country}</span>
                    </div>

                    {/* Bio */}
                    <p className="text-white/90 text-sm leading-relaxed mb-4 line-clamp-2">
                      {currentTalent.bio}
                    </p>

                    {/* Skills */}
                    <div className="mb-3">
                      <div className="flex items-center mb-2">
                        <Briefcase className="w-4 h-4 mr-2 text-white/80" />
                        <span className="text-sm font-medium text-white">Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentTalent.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {currentTalent.skills.length > 3 && (
                          <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                            +{currentTalent.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Languages className="w-4 h-4 mr-2 text-white/80" />
                        <span className="text-sm font-medium text-white">Languages</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentTalent.languages.map((language, index) => (
                          <Badge key={index} variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30 text-xs">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Culture Style */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-white mb-1">Culture Style</h4>
                      <p className="text-sm text-white/80">{currentTalent.cultureStyle}</p>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleSwipe('left')}
                      className="flex-1 bg-white/20 backdrop-blur-sm text-white py-4 px-6 rounded-full hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2 border border-white/30"
                    >
                      <X className="w-6 h-6" />
                      <span className="font-medium">Pass</span>
                    </button>
                    <button
                      onClick={() => handleSwipe('right')}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-full transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <Heart className="w-6 h-6" />
                      <span className="font-medium">Like</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Swipe indicators */}
            {isDragging && (
              <>
                {dragOffset > 50 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent flex items-center justify-center pointer-events-none rounded-lg">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-6 shadow-2xl">
                      <Heart className="w-12 h-12 text-white fill-current" />
                    </div>
                  </div>
                )}
                {dragOffset < -50 && (
                  <div className="absolute inset-0 bg-gradient-to-l from-red-500/20 to-transparent flex items-center justify-center pointer-events-none rounded-lg">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-6 shadow-2xl">
                      <X className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

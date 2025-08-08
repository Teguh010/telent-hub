'use client';

import { Briefcase, Heart, Languages, MapPin, Play,Star, X } from 'lucide-react';
import { useEffect,useRef, useState } from 'react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Talent {
  id: string;
  name: string;
  country: string;
  skills: string[];
  languages: string[];
  cultureStyle: string;
  bio: string;
  cultureScore: number;
  videoPitch?: string;
}

interface TalentSwiperProps {
  talents: Talent[];
  onLike: (talentId: string) => void;
  onSkip: (talentId: string) => void;
}

export function TalentSwiper({ talents, onLike, onSkip }: TalentSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const currentTalent = talents[currentIndex];

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
    setIsDragging(false);
    
    const threshold = window.innerWidth * 0.3;
    
    if (Math.abs(dragOffset) > threshold) {
      const direction = dragOffset > 0 ? 'right' : 'left';
      handleSwipe(direction);
    } else {
      setDragOffset(0);
    }
  };

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.clientX;
    const offset = currentX - startX.current;
    setDragOffset(offset);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setIsDragging(false);
    
    const threshold = window.innerWidth * 0.3;
    
    if (Math.abs(dragOffset) > threshold) {
      const direction = dragOffset > 0 ? 'right' : 'left';
      handleSwipe(direction);
    } else {
      setDragOffset(0);
    }
  };

  // Global mouse events to handle dragging outside the card
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const currentX = e.clientX;
      const offset = currentX - startX.current;
      setDragOffset(offset);
    };

    const handleGlobalMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      
      const threshold = window.innerWidth * 0.3;
      
      if (Math.abs(dragOffset) > threshold) {
        const direction = dragOffset > 0 ? 'right' : 'left';
        handleSwipe(direction);
      } else {
        setDragOffset(0);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentTalent) return;

    setSwipeDirection(direction);
    setDragOffset(direction === 'right' ? window.innerWidth : -window.innerWidth);
    
    setTimeout(() => {
      if (direction === 'right') {
        onLike(currentTalent.id);
      } else {
        onSkip(currentTalent.id);
      }
      
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setDragOffset(0);
    }, 300);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTalent]);

  const getCultureScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCultureScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  if (currentIndex >= talents.length) {
    return (
      <div className="flex items-center justify-center h-full px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
          <p className="text-gray-600 text-sm">You've reviewed all available talents.</p>
        </div>
      </div>
    );
  }

  if (!currentTalent) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Progress indicator */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex space-x-1">
          {talents.slice(currentIndex, currentIndex + 5).map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full flex-1 ${
                index === 0 ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-white text-sm font-medium drop-shadow-lg">
            {currentIndex + 1}/{talents.length}
          </div>
          {/* Desktop hints */}
          <div className="hidden md:block text-white/70 text-xs drop-shadow-lg">
            Click & drag or use ← → keys
          </div>
        </div>
      </div>

      {/* Main card */}
      <div
        ref={cardRef}
        className={`relative h-full w-full transition-transform duration-300 ease-out cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        } ${swipeDirection ? 'pointer-events-none' : ''}`}
        style={{
          transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Card className="h-full w-full overflow-hidden relative bg-gradient-to-b from-gray-900/20 to-gray-900/80 select-none">
          {/* Video area */}
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="text-lg font-medium mb-1">{currentTalent.name}</p>
                <p className="text-sm opacity-80">Video Pitch</p>
              </div>
            </div>
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <CardContent className="p-4 text-white relative z-10">
              {/* Talent basic info */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-bold">{currentTalent.name}</h2>
                    <div className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1 opacity-80" />
                      <span className="text-sm opacity-80">{currentTalent.country}</span>
                    </div>
                  </div>
                  
                  {/* Culture Score */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      <span className="text-lg font-bold">{currentTalent.cultureScore}%</span>
                    </div>
                    <div className="text-xs opacity-80">
                      {getCultureScoreLabel(currentTalent.cultureScore)}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm opacity-90 leading-relaxed mb-3 line-clamp-2">
                  {currentTalent.bio}
                </p>

                {/* Skills */}
                <div className="mb-3">
                  <div className="flex items-center mb-2">
                    <Briefcase className="w-4 h-4 mr-2 opacity-80" />
                    <span className="text-sm font-medium">Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentTalent.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {currentTalent.skills.length > 3 && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                        +{currentTalent.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Languages className="w-4 h-4 mr-2 opacity-80" />
                    <span className="text-sm font-medium">Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentTalent.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="border-white/30 text-white text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm h-14"
                  onClick={() => handleSwipe('left')}
                >
                  <X className="w-6 h-6 mr-2" />
                  Pass
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-0 text-white h-14"
                  onClick={() => handleSwipe('right')}
                >
                  <Heart className="w-6 h-6 mr-2" />
                  Like
                </Button>
              </div>
            </CardContent>
          </div>

          {/* Swipe indicators */}
          {dragOffset !== 0 && (
            <>
              {dragOffset > 50 && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none">
                  <div className="bg-green-500 rounded-full p-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
              {dragOffset < -50 && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center pointer-events-none">
                  <div className="bg-red-500 rounded-full p-4">
                    <X className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
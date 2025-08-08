'use client';

import { Briefcase, Heart, Languages, MapPin, Play,Star, X } from 'lucide-react';
import { useEffect,useRef, useState } from 'react';

import { Card, CardContent } from '@/components/card';
import Button from '@/components/buttons/Button';

import { Badge } from '@/components/badge';

// import ArrowLink from '@/components/links/ArrowLink';
// import ButtonLink from '@/components/links/ButtonLink';

// import UnderlineLink from '@/components/links/UnderlineLink';

// Dummy data for demonstration
const dummyTalents = [
  {
    id: '1',
    name: 'Jane Doe',
    country: 'USA',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    languages: ['English', 'Spanish'],
    cultureStyle: 'Collaborative',
    bio: 'Experienced frontend developer with a passion for building scalable web apps.',
    cultureScore: 85,
    videoPitch: '',
  },
  {
    id: '2',
    name: 'John Smith',
    country: 'Canada',
    skills: ['Python', 'Django', 'Docker'],
    languages: ['English', 'French'],
    cultureStyle: 'Innovative',
    bio: 'Backend engineer focused on cloud-native solutions and automation.',
    cultureScore: 72,
    videoPitch: '',
  },
];

function handleLike(id: string) {
  // Placeholder for like action
}

function handleSkip(id: string) {
  // Placeholder for skip action
}

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Talent Hub
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8">
            Connect talented professionals with innovative companies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
              Get Started
            </button>
            <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <Briefcase className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">For Employers</h3>
            <p className="text-white/80">Find the perfect talent for your company</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <Heart className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">For Talents</h3>
            <p className="text-white/80">Discover amazing opportunities</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <Star className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Smart Matching</h3>
            <p className="text-white/80">AI-powered matching algorithm</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">1,247+</div>
            <div className="text-white/80">Talents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">89+</div>
            <div className="text-white/80">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">342+</div>
            <div className="text-white/80">Matches</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">95%</div>
            <div className="text-white/80">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
// import UnstyledLink from '@/components/links/UnstyledLink';

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
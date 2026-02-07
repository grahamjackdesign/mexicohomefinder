'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { Home, Shield, MapPin } from 'lucide-react';

const HERO_IMAGES = [
  '/images/hero/luxury-1.jpg',
  '/images/hero/luxury-2.jpg',
  '/images/hero/luxury-3.jpg',
  '/images/hero/luxury-4.jpg',
  '/images/hero/luxury-5.jpg',
];

// Different Ken Burns directions for variety
const KB_DIRECTIONS = [
  { from: 'scale(1) translate(0, 0)',       to: 'scale(1.15) translate(-3%, -3%)' },   // zoom + drift top-left
  { from: 'scale(1.15) translate(-3%, 3%)', to: 'scale(1) translate(0, 0)' },          // zoom out from bottom-left
  { from: 'scale(1) translate(0, 0)',       to: 'scale(1.12) translate(3%, -2%)' },    // zoom + drift top-right
  { from: 'scale(1.1) translate(2%, 2%)',   to: 'scale(1) translate(-1%, 0)' },        // zoom out from bottom-right
  { from: 'scale(1) translate(-2%, 0)',     to: 'scale(1.15) translate(2%, -3%)' },    // pan left-to-right + zoom
];

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = (nextIndex: number) => {
    if (nextIndex === currentIndex || isTransitioning) return;
    setIsTransitioning(true);
    setPrevIndex(currentIndex);
    setCurrentIndex(nextIndex);

    // Clear transition lock after the crossfade completes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPrevIndex(null);
      setIsTransitioning(false);
    }, 2000);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % HERO_IMAGES.length;
        setPrevIndex(prev);
        setIsTransitioning(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setPrevIndex(null);
          setIsTransitioning(false);
        }, 2000);
        return next;
      });
    }, 6000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 w-full h-full">
        {HERO_IMAGES.map((image, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === prevIndex;
          const isVisible = isActive || isPrev;
          const dir = KB_DIRECTIONS[index % KB_DIRECTIONS.length];

          return (
            <div
              key={image}
              className="absolute inset-0"
              style={{
                opacity: isActive ? 1 : isPrev ? 1 : 0,
                // Active slide fades in on top; previous slide sits behind
                zIndex: isActive ? 2 : isPrev ? 1 : 0,
                transition: 'opacity 2000ms ease-in-out',
              }}
            >
              <div
                className="absolute inset-0"
                style={
                  isVisible
                    ? {
                        animation: `kb-${index} 10s ease-out forwards`,
                      }
                    : { transform: dir.from }
                }
              >
                <Image
                  src={image}
                  alt={`Luxury Mexican property ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={90}
                />
              </div>
            </div>
          );
        })}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-[3] bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-fade-in-up backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(232, 238, 244, 0.9)',
              color: '#2C4563',
            }}
          >
            <span className="text-sm font-semibold uppercase tracking-wide">
              🇺🇸 Built for American & Canadian Buyers
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up animate-delay-100 text-white drop-shadow-2xl">
            Find Your Dream Home in{' '}
            <span style={{ color: '#C85A3E' }}>Mexico</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl animate-fade-in-up animate-delay-200 drop-shadow-lg">
            The trusted platform connecting American buyers with verified
            Mexican real estate agents. From beachfront condos to colonial
            homes, find your perfect property with expert guidance.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-2 shadow-2xl animate-fade-in-up animate-delay-300 backdrop-blur-sm">
            <SearchAutocomplete
              variant="hero"
              placeholder="Search by city, state, or neighborhood..."
            />
          </div>

          {/* Quick Stats */}
          <div className="mt-8 flex flex-wrap gap-6 animate-fade-in-up animate-delay-400">
            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
              <Home className="w-5 h-5" style={{ color: '#C85A3E' }} />
              <span className="text-sm font-semibold text-white">
                1,000+ Curated Listings
              </span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
              <Shield className="w-5 h-5" style={{ color: '#C85A3E' }} />
              <span className="text-sm font-semibold text-white">
                100% Verified Agents
              </span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
              <MapPin className="w-5 h-5" style={{ color: '#C85A3E' }} />
              <span className="text-sm font-semibold text-white">
                12+ Prime Regions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-1.5 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Curved bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          clipPath: 'ellipse(75% 100% at 50% 100%)',
          backgroundColor: '#F5F1E8',
        }}
      />

      <style jsx>{`
        ${HERO_IMAGES.map((_, i) => {
          const dir = KB_DIRECTIONS[i % KB_DIRECTIONS.length];
          return `
            @keyframes kb-${i} {
              0%   { transform: ${dir.from}; }
              100% { transform: ${dir.to}; }
            }
          `;
        }).join('')}

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-400 { animation-delay: 0.4s; }
      `}</style>
    </section>
  );
}

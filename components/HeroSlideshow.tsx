'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

// Each slide gets a unique Ken Burns direction
const KB_DIRECTIONS = [
  { startTransform: 'scale(1) translate(0%, 0%)',       endTransform: 'scale(1.15) translate(-3%, -3%)' },
  { startTransform: 'scale(1.12) translate(-2%, 2%)',   endTransform: 'scale(1) translate(1%, -1%)' },
  { startTransform: 'scale(1) translate(0%, 0%)',       endTransform: 'scale(1.12) translate(3%, -2%)' },
  { startTransform: 'scale(1.1) translate(2%, 2%)',     endTransform: 'scale(1) translate(-1%, 0%)' },
  { startTransform: 'scale(1) translate(-2%, 0%)',      endTransform: 'scale(1.15) translate(2%, -3%)' },
];

const SLIDE_DURATION = 6000;  // Time each slide is shown
const FADE_DURATION = 2000;   // Crossfade duration in ms
const KB_DURATION = 10000;    // Ken Burns pan duration in ms

export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  // Each slide gets its own opacity and transform, managed independently
  const [slides, setSlides] = useState(() =>
    HERO_IMAGES.map((_, i) => ({
      opacity: i === 0 ? 1 : 0,
      transform: KB_DIRECTIONS[i].startTransform,
      zIndex: i === 0 ? 2 : 1,
      // Ken Burns: transition the transform over KB_DURATION
      transitioning: i === 0,
    }))
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeRef = useRef(0);

  const goTo = useCallback((nextIndex: number) => {
    if (nextIndex === activeRef.current) return;
    const prevIndex = activeRef.current;
    activeRef.current = nextIndex;
    setActiveIndex(nextIndex);

    setSlides((prev) =>
      prev.map((slide, i) => {
        if (i === nextIndex) {
          // Incoming slide: reset transform to start, then we'll kick off Ken Burns
          return {
            opacity: 0,
            transform: KB_DIRECTIONS[i].startTransform,
            zIndex: 3, // On top during fade
            transitioning: false,
          };
        }
        if (i === prevIndex) {
          // Outgoing slide: keep its current state, just ensure it's behind
          return { ...slide, zIndex: 2 };
        }
        // All others: hidden
        return { ...slide, opacity: 0, zIndex: 1 };
      })
    );

    // After a frame, start the fade-in AND Ken Burns on the new slide
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSlides((prev) =>
          prev.map((slide, i) => {
            if (i === nextIndex) {
              return {
                opacity: 1,
                transform: KB_DIRECTIONS[i].endTransform,
                zIndex: 3,
                transitioning: true,
              };
            }
            return slide;
          })
        );
      });
    });

    // After fade completes, clean up the old slide
    setTimeout(() => {
      setSlides((prev) =>
        prev.map((slide, i) => {
          if (i === prevIndex) {
            return {
              opacity: 0,
              transform: KB_DIRECTIONS[i].startTransform,
              zIndex: 1,
              transitioning: false,
            };
          }
          if (i === nextIndex) {
            return { ...slide, zIndex: 2 };
          }
          return slide;
        })
      );
    }, FADE_DURATION + 100);
  }, []);

  // Start Ken Burns on the first slide immediately
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSlides((prev) =>
          prev.map((slide, i) => {
            if (i === 0) {
              return {
                ...slide,
                transform: KB_DIRECTIONS[0].endTransform,
                transitioning: true,
              };
            }
            return slide;
          })
        );
      });
    });
  }, []);

  // Auto-advance
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const next = (activeRef.current + 1) % HERO_IMAGES.length;
      goTo(next);
    }, SLIDE_DURATION);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goTo]);

  const handleIndicatorClick = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    goTo(index);
    intervalRef.current = setInterval(() => {
      const next = (activeRef.current + 1) % HERO_IMAGES.length;
      goTo(next);
    }, SLIDE_DURATION);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 w-full h-full">
        {HERO_IMAGES.map((image, index) => {
          const slide = slides[index];
          return (
            <div
              key={image}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: slide.opacity,
                zIndex: slide.zIndex,
                transition: `opacity ${FADE_DURATION}ms ease-in-out`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: slide.transform,
                  transition: slide.transitioning
                    ? `transform ${KB_DURATION}ms ease-out`
                    : 'none',
                }}
              >
                <Image
                  src={image}
                  alt={`Luxury Mexican property ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                  quality={90}
                />
              </div>
            </div>
          );
        })}

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.3))',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 hero-fade-in backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(232, 238, 244, 0.9)',
              color: '#2C4563',
              animationDelay: '0s',
            }}
          >
            <span className="text-sm font-semibold uppercase tracking-wide">
              🇺🇸 Built for American & Canadian Buyers
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 hero-fade-in text-white drop-shadow-2xl"
            style={{ animationDelay: '0.1s' }}
          >
            Find Your Dream Home in{' '}
            <span style={{ color: '#C85A3E' }}>Mexico</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl hero-fade-in drop-shadow-lg"
            style={{ animationDelay: '0.2s' }}
          >
            The trusted platform connecting American buyers with verified
            Mexican real estate agents. From beachfront condos to colonial
            homes, find your perfect property with expert guidance.
          </p>

          {/* Search Box */}
          <div
            className="bg-white rounded-2xl p-2 shadow-2xl hero-fade-in backdrop-blur-sm"
            style={{ animationDelay: '0.3s' }}
          >
            <SearchAutocomplete
              variant="hero"
              placeholder="Search by city, state, or neighborhood..."
            />
          </div>

          {/* Quick Stats */}
          <div
            className="mt-8 flex flex-wrap gap-6 hero-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
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
            onClick={() => handleIndicatorClick(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex
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

      {/* Minimal global styles - only for the page-load fade-in animation */}
      <style jsx global>{`
        @keyframes heroFadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hero-fade-in {
          animation: heroFadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}

'use client';

import PropertyCard from './PropertyCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Property } from '@/lib/supabase';

type Props = {
  properties: Property[];
};

export default function FeaturedCarousel({ properties }: Props) {
  return (
    <>
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section className="relative -mt-8 pt-4 pb-20 px-4 sm:px-6 lg:px-8" style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        backgroundImage: `
          linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%),
          repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.02) 2px, rgba(255,255,255,.02) 4px),
          repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(255,255,255,.01) 2px, rgba(255,255,255,.01) 4px)
        `
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Featured <span className="text-secondary">properties</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto">
              Handpicked homes from our most trusted agents
            </p>
          </div>

          {/* Infinite Carousel */}
          <div className="overflow-hidden relative">
            <div className="flex gap-6 animate-scroll">
              {/* Duplicate properties for seamless loop */}
              {[...properties, ...properties].map((property, index) => (
                <div key={`${property.id}-${index}`} className="flex-shrink-0 w-[300px]">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/properties?featured=true"
              className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all"
            >
              View All Featured Properties
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

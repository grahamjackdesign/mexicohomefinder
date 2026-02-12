'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Square, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '@/lib/supabase';
import NewListingBadge from './NewListingBadge';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';

interface PropertyCardProps {
  property: Property;
  onHover?: (property: Property | null) => void;
  displayCurrency?: 'USD' | 'MXN';
}

export default function PropertyCard({ property, onHover, displayCurrency = 'USD' }: PropertyCardProps) {
  const { convertPrice } = useCurrencyConversion();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images || [];
  const hasMultipleImages = images.length > 1;
  
  const formatPrice = (price: number, propertyCurrency?: string) => {
    // Determine what currency the price is stored in
    const storedCurrency = propertyCurrency || 'USD';
    
    // Convert price using live exchange rates
    const displayPrice = convertPrice(price, storedCurrency, displayCurrency);
    
    const currencyLabel = displayCurrency === 'MXN' ? 'MXN' : 'USD';
    
    // Format with commas and no decimals
    const formattedNumber = Math.round(displayPrice).toLocaleString('en-US');
    
    // Add /month for rentals
    const suffix = property.listing_type === 'rent' ? '/month' : '';
    
    return `$${formattedNumber} ${currencyLabel}${suffix}`;
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setCurrentImageIndex(index);
  };

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      e.preventDefault();
      if (diff > 0) {
        // Swiped left - next image
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        // Swiped right - previous image
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => onHover?.(property)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image Container with Carousel */}
      <div
        className="relative aspect-[4/3] overflow-hidden bg-gray-100 group/carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 0 ? (
          <>
            <Image
              src={images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Navigation Arrows - Only show if multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-70 sm:opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-70 sm:opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => handleDotClick(e, index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'bg-white w-6'
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <MapPin className="w-12 h-12" />
          </div>
        )}

        {/* Top Left - Listing Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full text-white shadow-md ${
              property.listing_type === 'sale'
                ? 'bg-green-600'
                : 'bg-blue-600'
            }`}
          >
            {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>

        {/* Top Right - Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md">
              Featured
            </span>
          </div>
        )}

        {/* Bottom Left - New Listing Badge */}
        {property.created_at && (
          <div className="absolute bottom-3 left-3">
            <NewListingBadge createdAt={property.created_at} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <div className="text-2xl font-bold text-primary mb-2">
          {formatPrice(property.price, property.currency)}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        {(property.neighborhood || property.municipality) && (
          <div className="flex items-start gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">
              {property.neighborhood && `${property.neighborhood}, `}
              {property.municipality}
            </span>
          </div>
        )}

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-100">
          {property.bedrooms !== undefined && property.bedrooms !== null && (
            <span className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms !== undefined && property.bathrooms !== null && (
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              {property.bathrooms}
            </span>
          )}
          {property.sqft && (
            <span className="flex items-center gap-1.5">
              <Square className="w-4 h-4" />
              {property.sqft.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

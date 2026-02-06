'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
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

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => onHover?.(property)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {property.images?.[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
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

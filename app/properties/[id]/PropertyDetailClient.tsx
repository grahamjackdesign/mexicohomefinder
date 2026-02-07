'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/lib/supabase';
import PropertyCard from '@/components/PropertyCard';
import LeadForm from '@/components/LeadForm';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Bed,
  Bath,
  Square,
  Car,
  MapPin,
  Calendar,
  Home,
  Dumbbell,
  Waves,
  Dog,
  Shield,
  Building2,
  X,
} from 'lucide-react';

type Props = {
  property: Property;
  similarProperties: Property[];
};

export default function PropertyDetailClient({
  property,
  similarProperties,
}: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const images = property.images || [];
  const hasMultipleImages = images.length > 1;

  const formatPrice = (price: number, currency?: string) => {
    const currencyLabel = currency === 'MXN' ? 'MXN' : 'USD';
    return `$${price.toLocaleString('en-US')} ${currencyLabel}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Amenities list
  const amenities = [
    { key: 'has_pool', label: 'Pool', icon: Waves },
    { key: 'has_gym', label: 'Gym', icon: Dumbbell },
    { key: 'has_spa', label: 'Spa', icon: Waves },
    { key: 'has_jacuzzi', label: 'Jacuzzi', icon: Waves },
    { key: 'has_24_7_security', label: '24/7 Security', icon: Shield },
    { key: 'has_elevator', label: 'Elevator', icon: Building2 },
    { key: 'has_bbq_area', label: 'BBQ Area', icon: Home },
    { key: 'has_event_room', label: 'Event Room', icon: Building2 },
    { key: 'has_covered_parking', label: 'Covered Parking', icon: Car },
    { key: 'has_storage', label: 'Storage', icon: Home },
    { key: 'has_laundry', label: 'Laundry', icon: Home },
    { key: 'pets_allowed', label: 'Pets Allowed', icon: Dog },
  ];

  const activeAmenities = amenities.filter(
    (a) => property[a.key as keyof Property]
  );

  return (
    <>
      {/* Image Gallery */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-2 h-[500px] p-4">
            {/* Main Image */}
            <div
              className="col-span-2 row-span-2 relative rounded-l-2xl overflow-hidden cursor-pointer group"
              onClick={() => setShowGallery(true)}
            >
              {images[0] && (
                <Image
                  src={images[0]}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Side Images */}
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`relative overflow-hidden cursor-pointer group ${
                  index === 2 ? 'rounded-tr-2xl' : ''
                } ${index === 4 ? 'rounded-br-2xl' : ''}`}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setShowGallery(true);
                }}
              >
                {images[index] ? (
                  <Image
                    src={images[index]}
                    alt={`${property.title} - Image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Home className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                {index === 4 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{images.length - 5} photos
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: Carousel */}
          <div className="md:hidden relative h-80">
            {images[currentImageIndex] && (
              <Image
                src={images[currentImageIndex]}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
            )}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-lg text-white ${
                      property.listing_type === 'sale'
                        ? 'bg-green-600'
                        : 'bg-blue-600'
                    }`}
                  >
                    {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                  </span>
                  {property.featured && (
                    <span className="px-3 py-1 text-sm font-bold rounded-lg bg-yellow-400 text-yellow-900">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-2">
                  {property.title}
                </h1>
                {(property.neighborhood || property.municipality) && (
                  <p className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    {property.neighborhood || property.municipality}
                    {property.state && `, ${property.state}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-8">
              {formatPrice(property.price, property.currency)}
              {property.listing_type === 'rent' && (
                <span className="text-lg text-gray-500 font-normal">/month</span>
              )}
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap gap-6 p-6 bg-gray-50 rounded-2xl mb-8">
              {property.bedrooms !== undefined && property.bedrooms !== null && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Bed className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">
                      {property.bedrooms}
                    </div>
                    <div className="text-sm text-gray-500">Bedrooms</div>
                  </div>
                </div>
              )}
              {property.bathrooms !== undefined && property.bathrooms !== null && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Bath className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">
                      {property.bathrooms}
                    </div>
                    <div className="text-sm text-gray-500">Bathrooms</div>
                  </div>
                </div>
              )}
              {property.sqft && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Square className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">
                      {property.sqft.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Sq M</div>
                  </div>
                </div>
              )}
              {property.parking && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Car className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">
                      {property.parking}
                    </div>
                    <div className="text-sm text-gray-500">Parking</div>
                  </div>
                </div>
              )}
              {property.year_construction && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">
                      {property.year_construction}
                    </div>
                    <div className="text-sm text-gray-500">Year Built</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="text-xl font-display font-bold text-primary mb-4">
                  About This Property
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                    {property.description}
                  </p>
                </div>
              </div>
            )}

            {/* Amenities */}
            {activeAmenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-display font-bold text-primary mb-4">
                  Amenities & Features
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {activeAmenities.map((amenity) => (
                    <div
                      key={amenity.key}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <amenity.icon className="w-5 h-5 text-secondary" />
                      <span className="text-gray-700">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {property.latitude && property.longitude && (
              <div className="mb-8">
                <h2 className="text-xl font-display font-bold text-primary mb-4">
                  Location
                </h2>
                <div className="h-80 rounded-2xl overflow-hidden bg-gray-100">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${property.latitude},${property.longitude}&zoom=15`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Lead Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LeadForm property={property} />
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-display font-bold text-primary mb-8">
              Similar Properties
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fullscreen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="absolute top-4 left-4 z-10 text-white">
            {currentImageIndex + 1} / {images.length}
          </div>
          <div className="h-full flex items-center justify-center p-4">
            <button
              onClick={prevImage}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            {images[currentImageIndex] && (
              <Image
                src={images[currentImageIndex]}
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                width={1200}
                height={800}
                className="max-h-[90vh] w-auto object-contain"
              />
            )}
            <button
              onClick={nextImage}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </div>
          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                  index === currentImageIndex
                    ? 'ring-2 ring-secondary'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useCallback, useState, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Property } from '@/lib/supabase';
import Link from 'next/link';
import { Bed, Bath, Square } from 'lucide-react';

type Props = {
  properties: Property[];
  hoveredProperty: Property | null;
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Default center (Mexico)
const defaultCenter = {
  lat: 21.1619,
  lng: -100.9314, // San Miguel de Allende area
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export default function PropertyMap({ properties, hoveredProperty }: Props) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // Calculate map center based on properties
  const center = useMemo(() => {
    if (properties.length === 0) return defaultCenter;

    const avgLat =
      properties.reduce((sum, p) => sum + (p.latitude || 0), 0) /
      properties.length;
    const avgLng =
      properties.reduce((sum, p) => sum + (p.longitude || 0), 0) /
      properties.length;

    return { lat: avgLat, lng: avgLng };
  }, [properties]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);

      // Fit bounds to show all markers
      if (properties.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        properties.forEach((property) => {
          if (property.latitude && property.longitude) {
            bounds.extend({
              lat: property.latitude,
              lng: property.longitude,
            });
          }
        });
        map.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        });
      }
    },
    [properties]
  );

  // Re-fit bounds when filtered properties change
  useEffect(() => {
    if (!map) return;

    if (properties.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      properties.forEach((property) => {
        if (property.latitude && property.longitude) {
          bounds.extend({
            lat: property.latitude,
            lng: property.longitude,
          });
        }
      });
      map.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    } else {
      // No properties — reset to default Mexico view
      map.setCenter(defaultCenter);
      map.setZoom(5);
    }
  }, [map, properties]);

  const formatPrice = (price: number, currency?: string) => {
    const currencyLabel = currency === 'MXN' ? 'MXN' : 'USD';
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M ${currencyLabel}`;
    }
    return `$${(price / 1000).toFixed(0)}k ${currencyLabel}`;
  };

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-500">Error loading map</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      options={mapOptions}
    >
      {properties.map((property) => {
        if (!property.latitude || !property.longitude) return null;

        const isHovered = hoveredProperty?.id === property.id;
        const isSelected = selectedProperty?.id === property.id;

        return (
          <MarkerF
            key={property.id}
            position={{
              lat: property.latitude,
              lng: property.longitude,
            }}
            onClick={() => setSelectedProperty(property)}
            icon={{
              url: property.listing_type === 'rent' ? '/MHF_pin_rent.png' : '/MHF_pin_sale.png',
              scaledSize: new google.maps.Size(
                isHovered || isSelected ? 55 : 40,
                isHovered || isSelected ? 56 : 41
              ),
              anchor: new google.maps.Point(
                isHovered || isSelected ? 27.5 : 20,
                isHovered || isSelected ? 56 : 41
              ),
            }}
            opacity={isHovered || isSelected ? 1 : 0.85}
            animation={isSelected ? google.maps.Animation.BOUNCE : undefined}
            zIndex={isHovered || isSelected ? 1000 : 1}
          />
        );
      })}

      {/* Info Window */}
      {selectedProperty &&
        selectedProperty.latitude &&
        selectedProperty.longitude && (
          <InfoWindowF
            position={{
              lat: selectedProperty.latitude,
              lng: selectedProperty.longitude,
            }}
            onCloseClick={() => setSelectedProperty(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -48),
            }}
          >
            <Link
              href={`/properties/${selectedProperty.id}`}
              className="block w-72 overflow-hidden"
            >
              {/* Image */}
              {selectedProperty.images?.[0] && (
                <div className="relative h-36 -mx-2 -mt-2 mb-3">
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded text-white ${
                        selectedProperty.listing_type === 'sale'
                          ? 'bg-green-600'
                          : 'bg-blue-600'
                      }`}
                    >
                      {selectedProperty.listing_type === 'sale'
                        ? 'For Sale'
                        : 'For Rent'}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="px-1">
                <div className="text-lg font-bold text-primary mb-1">
                  {formatPrice(selectedProperty.price, selectedProperty.currency)}
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-1">
                  {selectedProperty.title}
                </h3>
                {selectedProperty.neighborhood && (
                  <p className="text-xs text-gray-500 mb-2">
                    {selectedProperty.neighborhood}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  {selectedProperty.bedrooms !== undefined &&
                    selectedProperty.bedrooms !== null && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        {selectedProperty.bedrooms}
                      </span>
                    )}
                  {selectedProperty.bathrooms !== undefined &&
                    selectedProperty.bathrooms !== null && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3" />
                        {selectedProperty.bathrooms}
                      </span>
                    )}
                  {selectedProperty.sqft && (
                    <span className="flex items-center gap-1">
                      <Square className="w-3 h-3" />
                      {selectedProperty.sqft.toLocaleString()} m²
                    </span>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <span className="text-secondary font-medium text-sm">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          </InfoWindowF>
        )}
    </GoogleMap>
  );
}

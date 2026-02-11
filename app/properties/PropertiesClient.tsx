'use client';

import { useState, useCallback, useMemo } from 'react';
import { Property } from '@/lib/supabase';
import PropertyCard from '@/components/PropertyCard';
import PropertyMap from '@/components/PropertyMap';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  MapIcon,
  List,
  ChevronLeft,
  ChevronRight,
  Waves,
  Wind,
  PawPrint,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type SearchParams = {
  state?: string;
  municipality?: string;
  type?: string;
  listingType?: string;
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  baths?: string;
  featured?: string;
  page?: string;
  displayCurrency?: string;
  pool?: string;
  ac?: string;
  pets?: string;
  sort?: string;
};

type Props = {
  initialProperties: Property[];
  total: number;
  searchParams: SearchParams;
  availableStates: string[];
  availableMunicipalities: { state: string; municipality: string }[];
  allMapProperties?: Property[];
};

const LISTING_TYPES = [
  { value: '', label: 'All for Sale and Rent' },
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

const PROPERTY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'land', label: 'Land' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'villa', label: 'Villa' },
];

// Price ranges for USD - Sale
const PRICE_RANGES_USD_SALE = [
  { value: '', label: 'Any Price' },
  { value: '0-100000', label: 'Under $100k' },
  { value: '100000-250000', label: '$100k - $250k' },
  { value: '250000-500000', label: '$250k - $500k' },
  { value: '500000-1000000', label: '$500k - $1M' },
  { value: '1000000-2000000', label: '$1M - $2M' },
  { value: '2000000-', label: '$2M+' },
];

// Price ranges for USD - Rent
const PRICE_RANGES_USD_RENT = [
  { value: '', label: 'Any Price' },
  { value: '0-1000', label: 'Under $1,000' },
  { value: '1000-2000', label: '$1,000 - $2,000' },
  { value: '2000-3000', label: '$2,000 - $3,000' },
  { value: '3000-', label: '$3,000+' },
];

// Price ranges for MXN - Sale
const PRICE_RANGES_MXN_SALE = [
  { value: '', label: 'Any Price' },
  { value: '0-1000000', label: 'Under $1M' },
  { value: '1000000-3000000', label: '$1M - $3M' },
  { value: '3000000-5000000', label: '$3M - $5M' },
  { value: '5000000-', label: '$5M+' },
];

// Price ranges for MXN - Rent
const PRICE_RANGES_MXN_RENT = [
  { value: '', label: 'Any Price' },
  { value: '0-10000', label: 'Under $10,000' },
  { value: '10000-20000', label: '$10,000 - $20,000' },
  { value: '20000-30000', label: '$20,000 - $30,000' },
  { value: '30000-', label: '$30,000+' },
];

const BEDS_OPTIONS = [
  { value: '', label: 'Beds' },
  { value: '1', label: '1+ Beds' },
  { value: '2', label: '2+ Beds' },
  { value: '3', label: '3+ Beds' },
  { value: '4', label: '4+ Beds' },
  { value: '5', label: '5+ Beds' },
];

const BATHS_OPTIONS = [
  { value: '', label: 'Baths' },
  { value: '1', label: '1+ Baths' },
  { value: '2', label: '2+ Baths' },
  { value: '3', label: '3+ Baths' },
  { value: '4', label: '4+ Baths' },
];

export default function PropertiesClient({
  initialProperties,
  total,
  searchParams,
  availableStates,
  availableMunicipalities,
  allMapProperties,
}: Props) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  
  const [properties] = useState<Property[]>(initialProperties);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');

  // Currency display preference (default USD)
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'MXN'>(
    (searchParams.displayCurrency as 'USD' | 'MXN') || 'USD'
  );

  // Filter state
  const [selectedState, setSelectedState] = useState(searchParams.state || '');
  const [selectedMunicipality, setSelectedMunicipality] = useState(searchParams.municipality || '');
  const [listingType, setListingType] = useState(searchParams.listingType || '');
  const [propertyType, setPropertyType] = useState(searchParams.type || '');
  const [priceRange, setPriceRange] = useState(() => {
    if (searchParams.minPrice && searchParams.maxPrice) {
      return `${searchParams.minPrice}-${searchParams.maxPrice}`;
    }
    if (searchParams.minPrice) {
      return `${searchParams.minPrice}-`;
    }
    return '';
  });
  const [beds, setBeds] = useState(searchParams.beds || '');
  const [baths, setBaths] = useState(searchParams.baths || '');
  
  // Amenity filters
  const [hasPool, setHasPool] = useState(searchParams.pool === 'true');
  const [hasAC, setHasAC] = useState(searchParams.ac === 'true');
  const [petsAllowed, setPetsAllowed] = useState(searchParams.pets === 'true');

  // Sort state
  const [sortBy, setSortBy] = useState(searchParams.sort || 'featured');

  const currentPage = parseInt(searchParams.page || '1');
  const totalPages = Math.ceil(total / 20);

  // Properties with coordinates for map - use all properties if available, otherwise paginated
  const propertiesWithCoords = useMemo(
    () => (allMapProperties || properties).filter((p) => p.latitude && p.longitude),
    [allMapProperties, properties]
  );

  // Sort properties based on sortBy
  const sortedProperties = useMemo(() => {
    const sorted = [...properties];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = a.price || 0;
          const priceB = b.price || 0;
          return priceA - priceB;
        });
      
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = a.price || 0;
          const priceB = b.price || 0;
          return priceB - priceA;
        });
      
      case 'featured':
      default:
        // Featured first, then by created date
        return sorted.sort((a, b) => {
          if (a.featured === b.featured) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.featured ? -1 : 1;
        });
    }
  }, [properties, sortBy]);

  // Get municipalities filtered by selected state
  const filteredMunicipalities = useMemo(() => {
    if (!selectedState) {
      return availableMunicipalities;
    }
    return availableMunicipalities.filter(m => m.state === selectedState);
  }, [selectedState, availableMunicipalities]);

  // Get dynamic price ranges based on currency and listing type
  const priceRanges = useMemo(() => {
    if (displayCurrency === 'MXN') {
      return listingType === 'rent' ? PRICE_RANGES_MXN_RENT : PRICE_RANGES_MXN_SALE;
    } else {
      return listingType === 'rent' ? PRICE_RANGES_USD_RENT : PRICE_RANGES_USD_SALE;
    }
  }, [displayCurrency, listingType]);

  // Build URL params helper
  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedState) params.set('state', selectedState);
    if (selectedMunicipality) params.set('municipality', selectedMunicipality);
    if (listingType) params.set('listingType', listingType);
    if (propertyType) params.set('type', propertyType);
    params.set('displayCurrency', displayCurrency);
    if (beds) params.set('beds', beds);
    if (baths) params.set('baths', baths);
    if (hasPool) params.set('pool', 'true');
    if (hasAC) params.set('ac', 'true');
    if (petsAllowed) params.set('pets', 'true');
    if (sortBy && sortBy !== 'featured') params.set('sort', sortBy);
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    return params;
  }, [selectedState, selectedMunicipality, listingType, propertyType, displayCurrency, beds, baths, hasPool, hasAC, petsAllowed, sortBy, priceRange]);

  // Helper to build params with overrides
  const buildParamsWithOverrides = useCallback((overrides: Record<string, string | null>) => {
    const params = new URLSearchParams();
    
    const state = overrides.state !== undefined ? overrides.state : selectedState;
    const municipality = overrides.municipality !== undefined ? overrides.municipality : selectedMunicipality;
    const listing = overrides.listingType !== undefined ? overrides.listingType : listingType;
    const propType = overrides.type !== undefined ? overrides.type : propertyType;
    const currency = overrides.displayCurrency !== undefined ? overrides.displayCurrency : displayCurrency;
    const bedsVal = overrides.beds !== undefined ? overrides.beds : beds;
    const bathsVal = overrides.baths !== undefined ? overrides.baths : baths;
    const minPrice = overrides.minPrice !== undefined ? overrides.minPrice : (priceRange ? priceRange.split('-')[0] : null);
    const maxPrice = overrides.maxPrice !== undefined ? overrides.maxPrice : (priceRange ? priceRange.split('-')[1] : null);
    
    if (state) params.set('state', state);
    if (municipality) params.set('municipality', municipality);
    if (listing) params.set('listingType', listing);
    if (propType) params.set('type', propType);
    if (currency) params.set('displayCurrency', currency);
    if (bedsVal) params.set('beds', bedsVal);
    if (bathsVal) params.set('baths', bathsVal);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (hasPool) params.set('pool', 'true');
    if (hasAC) params.set('ac', 'true');
    if (petsAllowed) params.set('pets', 'true');
    
    return params;
  }, [selectedState, selectedMunicipality, listingType, propertyType, displayCurrency, beds, baths, priceRange, hasPool, hasAC, petsAllowed]);

  // Navigate with full page reload to trigger server re-fetch
  const navigateWithRefresh = useCallback((params: URLSearchParams) => {
    window.location.href = `/properties?${params.toString()}`;
  }, []);

  // Apply filters and navigate
  const applyFilters = useCallback(() => {
    const params = buildParams();
    navigateWithRefresh(params);
    setShowFilters(false);
  }, [buildParams, navigateWithRefresh]);

  // Handle state change
  const handleStateChange = useCallback((newState: string) => {
    setSelectedState(newState);
    setSelectedMunicipality('');
    const params = buildParamsWithOverrides({ state: newState || null, municipality: null });
    navigateWithRefresh(params);
  }, [buildParamsWithOverrides, navigateWithRefresh]);

  // Handle municipality change
  const handleMunicipalityChange = useCallback((newMunicipality: string) => {
    setSelectedMunicipality(newMunicipality);
    const params = buildParamsWithOverrides({ municipality: newMunicipality || null });
    navigateWithRefresh(params);
  }, [buildParamsWithOverrides, navigateWithRefresh]);

  // Handle listing type change
  const handleListingTypeChange = useCallback((newListingType: string) => {
    setListingType(newListingType);
    setPriceRange('');
    const params = buildParamsWithOverrides({ listingType: newListingType || null, minPrice: null, maxPrice: null });
    navigateWithRefresh(params);
  }, [buildParamsWithOverrides, navigateWithRefresh]);

  // Handle price change
  const handlePriceChange = useCallback((newPriceRange: string) => {
    setPriceRange(newPriceRange);
    let minPrice: string | null = null;
    let maxPrice: string | null = null;
    if (newPriceRange) {
      const [min, max] = newPriceRange.split('-');
      minPrice = min || null;
      maxPrice = max || null;
    }
    const params = buildParamsWithOverrides({ minPrice, maxPrice });
    navigateWithRefresh(params);
  }, [buildParamsWithOverrides, navigateWithRefresh]);

  // Handle currency change
  const handleCurrencyChange = useCallback((newCurrency: 'USD' | 'MXN') => {
  setDisplayCurrency(newCurrency);
  setPriceRange(''); // Clear price range when currency changes
  // Don't navigate - just update state!
  // The PropertyCards will re-render instantly with new currency
}, []);

  // Handle beds change
  const handleBedsChange = useCallback((newBeds: string) => {
    setBeds(newBeds);
    const params = buildParamsWithOverrides({ beds: newBeds || null });
    navigateWithRefresh(params);
  }, [buildParamsWithOverrides, navigateWithRefresh]);

  // Handle baths change
  const handleBathsChange = useCallback((newBaths: string) => {
    setBaths(newBaths);
    const params = buildParamsWithOverrides({ baths: newBaths || null });
    navigateWithRefresh(params);
  }, [buildParamsWithOverrides, navigateWithRefresh]);

  // Handle property type change
  const handlePropertyTypeChange = useCallback((newType: string) => {
    setPropertyType(newType);
    const params = buildParamsWithOverrides({ type: newType || null });
    navigateWithRefresh(params);
  }, [buildParamsWithOverrides, navigateWithRefresh]);

  const clearFilters = useCallback(() => {
    setSelectedState('');
    setSelectedMunicipality('');
    setListingType('rent');
    setPropertyType('');
    setPriceRange('');
    setBeds('');
    setBaths('');
    setHasPool(false);
    setHasAC(false);
    setPetsAllowed(false);
    window.location.href = `/properties?displayCurrency=${displayCurrency}`;
  }, [displayCurrency]);

  const activeFilterCount = [
    selectedState,
    selectedMunicipality,
    listingType,
    propertyType,
    priceRange,
    beds,
    baths,
    hasPool,
    hasAC,
    petsAllowed,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    params.set('page', page.toString());
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search Bar & Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-screen-2xl mx-auto">
          {/* Top Row: Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Currency Toggle */}
            <div className="relative">
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5 group">
                <button
                  onClick={() => handleCurrencyChange('USD')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    displayCurrency === 'USD'
                      ? 'bg-white text-secondary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  USD
                </button>
                <button
                  onClick={() => handleCurrencyChange('MXN')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    displayCurrency === 'MXN'
                      ? 'bg-white text-secondary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  MXN
                </button>
              </div>
              {/* Tooltip */}
              <span className="invisible group-hover:visible absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                Currency conversions are updated daily
              </span>
            </div>

            {/* State Dropdown */}
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white min-w-[140px]"
            >
              <option value="">All States</option>
              {availableStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            {/* Municipality Dropdown */}
            <select
              value={selectedMunicipality}
              onChange={(e) => handleMunicipalityChange(e.target.value)}
              className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white min-w-[160px]"
              disabled={filteredMunicipalities.length === 0}
            >
              <option value="">All Municipalities</option>
              {filteredMunicipalities.map((m) => (
                <option key={`${m.state}-${m.municipality}`} value={m.municipality}>
                  {m.municipality}
                </option>
              ))}
            </select>

            {/* Listing Type */}
            <select
              value={listingType}
              onChange={(e) => handleListingTypeChange(e.target.value)}
              className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white min-w-[180px]"
            >
              {LISTING_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Price */}
            <select
              value={priceRange}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            {/* Beds - Desktop */}
            <select
              value={beds}
              onChange={(e) => handleBedsChange(e.target.value)}
              className="hidden md:block py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white"
            >
              {BEDS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Baths - Desktop */}
            <select
              value={baths}
              onChange={(e) => handleBathsChange(e.target.value)}
              className="hidden md:block py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white"
            >
              {BATHS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Property Type - Desktop */}
            <select
              value={propertyType}
              onChange={(e) => handlePropertyTypeChange(e.target.value)}
              className="hidden lg:block py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* More Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 py-2 px-3 border rounded-lg text-sm font-medium transition-colors ${
                showFilters || activeFilterCount > 0
                  ? 'border-secondary bg-secondary/5 text-secondary'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">More</span>
              {activeFilterCount > 0 && (
                <span className="bg-secondary text-white text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Expanded Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {/* Mobile-only filters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:hidden">
                {/* Property Type (Mobile/Tablet) */}
                <div className="lg:hidden">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => handlePropertyTypeChange(e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm"
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Beds (Mobile) */}
                <div className="md:hidden">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Bedrooms
                  </label>
                  <select
                    value={beds}
                    onChange={(e) => handleBedsChange(e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm"
                  >
                    {BEDS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bathrooms (Mobile) */}
                <div className="md:hidden">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Bathrooms
                  </label>
                  <select
                    value={baths}
                    onChange={(e) => handleBathsChange(e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm"
                  >
                    {BATHS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amenities Toggle */}
              <button
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="mt-4 flex items-center gap-2 text-sm text-secondary font-medium hover:text-secondary-dark"
              >
                {showMoreFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                Amenities & Features
              </button>

              {/* Amenities Grid */}
              {showMoreFilters && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Pool */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasPool}
                        onChange={(e) => setHasPool(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                      />
                      <Waves className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Pool</span>
                    </label>

                    {/* AC */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasAC}
                        onChange={(e) => setHasAC(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                      />
                      <Wind className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">A/C</span>
                    </label>

                    {/* Pets Allowed */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={petsAllowed}
                        onChange={(e) => setPetsAllowed(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                      />
                      <PawPrint className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Pets OK</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={applyFilters}
                  className="py-2 px-6 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-dark transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-primary">
              {selectedMunicipality
                ? `Homes in ${selectedMunicipality}`
                : selectedState
                ? `Homes in ${selectedState}`
                : listingType === 'rent'
                ? 'Homes for rent in Mexico'
                : listingType === 'sale'
                ? 'Homes for sale in Mexico'
                : 'Homes in Mexico'}
            </h1>
            <p className="text-sm text-gray-500">
              {total.toLocaleString()} properties available
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* View Mode Toggle (Desktop) */}
            <div className="hidden md:flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded ${
                  viewMode === 'split' ? 'bg-secondary text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
                title="Split view"
              >
                <div className="w-4 h-4 flex gap-0.5">
                  <div className="w-1.5 h-full bg-current rounded-sm" />
                  <div className="flex-1 bg-current rounded-sm" />
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list' ? 'bg-secondary text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded ${
                  viewMode === 'map' ? 'bg-secondary text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
                title="Map view"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hidden sm:inline">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const params = buildParams();
                  if (e.target.value && e.target.value !== 'featured') {
                    params.set('sort', e.target.value);
                  }
                  router.push(`/properties?${params.toString()}`);
                }}
                className="border-none bg-transparent focus:outline-none font-medium text-gray-700 cursor-pointer text-sm"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Property List */}
        <div
          className={`${
            viewMode === 'map'
              ? 'hidden'
              : viewMode === 'list'
              ? 'w-full'
              : 'w-full lg:w-1/2 xl:w-[45%]'
          } overflow-y-auto`}
        >
          <div className="p-4">
            {sortedProperties.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h2>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-4 ${
                    viewMode === 'list'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  }`}
                >
                  {sortedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onHover={setHoveredProperty}
                      displayCurrency={displayCurrency}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page: number;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium ${
                            currentPage === page
                              ? 'bg-secondary text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Map */}
        {viewMode !== 'list' && (
          <div
            className={`${
              viewMode === 'map'
                ? 'w-full'
                : 'hidden lg:block lg:w-1/2 xl:w-[55%]'
            } relative bg-gray-100`}
          >
            <PropertyMap
              properties={propertiesWithCoords}
              hoveredProperty={hoveredProperty}
            />
          </div>
        )}
      </div>
    </div>
  );
}

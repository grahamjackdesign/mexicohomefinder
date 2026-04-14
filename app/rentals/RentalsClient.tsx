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
  Sofa,
  Zap,
  Clock,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type SearchParams = {
  state?: string;
  municipality?: string;
  type?: string;
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
  furnished?: string;
  servicesIncluded?: string;
  contractLength?: string;
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

const PROPERTY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'villa', label: 'Villa' },
];

const CONTRACT_LENGTHS = [
  { value: '', label: 'Any Contract' },
  { value: '1 year', label: '1 Year' },
  { value: '6 months', label: '6 Months' },
  { value: 'flexible', label: 'Flexible' },
];

// Price ranges for USD - Rent
const PRICE_RANGES_USD = [
  { value: '', label: 'Any Price' },
  { value: '0-1000', label: 'Under $1,000/mo' },
  { value: '1000-2000', label: '$1,000 – $2,000' },
  { value: '2000-3000', label: '$2,000 – $3,000' },
  { value: '3000-5000', label: '$3,000 – $5,000' },
  { value: '5000-', label: '$5,000+' },
];

// Price ranges for MXN - Rent
const PRICE_RANGES_MXN = [
  { value: '', label: 'Any Price' },
  { value: '0-10000', label: 'Under $10,000/mo' },
  { value: '10000-20000', label: '$10,000 – $20,000' },
  { value: '20000-35000', label: '$20,000 – $35,000' },
  { value: '35000-60000', label: '$35,000 – $60,000' },
  { value: '60000-', label: '$60,000+' },
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

export default function RentalsClient({
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

  // Rental-specific filters
  const [isFurnished, setIsFurnished] = useState(searchParams.furnished === 'true');
  const [servicesIncluded, setServicesIncluded] = useState(searchParams.servicesIncluded === 'true');
  const [contractLength, setContractLength] = useState(searchParams.contractLength || '');

  // Sort state
  const [sortBy, setSortBy] = useState(searchParams.sort || 'featured');

  const currentPage = parseInt(searchParams.page || '1');
  const totalPages = Math.ceil(total / 20);

  // Price ranges based on currency
  const priceRanges = displayCurrency === 'MXN' ? PRICE_RANGES_MXN : PRICE_RANGES_USD;

  // Properties with coordinates for map
  const propertiesWithCoords = useMemo(() => {
    let mapProps = allMapProperties || properties;

    // Always filter to rentals only
    mapProps = mapProps.filter((p: any) => p.listing_type === 'rent');

    if (searchParams.type) {
      mapProps = mapProps.filter((p: any) => p.property_category === searchParams.type);
    }
    if (searchParams.state) {
      mapProps = mapProps.filter((p: any) => p.state === searchParams.state);
    }
    if (searchParams.municipality) {
      mapProps = mapProps.filter((p: any) => p.municipality === searchParams.municipality);
    }
    if (searchParams.beds) {
      const minBeds = parseInt(searchParams.beds);
      mapProps = mapProps.filter((p: any) => p.bedrooms >= minBeds);
    }
    if (searchParams.baths) {
      const minBaths = parseInt(searchParams.baths);
      mapProps = mapProps.filter((p: any) => p.bathrooms >= minBaths);
    }
    if (searchParams.minPrice || searchParams.maxPrice) {
      const priceField = searchParams.displayCurrency === 'MXN' ? 'price_mxn' : 'price_usd';
      if (searchParams.minPrice) {
        const min = parseInt(searchParams.minPrice);
        mapProps = mapProps.filter((p: any) => (p[priceField] || 0) >= min);
      }
      if (searchParams.maxPrice) {
        const max = parseInt(searchParams.maxPrice);
        mapProps = mapProps.filter((p: any) => (p[priceField] || 0) <= max);
      }
    }
    if (searchParams.pool === 'true') {
      mapProps = mapProps.filter((p: any) => p.has_pool === true);
    }
    if (searchParams.ac === 'true') {
      mapProps = mapProps.filter((p: any) => p.has_ac === true);
    }
    if (searchParams.pets === 'true') {
      mapProps = mapProps.filter((p: any) => p.pets_allowed === true);
    }
    if (searchParams.furnished === 'true') {
      mapProps = mapProps.filter((p: any) => p.is_furnished === true);
    }
    if (searchParams.servicesIncluded === 'true') {
      mapProps = mapProps.filter((p: any) => p.services_included === true);
    }
    if (searchParams.contractLength) {
      mapProps = mapProps.filter((p: any) => p.length_of_contract === searchParams.contractLength);
    }
    if (searchParams.featured === 'true') {
      mapProps = mapProps.filter((p: any) => p.featured === true);
    }

    return mapProps.filter((p) => p.latitude && p.longitude);
  }, [allMapProperties, properties, searchParams]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    const sorted = [...properties];
    switch (sortBy) {
      case 'newest':
        return sorted.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'price-asc':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-desc':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'featured':
      default:
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
    if (!selectedState) return availableMunicipalities;
    return availableMunicipalities.filter((m) => m.state === selectedState);
  }, [selectedState, availableMunicipalities]);

  // Build URL params helper
  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedState) params.set('state', selectedState);
    if (selectedMunicipality) params.set('municipality', selectedMunicipality);
    if (propertyType) params.set('type', propertyType);
    params.set('displayCurrency', displayCurrency);
    if (beds) params.set('beds', beds);
    if (baths) params.set('baths', baths);
    if (hasPool) params.set('pool', 'true');
    if (hasAC) params.set('ac', 'true');
    if (petsAllowed) params.set('pets', 'true');
    if (isFurnished) params.set('furnished', 'true');
    if (servicesIncluded) params.set('servicesIncluded', 'true');
    if (contractLength) params.set('contractLength', contractLength);
    if (sortBy && sortBy !== 'featured') params.set('sort', sortBy);
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    return params;
  }, [
    selectedState,
    selectedMunicipality,
    propertyType,
    displayCurrency,
    beds,
    baths,
    hasPool,
    hasAC,
    petsAllowed,
    isFurnished,
    servicesIncluded,
    contractLength,
    sortBy,
    priceRange,
  ]);

  // Helper to build params with overrides
  const buildParamsWithOverrides = useCallback(
    (overrides: Record<string, string | null>) => {
      const params = new URLSearchParams();

      const state = overrides.state !== undefined ? overrides.state : selectedState;
      const municipality =
        overrides.municipality !== undefined ? overrides.municipality : selectedMunicipality;
      const propType = overrides.type !== undefined ? overrides.type : propertyType;
      const currency =
        overrides.displayCurrency !== undefined ? overrides.displayCurrency : displayCurrency;
      const bedsVal = overrides.beds !== undefined ? overrides.beds : beds;
      const bathsVal = overrides.baths !== undefined ? overrides.baths : baths;
      const minPrice =
        overrides.minPrice !== undefined
          ? overrides.minPrice
          : priceRange
          ? priceRange.split('-')[0]
          : null;
      const maxPrice =
        overrides.maxPrice !== undefined
          ? overrides.maxPrice
          : priceRange
          ? priceRange.split('-')[1]
          : null;
      const contractVal =
        overrides.contractLength !== undefined ? overrides.contractLength : contractLength;

      if (state) params.set('state', state);
      if (municipality) params.set('municipality', municipality);
      if (propType) params.set('type', propType);
      if (currency) params.set('displayCurrency', currency);
      if (bedsVal) params.set('beds', bedsVal);
      if (bathsVal) params.set('baths', bathsVal);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (hasPool) params.set('pool', 'true');
      if (hasAC) params.set('ac', 'true');
      if (petsAllowed) params.set('pets', 'true');
      if (isFurnished) params.set('furnished', 'true');
      if (servicesIncluded) params.set('servicesIncluded', 'true');
      if (contractVal) params.set('contractLength', contractVal);

      return params;
    },
    [
      selectedState,
      selectedMunicipality,
      propertyType,
      displayCurrency,
      beds,
      baths,
      priceRange,
      hasPool,
      hasAC,
      petsAllowed,
      isFurnished,
      servicesIncluded,
      contractLength,
    ]
  );

  const navigateWithRefresh = useCallback((params: URLSearchParams) => {
    window.location.href = `/rentals?${params.toString()}`;
  }, []);

  const applyFilters = useCallback(() => {
    const params = buildParams();
    navigateWithRefresh(params);
    setShowFilters(false);
  }, [buildParams, navigateWithRefresh]);

  const handleStateChange = useCallback(
    (newState: string) => {
      setSelectedState(newState);
      setSelectedMunicipality('');
      const params = buildParamsWithOverrides({ state: newState || null, municipality: null });
      navigateWithRefresh(params);
    },
    [buildParamsWithOverrides, navigateWithRefresh]
  );

  const handleMunicipalityChange = useCallback(
    (newMunicipality: string) => {
      setSelectedMunicipality(newMunicipality);
      const params = buildParamsWithOverrides({ municipality: newMunicipality || null });
      navigateWithRefresh(params);
    },
    [buildParamsWithOverrides, navigateWithRefresh]
  );

  const handlePriceChange = useCallback(
    (newPriceRange: string) => {
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
    },
    [buildParamsWithOverrides, navigateWithRefresh]
  );

  const handleCurrencyChange = useCallback((newCurrency: 'USD' | 'MXN') => {
    setDisplayCurrency(newCurrency);
    setPriceRange('');
  }, []);

  const handleBedsChange = useCallback(
    (newBeds: string) => {
      setBeds(newBeds);
      const params = buildParamsWithOverrides({ beds: newBeds || null });
      navigateWithRefresh(params);
    },
    [buildParamsWithOverrides, navigateWithRefresh]
  );

  const handleBathsChange = useCallback(
    (newBaths: string) => {
      setBaths(newBaths);
      const params = buildParamsWithOverrides({ baths: newBaths || null });
      navigateWithRefresh(params);
    },
    [buildParamsWithOverrides, navigateWithRefresh]
  );

  const handlePropertyTypeChange = useCallback(
    (newType: string) => {
      setPropertyType(newType);
      const params = buildParamsWithOverrides({ type: newType || null });
      navigateWithRefresh(params);
    },
    [buildParamsWithOverrides, navigateWithRefresh]
  );

  const handleContractLengthChange = useCallback(
    (newContract: string) => {
      setContractLength(newContract);
      const params = buildParamsWithOverrides({ contractLength: newContract || null });
      navigateWithRefresh(params);
    },
    [buildParamsWithOverrides, navigateWithRefresh]
  );

  const clearFilters = useCallback(() => {
    setSelectedState('');
    setSelectedMunicipality('');
    setPropertyType('');
    setPriceRange('');
    setBeds('');
    setBaths('');
    setHasPool(false);
    setHasAC(false);
    setPetsAllowed(false);
    setIsFurnished(false);
    setServicesIncluded(false);
    setContractLength('');
    window.location.href = `/rentals?displayCurrency=${displayCurrency}`;
  }, [displayCurrency]);

  const activeFilterCount = [
    selectedState,
    selectedMunicipality,
    propertyType,
    priceRange,
    beds,
    baths,
    hasPool,
    hasAC,
    petsAllowed,
    isFurnished,
    servicesIncluded,
    contractLength,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    params.set('page', page.toString());
    window.location.href = `/rentals?${params.toString()}`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search Bar & Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-screen-2xl mx-auto">

          {/* Row 1: Core filters */}
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

            {/* Property Type - Desktop */}
            <select
              value={propertyType}
              onChange={(e) => handlePropertyTypeChange(e.target.value)}
              className="hidden md:block py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
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

          {/* Row 2: Rental-specific quick filters */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Contract Length */}
            <select
              value={contractLength}
              onChange={(e) => handleContractLengthChange(e.target.value)}
              className="py-1.5 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white"
            >
              {CONTRACT_LENGTHS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Pets */}
            <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors select-none">
              <input
                type="checkbox"
                checked={petsAllowed}
                onChange={(e) => {
                  setPetsAllowed(e.target.checked);
                  const params = buildParamsWithOverrides({});
                  if (e.target.checked) params.set('pets', 'true');
                  else params.delete('pets');
                  navigateWithRefresh(params);
                }}
                className="w-3.5 h-3.5 rounded border-gray-300 text-secondary focus:ring-secondary"
              />
              <PawPrint className="w-3.5 h-3.5 text-gray-500" />
              Pets OK
            </label>

            {/* Furnished */}
            <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors select-none">
              <input
                type="checkbox"
                checked={isFurnished}
                onChange={(e) => {
                  setIsFurnished(e.target.checked);
                  const params = buildParamsWithOverrides({});
                  if (e.target.checked) params.set('furnished', 'true');
                  else params.delete('furnished');
                  navigateWithRefresh(params);
                }}
                className="w-3.5 h-3.5 rounded border-gray-300 text-secondary focus:ring-secondary"
              />
              <Sofa className="w-3.5 h-3.5 text-gray-500" />
              Furnished
            </label>

            {/* Services Included */}
            <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors select-none">
              <input
                type="checkbox"
                checked={servicesIncluded}
                onChange={(e) => {
                  setServicesIncluded(e.target.checked);
                  const params = buildParamsWithOverrides({});
                  if (e.target.checked) params.set('servicesIncluded', 'true');
                  else params.delete('servicesIncluded');
                  navigateWithRefresh(params);
                }}
                className="w-3.5 h-3.5 rounded border-gray-300 text-secondary focus:ring-secondary"
              />
              <Zap className="w-3.5 h-3.5 text-gray-500" />
              Services Included
            </label>
          </div>

          {/* Expanded Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {/* Mobile-only filters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:hidden">
                {/* Property Type (Mobile) */}
                <div>
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
                <div>
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
                <div>
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
                ? `Rentals in ${selectedMunicipality}`
                : selectedState
                ? `Rentals in ${selectedState}`
                : 'Quality Rentals in Mexico'}
            </h1>
            <p className="text-sm text-gray-500">{total.toLocaleString()} properties available</p>
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
                  router.push(`/rentals?${params.toString()}`);
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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No rentals found</h2>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
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
              viewMode === 'map' ? 'w-full' : 'hidden lg:block lg:w-1/2 xl:w-[55%]'
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

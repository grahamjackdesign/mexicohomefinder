'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building2, Map, X } from 'lucide-react';
import { searchLocations, popularLocations, LocationItem } from '@/lib/locations';

type Props = {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string, location?: LocationItem) => void;
  variant?: 'hero' | 'header' | 'page';
};

export default function SearchAutocomplete({
  placeholder = 'Search by city, state, or neighborhood...',
  className = '',
  onSearch,
  variant = 'hero',
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update suggestions when query changes
  useEffect(() => {
    if (query.length === 0) {
      setSuggestions(popularLocations);
    } else {
      setSuggestions(searchLocations(query));
    }
    setHighlightedIndex(-1);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location: LocationItem) => {
    setQuery(location.name);
    setIsOpen(false);

    if (onSearch) {
      onSearch(location.name, location);
    } else {
      // Navigate to properties page with correct filters based on location type
      const params = new URLSearchParams();
      
      if (location.type === 'state') {
        params.set('state', location.name);
      } else if (location.type === 'municipality') {
        if (location.state) {
          params.set('state', location.state);
        }
        params.set('municipality', location.name);
      } else if (location.type === 'neighborhood') {
        if (location.state) {
          params.set('state', location.state);
        }
        if (location.municipality) {
          params.set('municipality', location.municipality);
        }
        // Could add neighborhood param if supported
      }
      
      router.push(`/properties?${params.toString()}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);

    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      handleSelect(suggestions[highlightedIndex]);
    } else if (onSearch) {
      onSearch(query);
    } else {
      // Search with free text - try to match against municipality name
      const params = new URLSearchParams();
      params.set('q', query);
      router.push(`/properties?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const getIcon = (type: LocationItem['type']) => {
    switch (type) {
      case 'state':
        return <Map className="w-4 h-4 text-gray-400" />;
      case 'municipality':
        return <Building2 className="w-4 h-4 text-gray-400" />;
      case 'neighborhood':
        return <MapPin className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: LocationItem['type']) => {
    switch (type) {
      case 'state':
        return 'State';
      case 'municipality':
        return 'City';
      case 'neighborhood':
        return 'Neighborhood';
    }
  };

  const inputClasses = {
    hero: 'w-full py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 text-base',
    header: 'w-full py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-sm',
    page: 'w-full py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary',
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${
              variant === 'header' ? 'w-4 h-4 left-3' : 'w-5 h-5'
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={inputClasses[variant]}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 max-h-80 overflow-y-auto">
          {query.length === 0 && (
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
              Popular Locations
            </div>
          )}
          {suggestions.map((location, index) => (
            <button
              key={`${location.type}-${location.slug}`}
              type="button"
              onClick={() => handleSelect(location)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                index === highlightedIndex
                  ? 'bg-secondary/10 text-secondary'
                  : 'hover:bg-gray-50'
              }`}
            >
              {getIcon(location.type)}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {location.name}
                </div>
                {location.state && (
                  <div className="text-sm text-gray-500 truncate">
                    {location.state}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                {getTypeLabel(location.type)}
              </span>
            </button>
          ))}
          
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full px-4 py-3 flex items-center gap-3 text-left border-t border-gray-100 hover:bg-gray-50"
            >
              <Search className="w-4 h-4 text-secondary" />
              <span className="text-secondary font-medium">
                Search for "{query}"
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

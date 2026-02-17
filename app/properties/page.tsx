import { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase';
import Header from '@/components/Header';
import PropertiesClient from './PropertiesClient';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';

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

export const metadata = {
  title: 'Properties for Sale in Mexico',
  description:
    'Browse properties for sale across Mexico. Find homes, condos, land, and commercial properties in San Miguel de Allende, Puerto Vallarta, Tulum, and more.',
};

async function getAvailableLocations() {
  // Get unique states (only from MHF-approved properties)
  const { data: statesData } = await supabaseServer
    .from('properties')
    .select('state')
    .eq('status', 'active')
    .eq('show_on_mhf', true)
    .not('state', 'is', null);

  const states = Array.from(
    new Set(statesData?.map((p) => p.state).filter(Boolean) || [])
  ).sort() as string[];

  // Get unique state/municipality combinations (only from MHF-approved properties)
  const { data: municipalitiesData } = await supabaseServer
    .from('properties')
    .select('state, municipality')
    .eq('status', 'active')
    .eq('show_on_mhf', true)
    .not('state', 'is', null)
    .not('municipality', 'is', null);

  const municipalitiesMap = new Map<string, Set<string>>();
  municipalitiesData?.forEach((p) => {
    if (p.state && p.municipality) {
      if (!municipalitiesMap.has(p.state)) {
        municipalitiesMap.set(p.state, new Set());
      }
      municipalitiesMap.get(p.state)!.add(p.municipality);
    }
  });

  const municipalities: { state: string; municipality: string }[] = [];
  municipalitiesMap.forEach((munis, state) => {
    munis.forEach((municipality) => {
      municipalities.push({ state, municipality });
    });
  });

  // Sort municipalities alphabetically
  municipalities.sort((a, b) => a.municipality.localeCompare(b.municipality));

  return { states, municipalities };
}

async function getProperties(searchParams: SearchParams) {
  let query = supabaseServer
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'active')
    .eq('show_on_mhf', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  // State filter
  if (searchParams.state) {
    query = query.eq('state', searchParams.state);
  }

  // Municipality filter
  if (searchParams.municipality) {
    query = query.eq('municipality', searchParams.municipality);
  }

  // Listing type (sale/rent)
  if (searchParams.listingType) {
    query = query.eq('listing_type', searchParams.listingType);
  }

  // Property type
  if (searchParams.type) {
    query = query.eq('property_category', searchParams.type);
  }

  // Determine which price column to filter on
  const priceColumn = searchParams.displayCurrency === 'MXN' ? 'price_mxn' : 'price_usd';

  // Price range (filter on the appropriate currency column)
  if (searchParams.minPrice) {
    query = query.gte(priceColumn, parseInt(searchParams.minPrice));
  }

  if (searchParams.maxPrice) {
    query = query.lte(priceColumn, parseInt(searchParams.maxPrice));
  }

  // Beds
  if (searchParams.beds) {
    query = query.gte('bedrooms', parseInt(searchParams.beds));
  }

  // Baths
  if (searchParams.baths) {
    query = query.gte('bathrooms', parseInt(searchParams.baths));
  }

  // Amenities
  if (searchParams.pool === 'true') {
    query = query.eq('has_pool', true);
  }

  if (searchParams.ac === 'true') {
    query = query.eq('has_ac', true);
  }

  if (searchParams.pets === 'true') {
    query = query.eq('pets_allowed', true);
  }

  if (searchParams.featured === 'true') {
    query = query.eq('featured', true);
  }

  // Pagination
  const page = parseInt(searchParams.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching properties:', error);
    return { properties: [], total: 0 };
  }

  // Use English translations where available
  const propertiesEn = (data || []).map((p: any) => ({
    ...p,
    title: p.title_en || p.title,
    description: p.description_en || p.description,
  }));

  return { properties: propertiesEn, total: count || 0 };
}

async function getAllMapCoordinates() {
  const { data } = await supabaseServer
    .from('properties')
    .select('id, title, title_en, price, price_usd, price_mxn, currency, listing_type, property_category, state, municipality, bedrooms, bathrooms, sqft, neighborhood, images, latitude, longitude, has_pool, has_ac, pets_allowed, featured')
    .eq('status', 'active')
    .eq('show_on_mhf', true)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  return (data || []).map((p: any) => ({
    ...p,
    title: p.title_en || p.title,
    latitude: parseFloat(p.latitude),
    longitude: parseFloat(p.longitude),
  }));
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [{ properties, total }, { states, municipalities }, allMapProperties] = await Promise.all([
    getProperties(params),
    getAvailableLocations(),
    getAllMapCoordinates(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-16 sm:pt-18 h-screen flex flex-col">
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
          }
        >
          <PropertiesClient
            initialProperties={properties}
            total={total}
            searchParams={params}
            availableStates={states}
            availableMunicipalities={municipalities}
            allMapProperties={allMapProperties}
          />
        </Suspense>
      </main>
    </>
  );
}

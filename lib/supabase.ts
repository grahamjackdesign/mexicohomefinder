import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Browser client for client components
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server client for API routes and server components
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for mutations (server-side only)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Types matching BrokerLink schema
export type Property = {
  id: string;
  client_id: string;
  property_ref?: string;
  title: string;
  description?: string;
  price: number;
  listing_type: 'sale' | 'rent';
  property_category: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  lot_size?: number;
  address?: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  featured: boolean;
  images: string[];
  parking?: string;
  security?: string;
  has_pool?: boolean;
  has_ac?: boolean;
  country?: string;
  state?: string;
  municipality?: string;
  total_rooms?: number;
  pets_allowed?: boolean;
  currency?: string;
  year_construction?: number;
  google_maps_link?: string;
  video_url?: string;
  // Amenities
  has_spa?: boolean;
  has_padel_court?: boolean;
  has_jacuzzi?: boolean;
  has_reception?: boolean;
  has_24_7_security?: boolean;
  has_gym?: boolean;
  has_sauna?: boolean;
  has_event_room?: boolean;
  has_restaurant?: boolean;
  has_pet_area?: boolean;
  has_playground?: boolean;
  has_soccer_field?: boolean;
  has_covered_parking?: boolean;
  has_bbq_area?: boolean;
  has_laundry?: boolean;
  has_storage?: boolean;
  has_elevator?: boolean;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id?: string;
  property_id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: 'new' | 'contacted' | 'purchased';
  source: 'mexicohomefinder';
  created_at?: string;
};

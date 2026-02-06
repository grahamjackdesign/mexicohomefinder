import { supabaseServer } from '@/lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://mexicohomefinder.com';

  // Fetch all active properties
  const { data: properties } = await supabaseServer
    .from('properties')
    .select('id, updated_at')
    .eq('status', 'active');

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Location pages (popular destinations)
  const locationPages = [
    'san-miguel-de-allende',
    'puerto-vallarta',
    'playa-del-carmen',
    'tulum',
    'los-cabos',
  ].map((location) => ({
    url: `${baseUrl}/properties?location=${location}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Property pages
  const propertyPages =
    properties?.map((property) => ({
      url: `${baseUrl}/properties/${property.id}`,
      lastModified: property.updated_at ? new Date(property.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    })) || [];

  return [...staticPages, ...locationPages, ...propertyPages];
}

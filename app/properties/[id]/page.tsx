import { supabaseServer } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyDetailClient from './PropertyDetailClient';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: property } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (!property) {
    return { title: 'Property Not Found' };
  }

  const title = property.title_en || property.title;
  const description = property.description_en || property.description;
  const price = `$${property.price.toLocaleString()} ${property.currency || 'USD'}`;
  const location = property.neighborhood || property.municipality || 'Mexico';

  return {
    title: `${title} - ${price}`,
    description:
      description?.slice(0, 160) ||
      `${property.bedrooms || 0} bed, ${property.bathrooms || 0} bath property in ${location}. ${price}`,
    openGraph: {
      title: title,
      description:
        description?.slice(0, 160) ||
        `Beautiful property in ${location}`,
      images: property.images?.[0]
        ? [{ url: property.images[0], width: 1200, height: 630 }]
        : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: property, error } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !property) {
    notFound();
  }

  const propertyEn = {
    ...property,
    title: property.title_en || property.title,
    description: property.description_en || property.description,
  };

  const { data: similarData } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .neq('id', id)
    .eq('listing_type', property.listing_type)
    .gte('price', property.price * 0.7)
    .lte('price', property.price * 1.3)
    .limit(4);

  const similarProperties = (similarData || []).map((p: any) => ({
    ...p,
    title: p.title_en || p.title,
    description: p.description_en || p.description,
  }));

  // --- JSON-LD Schema ---
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mexicohomefinder.com';
  const title = property.title_en || property.title;
  const description = property.description_en || property.description;
  const location = property.neighborhood || property.municipality || 'San Miguel de Allende';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: description?.slice(0, 500) || '',
    url: `${siteUrl}/properties/${id}`,
    datePosted: property.created_at,
    ...(property.images?.[0] && {
      image: property.images,
    }),
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency || 'USD',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: location,
      addressRegion: property.state || 'Guanajuato',
      addressCountry: 'MX',
    },
    ...(property.latitude && property.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: property.latitude,
        longitude: property.longitude,
      },
    }),
    numberOfRooms: property.bedrooms || undefined,
    numberOfBathroomsTotal: property.bathrooms || undefined,
    floorSize: property.sqft
      ? {
          '@type': 'QuantitativeValue',
          value: property.sqft,
          unitCode: 'MTK',
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="pt-16 sm:pt-18">
        <PropertyDetailClient
          property={propertyEn}
          similarProperties={similarProperties}
        />
      </main>
      <Footer />
    </>
  );
}
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
    return {
      title: 'Property Not Found',
    };
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

  // Use English translations where available
  const propertyEn = {
    ...property,
    title: property.title_en || property.title,
    description: property.description_en || property.description,
  };

  // Get similar properties
  const { data: similarData } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .neq('id', id)
    .eq('listing_type', property.listing_type)
    .gte('price', property.price * 0.7)
    .lte('price', property.price * 1.3)
    .limit(4);

  // Map English translations for similar properties too
  const similarProperties = (similarData || []).map((p: any) => ({
    ...p,
    title: p.title_en || p.title,
    description: p.description_en || p.description,
  }));

  return (
    <>
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

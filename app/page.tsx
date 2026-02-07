// MexicoHomeFinder Homepage - US Buyer Focused Design
// New Color Scheme: Cream background, Terracotta & Blue accents, Dark blue text

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlideshow from '@/components/HeroSlideshow';
import PropertyCard from '@/components/PropertyCard';
import ContactForm from '@/components/ContactForm';
import { supabaseServer } from '@/lib/supabase';
import { MapPin, Shield, Users, TrendingUp, Star, Home, ArrowRight } from 'lucide-react';

// Color Palette
// Cream: #F5F1E8
// Terracotta: #C85A3E
// Blue: #2C4563
// Light Blue: #E8EEF4

const FEATURED_LOCATIONS = [
  {
    name: 'San Miguel de Allende',
    state: 'Guanajuato',
    image: '/images/locations/san-miguel-cover.jpg',
    description: 'Colonial charm & art scene',
  },
  {
    name: 'Puerto Vallarta',
    state: 'Jalisco',
    image: '/images/locations/puerto-vallarta-cover.jpg',
    description: 'Pacific coast paradise',
  },
  {
    name: 'Playa del Carmen',
    state: 'Quintana Roo',
    image: '/images/locations/playa-del-carmen-cover.jpg',
    description: 'Caribbean beaches & lifestyle',
  },
  {
    name: 'Mérida',
    state: 'Yucatán',
    image: '/images/locations/merida-cover.jpg',
    description: 'Affordable & safe',
  },
];

const WHY_CHOOSE_US = [
  {
    icon: Shield,
    title: 'Verified Agents',
    description: 'Every agent is personally vetted and licensed',
  },
  {
    icon: Users,
    title: 'US Buyer Expertise',
    description: 'Agents who understand American clients',
  },
  {
    icon: TrendingUp,
    title: 'Market Insights',
    description: 'Real-time data and investment analysis',
  },
  {
    icon: Star,
    title: 'Concierge Service',
    description: 'End-to-end support from search to closing',
  },
];

export default async function HomePage() {
  // Fetch featured properties (only approved for MHF)
  const { data: featuredProperties } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .eq('featured', true)
    .eq('show_on_mhf', true)
    .limit(6);

  return (
    <>
      <Header />

      {/* Hero Section - Slideshow with Ken Burns Effect */}
      <HeroSlideshow />

      {/* Featured Properties */}
      {featuredProperties && featuredProperties.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2C4563' }}>
                Featured <span style={{ color: '#C85A3E' }}>Properties</span>
              </h2>
              <p className="text-lg" style={{ color: '#2C4563', opacity: 0.7 }}>
                Handpicked homes from our most trusted agents
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: '#C85A3E' }}
              >
                View All Properties
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Popular Locations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F1E8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2C4563' }}>
              Explore Mexico's <span style={{ color: '#C85A3E' }}>Top Destinations</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#2C4563', opacity: 0.7 }}>
              From charming colonial towns to pristine beaches—discover where Americans are making Mexico home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_LOCATIONS.map((location, index) => (
              <Link
                key={location.name}
                href={`/properties?state=${encodeURIComponent(location.state)}&municipality=${encodeURIComponent(location.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg hover:shadow-2xl transition-all"
              >
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {location.name}
                  </h3>
                  <p className="text-sm text-gray-200 mb-4">
                    {location.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                       style={{ backgroundColor: '#C85A3E' }}>
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2C4563' }}>
              Why Americans <span style={{ color: '#C85A3E' }}>Trust Us</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#2C4563', opacity: 0.7 }}>
              We understand the unique challenges of buying property in Mexico as a foreigner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                     style={{ backgroundColor: '#E8EEF4' }}>
                  <item.icon className="w-8 h-8" style={{ color: '#C85A3E' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#2C4563' }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: '#2C4563', opacity: 0.7 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl"
               style={{ backgroundColor: '#F5F1E8' }}>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#C85A3E' }}>
                1,000+
              </div>
              <div className="text-sm font-semibold" style={{ color: '#2C4563', opacity: 0.7 }}>
                Curated Listings
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#C85A3E' }}>
                100+
              </div>
              <div className="text-sm font-semibold" style={{ color: '#2C4563', opacity: 0.7 }}>
                Verified Agents
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#C85A3E' }}>
                12+
              </div>
              <div className="text-sm font-semibold" style={{ color: '#2C4563', opacity: 0.7 }}>
                Prime Regions
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#C85A3E' }}>
                95%
              </div>
              <div className="text-sm font-semibold" style={{ color: '#2C4563', opacity: 0.7 }}>
                Client Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#2C4563' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Your Journey to <span style={{ color: '#C85A3E' }}>Mexican Property Ownership</span>
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              We guide you through every step of the process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search & Connect',
                description: 'Browse curated listings and connect with verified agents who understand American buyers'
              },
              {
                step: '02',
                title: 'Visit & Verify',
                description: 'Tour properties with local experts and get transparent insights on neighborhoods and pricing'
              },
              {
                step: '03',
                title: 'Close with Confidence',
                description: 'Navigate legal requirements, financing, and closing with dedicated support every step'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-white/20"
                       style={{ transform: 'translateX(-50%)' }} />
                )}
                
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-5xl font-bold mb-4" style={{ color: '#C85A3E', opacity: 0.5 }}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/70">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="contact-form">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2C4563' }}>
              Ready to Get Started?
            </h2>
            <p className="text-lg" style={{ color: '#2C4563', opacity: 0.7 }}>
              Our team is here to answer your questions and guide you through the process
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Agent CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F1E8' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
               style={{ backgroundColor: '#E8EEF4' }}>
            <Users className="w-8 h-8" style={{ color: '#C85A3E' }} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2C4563' }}>
            Are You a Real Estate Agent?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#2C4563', opacity: 0.7 }}>
            Join MexicoHomeFinder and connect with serious American & Canadian buyers. 
            Get your listings in front of qualified international clients with real budgets.
          </p>
          <Link
            href="/#contact-form"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
            style={{ backgroundColor: '#2C4563' }}
          >
            List Your Properties Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

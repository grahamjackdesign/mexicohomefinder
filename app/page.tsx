import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabaseServer } from '@/lib/supabase';
import PropertyCard from '@/components/PropertyCard';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import ContactForm from '@/components/ContactForm';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import {
  Search,
  MapPin,
  MessageSquare,
  Home,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

// Location data for the browse section
const LOCATIONS = [
  {
    name: 'San Miguel de Allende',
    state: 'Guanajuato',
    image: '/images/locations/san-miguel-cover.jpg',
    count: 324,
    featured: true,
  },
  {
    name: 'Puerto Vallarta',
    state: 'Jalisco',
    image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=600&q=80',
    count: 518,
  },
  {
    name: 'Playa del Carmen',
    state: 'Quintana Roo',
    image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600&q=80',
    count: 412,
  },
  {
    name: 'Tulum',
    state: 'Quintana Roo',
    image: '/images/locations/tulum-cover.jpg',
    count: 287,
  },
  {
    name: 'Los Cabos',
    state: 'Baja California Sur',
    image: 'https://images.unsplash.com/photo-1570737543098-0983d88f796d?w=600&q=80',
    count: 356,
  },
];

const SECONDARY_LOCATIONS = [
  { name: 'Mérida', state: 'Yucatán' },
  { name: 'Ajijic', state: 'Jalisco' },
  { name: 'Oaxaca de Juárez', state: 'Oaxaca' },
  { name: 'Cancún', state: 'Quintana Roo' },
  { name: 'Guanajuato', state: 'Guanajuato' },
  { name: 'Querétaro', state: 'Querétaro' },
  { name: 'Mazatlán', state: 'Sinaloa' },
];

export default async function HomePage() {
  // Fetch featured properties
  const { data: featuredProperties } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .eq('featured', true)
    .limit(4);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Video - Full width looping animation */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90"
            style={{ transform: 'scale(1.1)' }}
          >
            <source src="https://dvscgzslsexnuwubmnfb.supabase.co/storage/v1/object/public/hero-images/SMA_vector_anim_loop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-32">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 rounded-full mb-6 animate-fade-in-up backdrop-blur-sm">
              <span className="text-sm font-semibold text-white uppercase tracking-wide">
                Your Gateway to Mexico
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 animate-fade-in-up animate-delay-100">
              Find your dream home{' '}
              <span className="text-secondary">in Mexico</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-300 mb-10 max-w-lg animate-fade-in-up animate-delay-200">
              Discover beautiful properties across Mexico's most desirable
              locations. From colonial gems to beachfront villas.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl animate-fade-in-up animate-delay-300">
              <div className="flex-1">
                <SearchAutocomplete 
                  variant="hero"
                  placeholder="Search by city, state, or neighborhood..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{ clipPath: 'ellipse(75% 100% at 50% 100%)' }} />
      </section>

      {/* Featured Properties */}
      {featuredProperties && featuredProperties.length > 0 && (
        <FeaturedCarousel properties={featuredProperties} />
      )}

      {/* Browse Locations Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50" id="locations">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-4">
            Browse homes in <span className="text-secondary">popular locations</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            From charming colonial towns to stunning beach communities, find
            your perfect spot in Mexico.
          </p>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {LOCATIONS.map((location, index) => (
            <Link
              key={location.name}
              href={`/properties?state=${encodeURIComponent(location.state)}&municipality=${encodeURIComponent(location.name)}`}
              className={`group relative rounded-2xl overflow-hidden ${
                index === 0 ? 'md:col-span-2 aspect-[2/1]' : 'aspect-[4/3]'
              }`}
            >
              <Image
                src={location.image}
                alt={location.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {location.name}
                </h3>
                <span className="text-sm text-gray-300">
                  See properties available
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Secondary Locations - HIDDEN */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SECONDARY_LOCATIONS.map((location) => (
            <Link
              key={location.name}
              href={`/properties?state=${encodeURIComponent(location.state)}&municipality=${encodeURIComponent(location.name)}`}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-secondary hover:text-white rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              {location.name}
            </Link>
          ))}
          <Link
            href="/properties"
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-secondary hover:text-white rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div> */}
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary relative overflow-hidden">
        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
                Trusted by thousands,{' '}
                <span className="text-secondary italic">driven by experience</span>
              </h2>
              <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                MexicoHomeFinder connects international buyers with Mexico's
                most trusted real estate professionals. We understand the unique
                needs of expats and foreign buyers.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                From understanding fideicomiso trusts to navigating local
                regulations, our network of agents provides the expertise you
                need for a smooth buying experience.
              </p>

              <div className="flex gap-12 mt-10">
                <div>
                  <div className="text-4xl sm:text-5xl font-display font-bold text-secondary">
                    2,500+
                  </div>
                  <div className="text-gray-400 mt-1">Properties Listed</div>
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-display font-bold text-secondary">
                    150+
                  </div>
                  <div className="text-gray-400 mt-1">Trusted Agents</div>
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-display font-bold text-secondary">
                    12
                  </div>
                  <div className="text-gray-400 mt-1">Regions</div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
                alt="Luxury Mexican property"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section - HIDDEN */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8" id="guides">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-4">
              Need some <span className="text-secondary">buying tips?</span>
            </h2>
            <p className="text-lg text-gray-500">
              Check out our latest guides for advice on buying property in
              Mexico.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80',
                tag: 'Guide',
                title: 'Complete Guide to Buying Property in Mexico as a Foreigner',
                time: '12 min read',
              },
              {
                image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80',
                tag: 'Legal',
                title: 'Understanding Fideicomiso: The Bank Trust System Explained',
                time: '8 min read',
              },
              {
                image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
                tag: 'Location',
                title: 'Why San Miguel de Allende Is Perfect for Expat Living',
                time: '10 min read',
              },
              {
                image: 'https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=400&q=80',
                tag: 'Finance',
                title: 'Hidden Costs of Buying Property in Mexico: What to Expect',
                time: '6 min read',
              },
            ].map((article, index) => (
              <Link
                key={index}
                href="#"
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-transparent transition-all"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="inline-block px-2.5 py-1 bg-secondary text-white text-xs font-semibold uppercase tracking-wide rounded mb-3">
                    {article.tag}
                  </span>
                  <h3 className="font-semibold text-primary group-hover:text-secondary transition-colors line-clamp-2 mb-3">
                    {article.title}
                  </h3>
                  <span className="text-sm text-gray-400">{article.time}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Contact Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="contact-form">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600">
              Have questions about buying property in Mexico? We're here to help.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary to-secondary-dark" id="contact">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Are you a real estate agent?
          </h2>
          <p className="text-lg text-white/85 mb-8 max-w-xl mx-auto">
            List your properties on MexicoHomeFinder and connect with qualified
            international buyers actively searching for homes in Mexico.
          </p>
          <Link
            href="https://brokerlink.mx/comenzar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:shadow-lg transition-shadow"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

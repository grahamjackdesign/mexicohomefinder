import Image from 'next/image';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import PropertyCard from '@/components/PropertyCard';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare,
  Check,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

// This will eventually come from the database
// For now, hardcoded La Luminaria data as example
const developmentData = {
  slug: 'laluminaria',
  name: 'La Luminaria',
  developerName: 'Luminaria Development Group',
  logoUrl: '/developments/laluminaria-logo.png',
  heroImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
  heroVideoUrl: null,
  description: 'Experience luxury living in the heart of San Miguel de Allende. La Luminaria offers contemporary Mexican architecture with world-class amenities in one of Mexico\'s most beautiful colonial cities.',
  tagline: 'Where Modern Luxury Meets Colonial Charm',
  
  // Custom branding
  primaryColor: '#2C5F2D', // Deep green
  secondaryColor: '#D4A574', // Warm gold
  
  // Location
  address: 'Camino a Alcocer, San Miguel de Allende',
  city: 'San Miguel de Allende',
  state: 'Guanajuato',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.5!2d-100.74!3d20.91!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDU0JzQwLjgiTiAxMDDCsDQ0JzI0LjAiVw!5e0!3m2!1sen!2smx!4v1234567890',
  
  // Amenities
  amenities: [
    'Rooftop Pool & Lounge',
    'State-of-the-art Fitness Center',
    '24/7 Security & Concierge',
    'Underground Parking',
    'Yoga & Meditation Garden',
    'Co-working Spaces',
    'Pet-friendly Areas',
    'Sustainable Architecture',
    'Solar Panels',
    'Rainwater Collection',
    'Walking Distance to Centro',
    'Stunning Mountain Views'
  ],
  
  // Gallery
  galleryImages: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  ],
  
  // Contact
  contactEmail: 'jack@brokerlink.mx',
  contactPhone: '+52 415 123 4567',
  contactWhatsapp: '524151234567',
};

export default async function DevelopmentMicrositeTemplate() {
  // Fetch properties for this development
  const { data: properties } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('development_slug', developmentData.slug)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div 
      className="min-h-screen bg-white"
      style={{
        '--dev-primary': developmentData.primaryColor,
        '--dev-secondary': developmentData.secondaryColor,
      } as React.CSSProperties}
    >
        {/* Custom Header - No MHF branding */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Development Logo */}
              <div className="flex items-center gap-3">
                {developmentData.logoUrl && (
                  <div className="relative w-12 h-12">
                    <Image
                      src={developmentData.logoUrl}
                      alt={developmentData.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-display font-bold" style={{ color: developmentData.primaryColor }}>
                    {developmentData.name}
                  </h1>
                  <p className="text-xs text-gray-500">{developmentData.city}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <a href="#properties" className="text-gray-700 hover:text-[var(--dev-primary)] transition-colors font-medium">
                  Properties
                </a>
                <a href="#amenities" className="text-gray-700 hover:text-[var(--dev-primary)] transition-colors font-medium">
                  Amenities
                </a>
                <a href="#location" className="text-gray-700 hover:text-[var(--dev-primary)] transition-colors font-medium">
                  Location
                </a>
                <a href="#gallery" className="text-gray-700 hover:text-[var(--dev-primary)] transition-colors font-medium">
                  Gallery
                </a>
                <a 
                  href="#contact"
                  className="px-6 py-2.5 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                  style={{ backgroundColor: developmentData.secondaryColor }}
                >
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={developmentData.heroImageUrl}
              alt={developmentData.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <p 
              className="text-sm uppercase tracking-widest mb-4 font-semibold"
              style={{ color: developmentData.secondaryColor }}
            >
              {developmentData.developerName}
            </p>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              {developmentData.name}
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-8 leading-relaxed opacity-90">
              {developmentData.tagline}
            </p>
            <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              {developmentData.description}
            </p>
            <a
              href="#properties"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:shadow-2xl hover:scale-105"
              style={{ backgroundColor: developmentData.secondaryColor }}
            >
              Explore Properties
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Scroll Indicator */}
          <a 
            href="#properties"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white hover:text-[var(--dev-secondary)] transition-colors"
          >
            <span className="text-sm uppercase tracking-wider">Scroll</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </a>
        </section>

        {/* Properties Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" id="properties">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-4xl md:text-5xl font-display font-bold mb-4"
                style={{ color: developmentData.primaryColor }}
              >
                Available Properties
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover your perfect home in {developmentData.name}
              </p>
            </div>

            {properties && properties.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-6">
                  Properties coming soon. Contact us for pre-launch information.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
                  style={{ backgroundColor: developmentData.secondaryColor }}
                >
                  Get Pre-Launch Info
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Amenities Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" id="amenities">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-4xl md:text-5xl font-display font-bold mb-4"
                style={{ color: developmentData.primaryColor }}
              >
                World-Class Amenities
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Every detail designed for your comfort and lifestyle
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {developmentData.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${developmentData.primaryColor}15` }}
                  >
                    <Check className="w-5 h-5" style={{ color: developmentData.primaryColor }} />
                  </div>
                  <p className="text-gray-700 font-medium pt-2">{amenity}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" id="gallery">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-4xl md:text-5xl font-display font-bold mb-4"
                style={{ color: developmentData.primaryColor }}
              >
                Experience the Lifestyle
              </h2>
              <p className="text-xl text-gray-600">
                Take a visual tour of {developmentData.name}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {developmentData.galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`${developmentData.name} - Image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" id="location">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 
                  className="text-4xl md:text-5xl font-display font-bold mb-6"
                  style={{ color: developmentData.primaryColor }}
                >
                  Prime Location
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Located in the heart of {developmentData.city}, {developmentData.name} offers 
                  the perfect balance of tranquility and accessibility.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: developmentData.secondaryColor }} />
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600">{developmentData.address}</p>
                      <p className="text-gray-600">{developmentData.city}, {developmentData.state}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src={developmentData.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          className="py-20 px-4 sm:px-6 lg:px-8 text-white" 
          id="contact"
          style={{ backgroundColor: developmentData.primaryColor }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Get In Touch
              </h2>
              <p className="text-xl opacity-90">
                Ready to make {developmentData.name} your home?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Email</p>
                    <a href={`mailto:${developmentData.contactEmail}`} className="text-lg font-semibold hover:underline">
                      {developmentData.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Phone</p>
                    <a href={`tel:${developmentData.contactPhone}`} className="text-lg font-semibold hover:underline">
                      {developmentData.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">WhatsApp</p>
                    <a 
                      href={`https://wa.me/${developmentData.contactWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold hover:underline"
                    >
                      Chat with us
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                />
                <button
                  type="submit"
                  className="w-full px-8 py-4 rounded-lg font-semibold text-white transition-all hover:shadow-xl"
                  style={{ backgroundColor: developmentData.secondaryColor }}
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              {developmentData.logoUrl && (
                <div className="relative w-10 h-10">
                  <Image
                    src={developmentData.logoUrl}
                    alt={developmentData.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <h3 className="text-2xl font-display font-bold">{developmentData.name}</h3>
            </div>
            <p className="text-gray-400 mb-6">{developmentData.address}</p>
            <p className="text-gray-500 text-sm">
              Powered by <a href="https://mexicohomefinder.com" className="text-gray-400 hover:text-white transition-colors">MexicoHomeFinder</a>
            </p>
          </div>
        </footer>
      </div>
    );
  }

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import ListPropertyModal from './ListPropertyModal';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on the homepage
  const isHomePage = pathname === '/';

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isHomePage 
            ? 'shadow-sm' 
            : 'backdrop-blur-md border-b border-gray-700'
        }`}
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          backgroundImage: `
            linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%),
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.02) 2px, rgba(255,255,255,.02) 4px),
            repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(255,255,255,.01) 2px, rgba(255,255,255,.01) 4px)
          `
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              {/* Desktop - Full Logo */}
              <Image
                src="/MHF_logo_final.svg"
                alt="MexicoHomeFinder"
                width={200}
                height={50}
                className="hidden sm:block h-[50px] w-auto"
                priority
              />
              {/* Mobile - Smaller Logo */}
              <Image
                src="/MHF_logo_final.svg"
                alt="MexicoHomeFinder"
                width={140}
                height={35}
                className="block sm:hidden h-[35px] w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/properties"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-white hover:bg-white/10"
              >
                Browse Properties
              </Link>
              <Link
                href="#guides"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-white hover:bg-white/10"
              >
                Buying Guide
              </Link>
              <Link
                href="/#contact-form"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-white hover:bg-white/10"
              >
                Contact
              </Link>
              <button
                onClick={() => setListModalOpen(true)}
                className="ml-2 px-5 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-lg text-sm font-semibold transition-colors"
              >
                List Your Property
              </button>
              <Link
                href="/list-property/login"
                className="ml-1 px-5 py-2 bg-primary hover:bg-primary-light text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Login
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors text-gray-300 hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700" style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            backgroundImage: `
              linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%),
              repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.02) 2px, rgba(255,255,255,.02) 4px),
              repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(255,255,255,.01) 2px, rgba(255,255,255,.01) 4px)
            `
          }}>
            <div className="px-4 py-4 space-y-2">
              <Link
                href="/properties"
                className="block px-4 py-3 rounded-lg font-medium text-gray-300 hover:bg-white/10 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Properties
              </Link>
              <Link
                href="/properties?state=Guanajuato&municipality=San Miguel de Allende"
                className="block px-4 py-3 rounded-lg font-medium text-gray-300 hover:bg-white/10 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                San Miguel de Allende
              </Link>
              <Link
                href="#guides"
                className="block px-4 py-3 rounded-lg font-medium text-gray-300 hover:bg-white/10 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Buying Guide
              </Link>
              <Link
                href="/#contact-form"
                className="block px-4 py-3 rounded-lg font-medium text-gray-300 hover:bg-white/10 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setListModalOpen(true);
                  }}
                  className="block w-full px-4 py-3 bg-secondary text-white rounded-lg font-semibold text-center"
                >
                  List Your Property
                </button>
                <Link
                  href="/list-property/login"
                  className="block w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* List Property Modal */}
      <ListPropertyModal
        isOpen={listModalOpen}
        onClose={() => setListModalOpen(false)}
      />
    </>
  );
}

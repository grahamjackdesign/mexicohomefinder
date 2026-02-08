'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
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
        className="fixed top-0 left-0 right-0 z-50 shadow-sm"
        style={{ backgroundColor: '#F5F1E8' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              {/* Desktop - Full Logo */}
              <img
                src="/Asset_1.svg"
                alt="Mexico Home Finder"
                className="hidden sm:block h-[60px] w-auto"
              />
              {/* Mobile - Smaller Logo */}
              <img
                src="/Asset_1.svg"
                alt="Mexico Home Finder"
                className="block sm:hidden h-[45px] w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/properties"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#E8EEF4]"
                style={{ color: '#2C4563' }}
              >
                Browse Properties
              </Link>
              <Link
                href="#guides"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#E8EEF4]"
                style={{ color: '#2C4563' }}
              >
                Buying Guide
              </Link>
              <Link
                href="/#contact-form"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#E8EEF4]"
                style={{ color: '#2C4563' }}
              >
                Contact
              </Link>
              <button
                onClick={() => setListModalOpen(true)}
                className="ml-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:brightness-110 text-white"
                style={{ backgroundColor: '#C85A3E' }}
              >
                List Your Property
              </button>
              <Link
                href="/list-property/login"
                className="ml-1 px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:brightness-110 text-white"
                style={{ backgroundColor: '#2C4563' }}
              >
                Login
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-[#E8EEF4]"
              style={{ color: '#2C4563' }}
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
          <div 
            className="md:hidden border-t"
            style={{ 
              backgroundColor: '#F5F1E8',
              borderColor: '#E8EEF4'
            }}
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                href="/properties"
                className="block px-4 py-3 rounded-lg font-medium transition-colors hover:bg-[#E8EEF4]"
                style={{ color: '#2C4563' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Properties
              </Link>
              <Link
                href="/properties?state=Guanajuato&municipality=San Miguel de Allende"
                className="block px-4 py-3 rounded-lg font-medium transition-colors hover:bg-[#E8EEF4]"
                style={{ color: '#2C4563' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                San Miguel de Allende
              </Link>
              <Link
                href="#guides"
                className="block px-4 py-3 rounded-lg font-medium transition-colors hover:bg-[#E8EEF4]"
                style={{ color: '#2C4563' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Buying Guide
              </Link>
              <Link
                href="/#contact-form"
                className="block px-4 py-3 rounded-lg font-medium transition-colors hover:bg-[#E8EEF4]"
                style={{ color: '#2C4563' }}
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
                  className="block w-full px-4 py-3 rounded-lg font-semibold text-center text-white"
                  style={{ backgroundColor: '#C85A3E' }}
                >
                  List Your Property
                </button>
                <Link
                  href="/list-property/login"
                  className="block w-full px-4 py-3 rounded-lg font-semibold text-center text-white"
                  style={{ backgroundColor: '#2C4563' }}
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

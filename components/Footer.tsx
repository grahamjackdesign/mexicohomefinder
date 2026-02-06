import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/MHF_logo_on_dark.svg"
                alt="MexicoHomeFinder"
                width={180}
                height={45}
                className="h-[45px] w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting international buyers with trusted real estate
              professionals across Mexico's most desirable locations.
            </p>
          </div>

          {/* Popular Areas */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5">
              Popular Areas
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/properties?location=san-miguel-de-allende"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  San Miguel de Allende
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?location=puerto-vallarta"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  Puerto Vallarta
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?location=playa-del-carmen"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  Playa del Carmen
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?location=tulum"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  Tulum
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?location=los-cabos"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  Los Cabos
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#guides"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  Buying Guide
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  Legal Information
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  Market Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  For Agents
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} MexicoHomeFinder. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="w-10 h-10 bg-white/5 hover:bg-secondary rounded-lg flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/5 hover:bg-secondary rounded-lg flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/5 hover:bg-secondary rounded-lg flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 text-gray-400 hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

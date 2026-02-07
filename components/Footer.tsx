import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#2C4563' }} className="text-white">
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
            <p className="text-sm leading-relaxed text-white/70">
              Connecting American & Canadian buyers with trusted real estate
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
                  href="/properties?state=Guanajuato&municipality=San Miguel de Allende"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  San Miguel de Allende
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?state=Jalisco&municipality=Puerto Vallarta"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  Puerto Vallarta
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?state=Quintana Roo&municipality=Playa del Carmen"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  Playa del Carmen
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?state=Quintana Roo&municipality=Tulum"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  Tulum
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?state=Baja California Sur&municipality=Los Cabos"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
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
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  Buying Guide for Americans
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  Legal Information
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  Market Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
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
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact-form"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact-form"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  For Agents
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-colors hover:underline hover:text-[#C85A3E] text-white/70"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} MexicoHomeFinder. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="w-10 h-10 bg-white/10 hover:bg-[#C85A3E] rounded-lg flex items-center justify-center transition-all hover:shadow-lg"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 hover:bg-[#C85A3E] rounded-lg flex items-center justify-center transition-all hover:shadow-lg"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 hover:bg-[#C85A3E] rounded-lg flex items-center justify-center transition-all hover:shadow-lg"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

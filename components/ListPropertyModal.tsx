'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Globe } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const content = {
  en: {
    title: 'List Your Property',
    description: 'We have 2 ways of listing your property on MexicoHomeFinder.',
    brokerButton: 'List properties as a broker',
    ownerButton: 'List your property as an owner',
    switchLang: 'Español',
  },
  es: {
    title: 'Publicar Tu Propiedad',
    description: 'Tenemos 2 formas de publicar tu propiedad en MexicoHomeFinder.',
    brokerButton: 'Publicar propiedades como corredor',
    ownerButton: 'Publicar tu propiedad como propietario',
    switchLang: 'English',
  },
};

export default function ListPropertyModal({ isOpen, onClose }: Props) {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const t = content[lang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{t.title}</h2>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              {t.switchLang}
            </button>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed mb-8">
            {t.description}
          </p>

          {/* Buttons */}
          <div className="space-y-4">
            {/* Broker Button */}
            <a
              href="https://brokerlink.mx/comenzar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-4 px-6 bg-white border-2 border-secondary hover:bg-secondary/5 text-primary font-semibold rounded-xl transition-colors"
            >
              {t.brokerButton}
            </a>

            {/* Owner Button */}
            <Link
              href="/list-property/register"
              onClick={onClose}
              className="flex items-center justify-center w-full py-4 px-6 bg-white border-2 border-secondary hover:bg-secondary/5 text-primary font-semibold rounded-xl transition-colors"
            >
              {t.ownerButton}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

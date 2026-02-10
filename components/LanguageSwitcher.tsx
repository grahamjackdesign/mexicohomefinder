'use client';

import { useTranslations } from './TranslationProvider';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslations();

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
      <button
        onClick={() => setLocale('es')}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
          locale === 'es'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
          locale === 'en'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        EN
      </button>
    </div>
  );
}

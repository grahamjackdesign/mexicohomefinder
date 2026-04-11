'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Home, Globe, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const content = {
  en: {
    title: 'Reset Your Password',
    subtitle: 'Click the button below to confirm your identity',
    button: 'Confirm & Continue',
    confirming: 'Confirming...',
    switchLang: 'Español',
    expiredTitle: 'Link Expired',
    expiredMessage: 'This reset link is invalid or has already been used. Please request a new one.',
    requestNew: 'Request New Link',
  },
  es: {
    title: 'Restablecer Contraseña',
    subtitle: 'Haz clic en el botón para confirmar tu identidad',
    button: 'Confirmar y Continuar',
    confirming: 'Confirmando...',
    switchLang: 'English',
    expiredTitle: 'Enlace Expirado',
    expiredMessage: 'Este enlace no es válido o ya fue usado. Por favor solicita uno nuevo.',
    requestNew: 'Solicitar Nuevo Enlace',
  },
};

type PageState = 'ready' | 'confirming' | 'expired';

export default function AuthConfirmPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [pageState, setPageState] = useState<PageState>('ready');
  const [tokenHash, setTokenHash] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = content[lang];

  useEffect(() => {
    const hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    if (!hash || type !== 'recovery') {
      setPageState('expired');
    } else {
      setTokenHash(hash);
    }
  }, [searchParams]);

  const handleConfirm = async () => {
    if (!tokenHash) return;
    setPageState('confirming');

    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'recovery',
    });

    if (error) {
      setPageState('expired');
    } else {
      router.push('/list-property/reset-password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#C1714F' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5" style={{ backgroundColor: '#1B2B4B' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5" style={{ color: '#C1714F' }} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{t.title}</h1>
                <p className="text-white/70 text-sm">{t.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              {t.switchLang}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">

          {(pageState === 'ready' || pageState === 'confirming') && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" style={{ color: '#1B2B4B' }} />
              </div>
              <button
                onClick={handleConfirm}
                disabled={pageState === 'confirming'}
                className="w-full py-3 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#C1714F' }}
              >
                {pageState === 'confirming' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.confirming}
                  </>
                ) : t.button}
              </button>
            </div>
          )}

          {pageState === 'expired' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1B2B4B' }}>{t.expiredTitle}</h2>
              <p className="text-gray-600 mb-6">{t.expiredMessage}</p>
              <Link
                href="/list-property/forgot-password"
                className="inline-block px-6 py-2.5 text-white font-semibold rounded-xl transition-colors"
                style={{ backgroundColor: '#C1714F' }}
              >
                {t.requestNew}
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

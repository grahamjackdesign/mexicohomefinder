'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Mail, ArrowLeft, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const content = {
  en: {
    title: 'Forgot Password',
    subtitle: 'Enter your email to receive a reset link',
    email: 'Email Address',
    sendLink: 'Send Reset Link',
    sending: 'Sending...',
    back: 'Back to Login',
    switchLang: 'Español',
    successTitle: 'Check Your Email',
    successMessage: "We've sent a password reset link to your email. Please check your inbox and click the link to reset your password.",
    successNote: 'The link will expire in 1 hour.',
    backToLogin: 'Back to Login',
    errorGeneric: 'Something went wrong. Please try again.',
    googleTitle: 'You signed up with Google',
    googleMessage: "This email address is linked to a Google account. You don't need a password — just use the Google sign-in button on the login page.",
    googleButton: 'Back to Login',
  },
  es: {
    title: 'Recuperar Contraseña',
    subtitle: 'Ingresa tu correo para recibir un enlace de restablecimiento',
    email: 'Correo Electrónico',
    sendLink: 'Enviar Enlace',
    sending: 'Enviando...',
    back: 'Volver al Login',
    switchLang: 'English',
    successTitle: 'Revisa Tu Correo',
    successMessage: 'Hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y haz clic en el enlace.',
    successNote: 'El enlace expirará en 1 hora.',
    backToLogin: 'Volver al Login',
    errorGeneric: 'Algo salió mal. Por favor intenta de nuevo.',
    googleTitle: 'Registrado con Google',
    googleMessage: 'Este correo está vinculado a una cuenta de Google. No necesitas contraseña — usa el botón de Google en la página de inicio de sesión.',
    googleButton: 'Volver al Login',
  },
};

type State = 'form' | 'sent' | 'google';

export default function ForgotPasswordPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState<State>('form');

  const t = content[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const checkRes = await fetch('/api/auth/check-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const { provider } = await checkRes.json();

      if (provider === 'google') {
        setState('google');
        return;
      }

      // Email/password user — send reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (resetError) throw resetError;

      setState('sent');
    } catch (err: any) {
      setError(err.message || t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/list-property/login"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">{t.back}</span>
            </Link>
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              {t.switchLang}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t.title}</h1>
              <p className="text-white/70 text-sm">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {state === 'sent' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">{t.successTitle}</h2>
              <p className="text-gray-600 mb-2">{t.successMessage}</p>
              <p className="text-sm text-gray-500 mb-6">{t.successNote}</p>
              <Link
                href="/list-property/login"
                className="inline-block px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-xl transition-colors"
              >
                {t.backToLogin}
              </Link>
            </div>
          )}

          {state === 'google' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Google G */}
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">{t.googleTitle}</h2>
              <p className="text-gray-600 mb-6">{t.googleMessage}</p>
              <Link
                href="/list-property/login"
                className="inline-block px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-xl transition-colors"
              >
                {t.googleButton}
              </Link>
            </div>
          )}

          {state === 'form' && (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-secondary hover:bg-secondary-dark disabled:bg-secondary/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    t.sendLink
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

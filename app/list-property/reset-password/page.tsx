'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Globe, CheckCircle, Eye, EyeOff, AlertCircle, Home } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const content = {
  en: {
    title: 'Reset Password',
    subtitle: 'Enter your new password below',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    resetButton: 'Reset Password',
    switchLang: 'Español',
    successTitle: 'Password Updated!',
    successMessage: 'Your password has been reset successfully. You can now sign in with your new password.',
    signIn: 'Sign In',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordsMismatch: 'Passwords do not match',
    errorGeneric: 'Something went wrong. Please try again.',
    errorExpired: 'This reset link has expired or is invalid. Please request a new one.',
    requestNew: 'Request New Link',
    loading: 'Verifying your link...',
  },
  es: {
    title: 'Restablecer Contraseña',
    subtitle: 'Ingresa tu nueva contraseña',
    newPassword: 'Nueva Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    resetButton: 'Restablecer Contraseña',
    switchLang: 'English',
    successTitle: '¡Contraseña Actualizada!',
    successMessage: 'Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.',
    signIn: 'Iniciar Sesión',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
    passwordsMismatch: 'Las contraseñas no coinciden',
    errorGeneric: 'Algo salió mal. Por favor intenta de nuevo.',
    errorExpired: 'Este enlace ha expirado o no es válido. Por favor solicita uno nuevo.',
    requestNew: 'Solicitar Nuevo Enlace',
    loading: 'Verificando tu enlace...',
  },
};

type PageState = 'loading' | 'ready' | 'expired' | 'success';

export default function ResetPasswordPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageState, setPageState] = useState<PageState>('loading');
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });

  const t = content[lang];

  useEffect(() => {
    const init = async () => {
      // Get the code from the URL — passed by the callback route
      const code = new URLSearchParams(window.location.search).get('code');

      if (code) {
        // Exchange the code client-side so the session lives in the browser
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        console.log('exchangeCodeForSession:', !!data.session, error?.message);
        if (data.session) {
          setPageState('ready');
        } else {
          setPageState('expired');
        }
      } else {
        // No code — check if there's already a valid session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setPageState('ready');
        } else {
          setPageState('expired');
        }
      }
    };

    init();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError(t.passwordMinLength);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordsMismatch);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: formData.password });

      if (error) throw error;

      setPageState('success');
    } catch (err: any) {
      setError(err.message || t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  const Header = () => (
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
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#C1714F' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <Header />
        <div className="p-6">

          {pageState === 'loading' && (
            <div className="py-10 flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">{t.loading}</p>
            </div>
          )}

          {pageState === 'expired' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-600 mb-6">{t.errorExpired}</p>
              <Link
                href="/list-property/forgot-password"
                className="inline-block px-6 py-2.5 text-white font-semibold rounded-xl transition-colors"
                style={{ backgroundColor: '#C1714F' }}
              >
                {t.requestNew}
              </Link>
            </div>
          )}

          {pageState === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1B2B4B' }}>{t.successTitle}</h2>
              <p className="text-gray-600 mb-6">{t.successMessage}</p>
              <Link
                href="/list-property/login"
                className="inline-block px-6 py-2.5 text-white font-semibold rounded-xl transition-colors"
                style={{ backgroundColor: '#C1714F' }}
              >
                {t.signIn}
              </Link>
            </div>
          )}

          {pageState === 'ready' && (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.newPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.confirmPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: '#C1714F' }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : t.resetButton}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

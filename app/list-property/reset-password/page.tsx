'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Lock, ArrowLeft, Globe, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const content = {
  en: {
    title: 'Reset Password',
    subtitle: 'Enter your new password below',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    resetButton: 'Reset Password',
    resetting: 'Resetting...',
    switchLang: 'Español',
    successTitle: 'Password Updated!',
    successMessage: 'Your password has been reset successfully. You can now sign in with your new password.',
    signIn: 'Sign In',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordsMismatch: 'Passwords do not match',
    errorGeneric: 'Something went wrong. Please try again.',
    errorExpired: 'This reset link has expired or is invalid. Please request a new one.',
    requestNew: 'Request New Link',
  },
  es: {
    title: 'Restablecer Contraseña',
    subtitle: 'Ingresa tu nueva contraseña',
    newPassword: 'Nueva Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    resetButton: 'Restablecer Contraseña',
    resetting: 'Restableciendo...',
    switchLang: 'English',
    successTitle: '¡Contraseña Actualizada!',
    successMessage: 'Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.',
    signIn: 'Iniciar Sesión',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
    passwordsMismatch: 'Las contraseñas no coinciden',
    errorGeneric: 'Algo salió mal. Por favor intenta de nuevo.',
    errorExpired: 'Este enlace ha expirado o no es válido. Por favor solicita uno nuevo.',
    requestNew: 'Solicitar Nuevo Enlace',
  },
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const t = content[lang];

  useEffect(() => {
    // Check if the user has a valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionValid(!!session);
    };

    // Listen for auth events (SIGNED_IN from recovery link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionValid(true);
      }
    });

    checkSession();

    return () => subscription.unsubscribe();
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
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking session
  if (sessionValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Invalid/expired link
  if (sessionValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="bg-primary px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-secondary" />
              </div>
              <h1 className="text-xl font-bold text-white">{t.title}</h1>
            </div>
          </div>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-600 mb-6">{t.errorExpired}</p>
            <Link
              href="/list-property/forgot-password"
              className="inline-block px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-xl transition-colors"
            >
              {t.requestNew}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div />
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
          {success ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">{t.successTitle}</h2>
              <p className="text-gray-600 mb-6">{t.successMessage}</p>
              <Link
                href="/list-property/login"
                className="inline-block px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-xl transition-colors"
              >
                {t.signIn}
              </Link>
            </div>
          ) : (
            /* Form */
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t.newPassword}
                  </label>
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
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t.confirmPassword}
                  </label>
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
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
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
                    t.resetButton
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

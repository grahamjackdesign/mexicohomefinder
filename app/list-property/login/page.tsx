'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Mail, Lock, ArrowLeft, Eye, EyeOff, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const content = {
  en: {
    title: 'Welcome Back',
    subtitle: 'Sign in to manage your property listing',
    email: 'Email Address',
    password: 'Password',
    signIn: 'Sign In',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    createAccount: 'Create Account',
    back: 'Back',
    switchLang: 'Español',
    orContinueWith: 'or continue with',
    continueWithGoogle: 'Continue with Google',
    invalidCredentials: 'Invalid email or password',
  },
  es: {
    title: 'Bienvenido',
    subtitle: 'Inicia sesión para gestionar tu propiedad',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    signIn: 'Iniciar Sesión',
    forgotPassword: '¿Olvidaste tu contraseña?',
    noAccount: '¿No tienes cuenta?',
    createAccount: 'Crear Cuenta',
    back: 'Atrás',
    switchLang: 'English',
    orContinueWith: 'o continuar con',
    continueWithGoogle: 'Continuar con Google',
    invalidCredentials: 'Correo o contraseña inválidos',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const t = content[lang];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/list-property/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.session) {
        router.push('/list-property/dashboard');
      }
    } catch (err: any) {
      setError(t.invalidCredentials);
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
              href="/"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 px-4 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-medium text-gray-700 transition-colors flex items-center justify-center gap-3"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t.continueWithGoogle}
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">{t.orContinueWith}</span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t.email}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
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

          {/* Forgot Password */}
          <div className="text-right">
            <Link href="/list-property/forgot-password" className="text-sm text-secondary hover:underline">
              {t.forgotPassword}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-secondary hover:bg-secondary-dark disabled:bg-secondary/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t.signIn
            )}
          </button>

          {/* Create Account Link */}
          <p className="text-center text-sm text-gray-600">
            {t.noAccount}{' '}
            <Link href="/list-property/register" className="text-secondary hover:underline font-medium">
              {t.createAccount}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

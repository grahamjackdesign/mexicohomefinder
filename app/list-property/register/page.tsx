'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Mail, Lock, User, Phone, ArrowLeft, Eye, EyeOff, Globe, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const content = {
  en: {
    title: 'Create Your Account',
    subtitle: 'List your property on MexicoHomeFinder',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phone: 'Phone Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    termsPrefix: 'I agree to the',
    terms: 'Terms of Service',
    termsAnd: 'and',
    privacy: 'Privacy Policy',
    createAccount: 'Create Account',
    alreadyHave: 'Already have an account?',
    signIn: 'Sign In',
    back: 'Back',
    switchLang: 'Español',
    passwordHint: 'At least 8 characters',
    phonePlaceholder: '+52 xxx xxx xxxx',
    successTitle: 'Account Created!',
    successMessage: 'Your account has been created. You can now log in and list your property.',
    goToLogin: 'Go to Login',
    orContinueWith: 'or continue with',
    continueWithGoogle: 'Continue with Google',
  },
  es: {
    title: 'Crea Tu Cuenta',
    subtitle: 'Publica tu propiedad en MexicoHomeFinder',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo Electrónico',
    phone: 'Número de Teléfono',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    termsPrefix: 'Acepto los',
    terms: 'Términos de Servicio',
    termsAnd: 'y la',
    privacy: 'Política de Privacidad',
    createAccount: 'Crear Cuenta',
    alreadyHave: '¿Ya tienes una cuenta?',
    signIn: 'Iniciar Sesión',
    back: 'Atrás',
    switchLang: 'English',
    passwordHint: 'Mínimo 8 caracteres',
    phonePlaceholder: '+52 xxx xxx xxxx',
    successTitle: '¡Cuenta Creada!',
    successMessage: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión y publicar tu propiedad.',
    goToLogin: 'Ir a Iniciar Sesión',
    orContinueWith: 'o continuar con',
    continueWithGoogle: 'Continuar con Google',
  },
};

export default function RegisterPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const t = content[lang];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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

      if (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message || (lang === 'en' ? 'Failed to sign in with Google' : 'Error al iniciar sesión con Google'));
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(lang === 'en' ? 'Passwords do not match' : 'Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError(lang === 'en' ? 'Password must be at least 8 characters' : 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!formData.agreeToTerms) {
      setError(lang === 'en' ? 'Please agree to the terms' : 'Por favor acepta los términos');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || (lang === 'en' ? 'Something went wrong' : 'Algo salió mal'));
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-4">{t.successTitle}</h1>
          <p className="text-gray-600 mb-8">{t.successMessage}</p>
          <Link
            href="/list-property/login"
            className="inline-block w-full py-3 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-xl transition-colors"
          >
            {t.goToLogin}
          </Link>
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

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t.firstName}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t.lastName}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors"
              />
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

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t.phone}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t.phonePlaceholder}
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
            <p className="text-xs text-gray-500 mt-1">{t.passwordHint}</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t.confirmPassword}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agreeToTerms"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
              {t.termsPrefix}{' '}
              <Link href="/terms" className="text-secondary hover:underline">
                {t.terms}
              </Link>{' '}
              {t.termsAnd}{' '}
              <Link href="/privacy" className="text-secondary hover:underline">
                {t.privacy}
              </Link>
            </label>
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
              t.createAccount
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600">
            {t.alreadyHave}{' '}
            <Link href="/list-property/login" className="text-secondary hover:underline font-medium">
              {t.signIn}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

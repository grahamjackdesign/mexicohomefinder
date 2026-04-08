'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const t = {
  en: {
    title: 'Create your account',
    subtitle: 'List your property on Mexico Home Finder and reach thousands of American, Canadian and European buyers.',
    name: 'Full name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company name',
    companyOptional: '(optional)',
    password: 'Password',
    professional: "I'm a real estate professional (agent, broker, or developer)",
    submit: 'Create account',
    submitting: 'Creating account...',
    signin: 'Already have an account?',
    signinLink: 'Sign in',
  },
  es: {
    title: 'Crea tu cuenta',
    subtitle: 'Publica tu propiedad en Mexico Home Finder y llega a miles de compradores de Estados Unidos, Canadá y Europa.',
    name: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    company: 'Nombre de la empresa',
    companyOptional: '(opcional)',
    password: 'Contraseña',
    professional: 'Soy profesional inmobiliario (agente, broker o desarrollador)',
    submit: 'Crear cuenta',
    submitting: 'Creando cuenta...',
    signin: '¿Ya tienes una cuenta?',
    signinLink: 'Inicia sesión',
  },
}

export default function RegisterPage() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'es'>('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    password: '',
    is_professional: false,
  })

  const copy = t[lang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/list-property/dashboard')
  }

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        {/* Language toggle */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center bg-gray-100 rounded-lg p-1 text-sm font-medium">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-md transition ${
                lang === 'en' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('es')}
              className={`px-3 py-1 rounded-md transition ${
                lang === 'es' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ES
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{copy.title}</h1>
        <p className="text-gray-500 text-sm mb-6">{copy.subtitle}</p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{copy.name}</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{copy.email}</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => set('email', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{copy.phone}</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {copy.company} <span className="text-gray-400">{copy.companyOptional}</span>
            </label>
            <input
              type="text"
              value={form.company_name}
              onChange={e => set('company_name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{copy.password}</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={e => set('password', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="is_professional"
              checked={form.is_professional}
              onChange={e => set('is_professional', e.target.checked)}
              className="mt-0.5"
            />
            <label htmlFor="is_professional" className="text-sm text-gray-600">
              {copy.professional}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? copy.submitting : copy.submit}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {copy.signin}{' '}
          <Link href="/list-property/login" className="text-blue-600 hover:underline">
            {copy.signinLink}
          </Link>
        </p>
      </div>
    </div>
  )
}
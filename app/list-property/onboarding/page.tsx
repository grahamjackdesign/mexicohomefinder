'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Phone, Building2, ArrowRight, Globe } from 'lucide-react';

const copy = {
  en: {
    title: 'Almost there!',
    subtitle: 'Just a couple more details to set up your account.',
    phone: 'Phone Number',
    phonePlaceholder: '+52 xxx xxx xxxx',
    company: 'Company Name',
    companyPlaceholder: 'Optional — leave blank if listing personally',
    save: 'Go to dashboard',
    saving: 'Saving...',
    switchLang: 'Español',
  },
  es: {
    title: '¡Casi listo!',
    subtitle: 'Solo un par de detalles más para configurar tu cuenta.',
    phone: 'Número de Teléfono',
    phonePlaceholder: '+52 xxx xxx xxxx',
    company: 'Nombre de la Empresa',
    companyPlaceholder: 'Opcional — deja en blanco si publicas como particular',
    save: 'Ir al panel',
    saving: 'Guardando...',
    switchLang: 'English',
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agentUserId, setAgentUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    phone: '',
    company_name: '',
  });

  const t = copy[lang];

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/list-property/login');
      return;
    }

    const { data: agentUser } = await supabase
      .from('agent_users')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (!agentUser) {
      router.push('/list-property/login');
      return;
    }

    setAgentUserId(agentUser.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentUserId) return;
    setLoading(true);
    setError('');

    const { error: updateError } = await supabase
    .from('agent_users')
    .update({
      phone: formData.phone || null,
      company_name: formData.company_name || null,
      role: formData.company_name.trim() ? 'agent' : 'public',
    })
    .eq('id', agentUserId);

    if (updateError) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    router.push('/list-property/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #243a63 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <img src="/Asset_1.svg" alt="MexicoHomeFinder" className="h-8 w-auto" />
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              {t.switchLang}
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t.phone}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={t.phonePlaceholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t.company}
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.company_name}
                onChange={e => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder={t.companyPlaceholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 flex items-center justify-center gap-2 text-white font-semibold rounded-xl transition-all hover:brightness-110 disabled:opacity-50"
            style={{ backgroundColor: '#C1714F' }}
          >
            {loading ? t.saving : (
              <>
                {t.save}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

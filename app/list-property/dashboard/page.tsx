'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogOut, User, Home, Plus, Eye, Edit, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

const copy = {
  en: {
    welcome: 'Welcome to your dashboard',
    welcomeSub: 'Manage your property listings on Mexico Home Finder.',
    listings: 'Your listings',
    createBtn: 'List a property',
    editBtn: 'Edit',
    viewBtn: 'View on site',
    logout: 'Sign out',
    noListingsYet: 'No listings yet',
    noListingsDesc: 'Get started by listing your first property.',
    unlimitedNote: 'Enjoy unlimited listings on Mexico Home Finder — completely free.',
    status: {
      draft: 'Draft',
      pending: 'Under review',
      approved: 'Approved & Live',
      active: 'Live',
      resubmit: 'Update required',
      rejected: 'Rejected',
    },
    statusMsg: {
      approved: 'Your property is live on Mexico Home Finder.',
      pending: "Being reviewed. We'll notify you by email.",
      resubmit: "Please update your listing and resubmit.",
    },
    rejection: {
      title: 'Listing not approved',
      feedbackLabel: 'Reason:',
    },
  },
  es: {
    welcome: 'Bienvenido a tu panel',
    welcomeSub: 'Administra tus propiedades en Mexico Home Finder.',
    listings: 'Tus publicaciones',
    createBtn: 'Publicar una propiedad',
    editBtn: 'Editar',
    viewBtn: 'Ver en el sitio',
    logout: 'Cerrar sesión',
    noListingsYet: 'Sin publicaciones aún',
    noListingsDesc: 'Comienza publicando tu primera propiedad.',
    unlimitedNote: 'Disfruta publicaciones ilimitadas en Mexico Home Finder — completamente gratis.',
    status: {
      draft: 'Borrador',
      pending: 'En revisión',
      approved: 'Aprobada y publicada',
      active: 'Publicada',
      resubmit: 'Actualización requerida',
      rejected: 'Rechazada',
    },
    statusMsg: {
      approved: 'Tu propiedad está publicada en Mexico Home Finder.',
      pending: 'En revisión. Te notificaremos por correo.',
      resubmit: 'Por favor actualiza tu publicación y vuelve a enviarla.',
    },
    rejection: {
      title: 'Publicación no aprobada',
      feedbackLabel: 'Motivo:',
    },
  },
};

type PropertyData = {
  id: string;
  title: string;
  neighborhood: string;
  state: string;
  status: 'draft' | 'pending' | 'active' | 'rejected';
  approval_status: 'pending' | 'approved' | 'resubmit' | 'rejected';
  rejection_reason?: string;
};

type AgentUser = {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  company_name?: string;
};

export default function DashboardLandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [agentUser, setAgentUser] = useState<AgentUser | null>(null);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [lang, setLang] = useState<'en' | 'es'>('en');

  const c = copy[lang];

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/list-property/login');
        return;
      }

      // Get agent_user row via auth UID
      const { data: agentUserData, error: agentError } = await supabase
        .from('agent_users')
        .select('id, user_id, email, name, company_name')
        .eq('user_id', session.user.id)
        .single();

      if (agentError || !agentUserData) {
        // No agent_user row yet — could happen if registration didn't complete
        router.push('/list-property/login');
        return;
      }

      setAgentUser(agentUserData);

      // Get their properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('id, title, neighborhood, state, status, approval_status, rejection_reason')
        .eq('agent_user_id', agentUserData.id)
        .order('created_at', { ascending: false });

      setProperties(propertiesData || []);

    } catch (err) {
      console.error('Error checking user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleAddListing = () => {
    // Only callable when gatingStatus === 'can_add'
    router.push('/list-property/dashboard/properties');
  };

  const getStatusBadge = (approval_status: string) => {
    switch (approval_status) {
      case 'draft':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"><Clock className="w-4 h-4" />{c.status.draft}</span>;
      case 'pending':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"><AlertCircle className="w-4 h-4" />{c.status.pending}</span>;
      case 'approved':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"><CheckCircle className="w-4 h-4" />{c.status.approved}</span>;
      case 'resubmit':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"><AlertCircle className="w-4 h-4" />{c.status.resubmit}</span>;
      case 'rejected':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"><XCircle className="w-4 h-4" />{c.status.rejected}</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!agentUser) return null;

  const displayName = agentUser.name || agentUser.email;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/Asset_1.svg" alt="MexicoHomeFinder" className="h-9 w-auto" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 text-sm font-medium">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 rounded-md transition ${lang === 'en' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('es')}
                  className={`px-3 py-1 rounded-md transition ${lang === 'es' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ES
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{c.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{c.welcome}</h1>
          <p className="text-gray-500 mt-1">{c.welcomeSub}</p>
        </div>

        {/* Unlimited note */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-3 flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <p className="text-sm text-gray-600">{c.unlimitedNote}</p>
        </div>

        {/* Listings section */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">{c.listings}</h2>
            <button
              onClick={handleAddListing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              {c.createBtn}
            </button>
          </div>

          {/* Empty state */}
          {properties.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Home className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">{c.noListingsYet}</p>
              <p className="text-gray-400 text-sm mt-1">{c.noListingsDesc}</p>
            </div>
          )}

          {/* Property rows */}
          {properties.map((property, idx) => (
            <div
              key={property.id}
              className={`px-6 py-4 flex items-start justify-between gap-4 flex-wrap ${idx !== properties.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <p className="text-gray-800 font-medium truncate">{property.title}</p>
                  {getStatusBadge(property.approval_status)}
                </div>
                <p className="text-gray-400 text-sm">
                  {property.neighborhood && `${property.neighborhood}, `}{property.state}
                </p>
                {property.approval_status === 'pending' && (
                  <p className="text-xs text-gray-500 mt-1">{c.statusMsg.pending}</p>
                )}
                {property.approval_status === 'approved' && (
                  <p className="text-xs text-green-600 mt-1">{c.statusMsg.approved}</p>
                )}
                {property.approval_status === 'resubmit' && (
                  <p className="text-xs text-orange-600 mt-1">{c.statusMsg.resubmit}</p>
                )}
                {property.approval_status === 'resubmit' && property.rejection_reason && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="font-medium">{c.rejection.feedbackLabel}</span> {property.rejection_reason}
                  </p>
                )}
                {property.approval_status === 'rejected' && property.rejection_reason && (
                  <p className="text-xs text-red-600 mt-1">
                    <span className="font-medium">{c.rejection.feedbackLabel}</span> {property.rejection_reason}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => router.push(`/list-property/dashboard/properties/${property.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  {c.editBtn}
                </button>
                {property.approval_status === 'approved' && (
                  <Link
                    href={`/properties/${property.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {c.viewBtn}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note for professionals */}
        {agentUser.company_name && (
          <p className="text-xs text-gray-400 text-center">{c.unlimitedNote}</p>
        )}

        {/* Stripe upgrade banner — commented out until monetisation is enabled
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ height: '200px', background: 'linear-gradient(135deg, #1B2B4B 0%, #243a63 60%, #2a4a7a 100%)' }}
        >
        </div>
        */}

      </main>
    </div>
  );
}

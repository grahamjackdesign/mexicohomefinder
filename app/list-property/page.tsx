'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useTranslations } from '@/components/TranslationProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import PublicPropertyForm from '@/components/PublicPropertyForm';
import { LogOut, User, Clock, CheckCircle, AlertCircle, Eye, XCircle, Edit } from 'lucide-react';

type PropertyData = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  listing_type: 'sale' | 'rent';
  property_category: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lot_size: number;
  address: string;
  neighborhood: string;
  municipality: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  has_pool: boolean;
  has_ac: boolean;
  pets_allowed: boolean;
  parking: number;
  status: 'draft' | 'pending' | 'active' | 'rejected';
  google_maps_link: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
};

type UserData = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslations();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [property, setProperty] = useState<PropertyData | null>(null);

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

      const userData: UserData = {
        id: session.user.id,
        email: session.user.email || '',
        first_name: session.user.user_metadata?.first_name,
        last_name: session.user.user_metadata?.last_name,
      };
      setUser(userData);

      const { data: existingProperty } = await supabase
        .from('properties')
        .select('*')
        .eq('public_user_id', session.user.id)
        .eq('is_public_listing', true)
        .single();

      if (existingProperty) {
        setProperty(existingProperty);
      }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            {t('mhfDashboard.status.draft')}
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            <AlertCircle className="w-4 h-4" />
            {t('mhfDashboard.status.pending')}
          </span>
        );
      case 'active':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            {t('mhfDashboard.status.active')}
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            <XCircle className="w-4 h-4" />
            {t('mhfDashboard.status.rejected')}
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.first_name 
    ? `${user.first_name} ${user.last_name || ''}`.trim() 
    : user.email;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/Asset_1.svg" alt="MexicoHomeFinder" className="h-9 w-auto" />
            </Link>

            {/* Language Switcher, User Info & Logout */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('mhfDashboard.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rejection Banner */}
        {property && property.status === 'rejected' && (
          <div className="mb-6 p-5 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-1">{t('mhfDashboard.rejection.title')}</h3>
                <p className="text-red-700 text-sm mb-3">
                  {t('mhfDashboard.rejection.description')}
                </p>
                {property.rejection_reason && (
                  <div className="bg-white border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">{t('mhfDashboard.rejection.feedbackLabel')}</p>
                    <p className="text-gray-800">{property.rejection_reason}</p>
                  </div>
                )}
                <p className="text-red-600 text-sm mt-3 flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  {t('mhfDashboard.rejection.resubmitHint')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Banner (pending/active) */}
        {property && (property.status === 'pending' || property.status === 'active') && (
          <div className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
            property.status === 'active' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center gap-3">
              {getStatusBadge(property.status)}
              <span className="text-sm text-gray-700">
                {property.status === 'active' 
                  ? t('mhfDashboard.statusMessage.active')
                  : t('mhfDashboard.statusMessage.pending')}
              </span>
            </div>
            {property.status === 'active' && (
              <Link
                href={`/properties/${property.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {t('mhfDashboard.viewListing')}
              </Link>
            )}
          </div>
        )}

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">
            {property 
              ? property.status === 'rejected' 
                ? t('mhfDashboard.pageTitle.resubmit')
                : t('mhfDashboard.pageTitle.edit')
              : t('mhfDashboard.pageTitle.new')}
          </h1>
          <p className="text-gray-600 mt-1">
            {property 
              ? property.status === 'rejected'
                ? t('mhfDashboard.pageSubtitle.resubmit')
                : t('mhfDashboard.pageSubtitle.edit')
              : t('mhfDashboard.pageSubtitle.new')}
          </p>
        </div>

        {/* Property Form */}
        <PublicPropertyForm
          userId={user.id}
          userEmail={user.email}
          userName={userName}
          existingProperty={property || undefined}
        />
      </main>
    </div>
  );
}

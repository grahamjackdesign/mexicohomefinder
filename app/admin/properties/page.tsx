'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle, XCircle, Clock, AlertCircle,
  ChevronDown, ChevronUp, LogOut, Home, MapPin, User, Phone, Mail,
} from 'lucide-react';
import Link from 'next/link';

const RESUBMIT_REASONS = [
  'Not enough photos',
  'Poor description',
  'Information insufficient',
];

const REJECTION_REASONS = [
  'Property not suitable for client base',
  'Duplicate listing',
];

type ApprovalStatus = 'pending' | 'approved' | 'resubmit' | 'rejected';

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  listing_type: string;
  property_category: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  address: string;
  neighborhood: string;
  municipality: string;
  state: string;
  images: string[];
  approval_status: ApprovalStatus;
  show_on_mhf: boolean;
  is_public_listing: boolean;
  rejection_reason?: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  submitted_at: string;
};

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<'mhf' | 'quicklist'>('mhf');

  // MHF submissions state
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'resubmit' | 'rejected'>('pending');
  const [decisions, setDecisions] = useState<Record<string, { action: 'resubmit' | 'rejected'; reason: string }>>({});

  // Quicklist state
  const [quicklist, setQuicklist] = useState<Property[]>([]);
  const [qlFilter, setQlFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [qlDecisions, setQlDecisions] = useState<Record<string, { action: 'resubmit' | 'rejected'; reason: string }>>({});

  // Shared
  const [expanded, setExpanded] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== 'jack@brokerlink.mx') {
      router.push('/');
      return;
    }
    await Promise.all([loadProperties(), loadQuicklist()]);
  };

  const loadProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('site', 'mexico-home-finder')
      .order('created_at', { ascending: false });
    if (!error && data) setProperties(data);
    setLoading(false);
  };

  const loadQuicklist = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_public_listing', true)
      .order('submitted_at', { ascending: false });
    if (!error && data) setQuicklist(data);
  };

  // ── Actions ──────────────────────────────────────────────

  const handleApprove = async (id: string, isQuicklist = false) => {
    setProcessing(id);
    const res = await fetch('/api/admin/update-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        approval_status: 'approved',
        show_on_mhf: true,
        status: 'active',
        rejection_reason: null,
      }),
    });
    if (res.ok) {
      const update = (p: Property) =>
        p.id === id ? { ...p, approval_status: 'approved' as ApprovalStatus, show_on_mhf: true, rejection_reason: undefined } : p;
      if (isQuicklist) setQuicklist(prev => prev.map(update));
      else setProperties(prev => prev.map(update));
    }
    setProcessing(null);
  };

  const handleDecision = async (id: string, isQuicklist = false) => {
    const dec = isQuicklist ? qlDecisions[id] : decisions[id];
    if (!dec?.action || !dec?.reason) {
      alert('Please select an action and a reason.');
      return;
    }
    setProcessing(id);
    const res = await fetch('/api/admin/update-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        approval_status: dec.action,
        show_on_mhf: false,
        rejection_reason: dec.reason,
      }),
    });
    if (res.ok) {
      const update = (p: Property) =>
        p.id === id ? { ...p, approval_status: dec.action as ApprovalStatus, show_on_mhf: false, rejection_reason: dec.reason } : p;
      if (isQuicklist) {
        setQuicklist(prev => prev.map(update));
        setQlDecisions(prev => { const n = { ...prev }; delete n[id]; return n; });
      } else {
        setProperties(prev => prev.map(update));
        setDecisions(prev => { const n = { ...prev }; delete n[id]; return n; });
      }
    }
    setProcessing(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // ── Helpers ───────────────────────────────────────────────

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'pending':   return <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"><AlertCircle className="w-4 h-4" />Pending</span>;
      case 'approved':  return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"><CheckCircle className="w-4 h-4" />Approved</span>;
      case 'resubmit':  return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"><Clock className="w-4 h-4" />Resubmit</span>;
      case 'rejected':  return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"><XCircle className="w-4 h-4" />Rejected</span>;
    }
  };

  const formatPrice = (price: number, currency: string) =>
    `${currency === 'MXN' ? 'MX$' : '$'}${price?.toLocaleString('en-US')} ${currency}`;

  const mhfFiltered = filter === 'all' ? properties : properties.filter(p => p.approval_status === filter);
  const qlFiltered  = qlFilter === 'all' ? quicklist  : quicklist.filter(p => p.approval_status === qlFilter);
  const mhfCount = (f: string) => f === 'all' ? properties.length : properties.filter(p => p.approval_status === f).length;
  const qlCount  = (f: string) => f === 'all' ? quicklist.length  : quicklist.filter(p => p.approval_status === f).length;

  // ── Decision UI (shared between both panels) ──────────────

  const DecisionBlock = ({
    property,
    isQuicklist,
  }: {
    property: Property;
    isQuicklist: boolean;
  }) => {
    const dec = isQuicklist ? qlDecisions[property.id] : decisions[property.id];
    const setDec = (val: { action: 'resubmit' | 'rejected'; reason: string }) => {
      if (isQuicklist) setQlDecisions(prev => ({ ...prev, [property.id]: val }));
      else setDecisions(prev => ({ ...prev, [property.id]: val }));
    };

    return (
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-2">
          <select
            value={dec?.action || ''}
            onChange={e => setDec({ action: e.target.value as 'resubmit' | 'rejected', reason: '' })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">Select action...</option>
            <option value="resubmit">Request resubmission</option>
            <option value="rejected">Reject outright</option>
          </select>
          {dec?.action && (
            <select
              value={dec?.reason || ''}
              onChange={e => setDec({ ...dec, reason: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="">Select reason...</option>
              {(dec.action === 'resubmit' ? RESUBMIT_REASONS : REJECTION_REASONS).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          )}
        </div>
        <button
          onClick={() => handleDecision(property.id, isQuicklist)}
          disabled={processing === property.id || !dec?.reason}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition disabled:opacity-30 self-start mt-0.5"
        >
          Confirm
        </button>
      </div>
    );
  };

  // ── Property card (shared) ────────────────────────────────

  const PropertyCard = ({ property, isQuicklist }: { property: Property; isQuicklist: boolean }) => (
    <div key={property.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(expanded === property.id ? null : property.id)}
      >
        <div className="flex items-center gap-4">
          {property.images?.[0] ? (
            <img src={property.images[0]} alt={property.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
          ) : (
            <div className="w-16 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
              <Home className="w-5 h-5 text-gray-300" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{property.title}</p>
            <p className="text-sm text-gray-400">
              {property.neighborhood && `${property.neighborhood}, `}{property.state} · {property.contact_name} · {property.contact_email}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {isQuicklist
                ? `Submitted ${property.submitted_at ? new Date(property.submitted_at).toLocaleDateString() : '—'}`
                : `Submitted ${new Date(property.created_at).toLocaleDateString()}`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(property.approval_status)}
          {expanded === property.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {expanded === property.id && (
        <div className="border-t border-gray-100 p-5 space-y-5">

          {property.images?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {property.images.map((img, i) => (
                <img key={i} src={img} alt={`Photo ${i + 1}`} className="w-40 h-28 object-cover rounded-lg flex-shrink-0" />
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Price</p>
              <p className="font-medium">{formatPrice(property.price, property.currency)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Type</p>
              <p className="font-medium">{property.listing_type} · {property.property_category}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Beds / Baths</p>
              <p className="font-medium">{property.bedrooms} bd / {property.bathrooms} ba</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Size</p>
              <p className="font-medium">{property.sqft} m²</p>
            </div>
          </div>

          {isQuicklist && (
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {property.municipality && (
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" />{[property.neighborhood, property.municipality, property.state].filter(Boolean).join(', ')}</span>
              )}
            </div>
          )}

          {property.description && (
            <div>
              <p className="text-gray-400 text-xs mb-1">Description</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4 text-sm">
            <p className="text-gray-400 text-xs mb-2">Contact</p>
            <p className="font-medium">{property.contact_name}</p>
            <p className="text-gray-600">{property.contact_email} · {property.contact_phone}</p>
          </div>

          {property.rejection_reason && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm">
              <p className="text-xs text-orange-400 mb-1">Reason given</p>
              <p className="text-orange-700">{property.rejection_reason}</p>
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            {property.approval_status !== 'approved' && (
              <button
                onClick={() => handleApprove(property.id, isQuicklist)}
                disabled={processing === property.id}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Approve — publish on MHF
              </button>
            )}
            {property.approval_status === 'approved' && (
              <p className="text-xs text-gray-400">This property is live. You can still take action:</p>
            )}
            <DecisionBlock property={property} isQuicklist={isQuicklist} />
          </div>
        </div>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/">
                <img src="/Asset_1.svg" alt="MexicoHomeFinder" className="h-9 w-auto" />
              </Link>
              <span className="text-sm font-medium text-gray-500 border-l border-gray-200 pl-3">
                Admin — Properties
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Panel switcher */}
        <div className="flex gap-1 mb-8 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <button
            onClick={() => { setPanel('mhf'); setExpanded(null); }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              panel === 'mhf' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            MHF Submissions
            {mhfCount('pending') > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${panel === 'mhf' ? 'bg-blue-500 text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                {mhfCount('pending')}
              </span>
            )}
          </button>
          <button
            onClick={() => { setPanel('quicklist'); setExpanded(null); }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              panel === 'quicklist' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Quicklist
            {qlCount('pending') > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${panel === 'quicklist' ? 'bg-blue-500 text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                {qlCount('pending')}
              </span>
            )}
          </button>
        </div>

        {/* ── MHF Panel ── */}
        {panel === 'mhf' && (
          <>
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {(['pending', 'approved', 'resubmit', 'rejected', 'all'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className="ml-1.5 text-xs opacity-70">({mhfCount(f)})</span>
                </button>
              ))}
            </div>

            {mhfFiltered.length === 0 ? (
              <div className="text-center text-gray-400 py-16">No properties in this category.</div>
            ) : (
              <div className="space-y-4">
                {mhfFiltered.map(p => <PropertyCard key={p.id} property={p} isQuicklist={false} />)}
              </div>
            )}
          </>
        )}

        {/* ── Quicklist Panel ── */}
        {panel === 'quicklist' && (
          <>
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setQlFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    qlFilter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className="ml-1.5 text-xs opacity-70">({qlCount(f)})</span>
                </button>
              ))}
            </div>

            {qlFiltered.length === 0 ? (
              <div className="text-center text-gray-400 py-16">No Quicklist submissions in this category.</div>
            ) : (
              <div className="space-y-4">
                {qlFiltered.map(p => <PropertyCard key={p.id} property={p} isQuicklist={true} />)}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

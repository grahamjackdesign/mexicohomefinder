'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Clock, AlertCircle, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
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
  state: string;
  images: string[];
  approval_status: ApprovalStatus;
  show_on_mhf: boolean;
  rejection_reason?: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
};

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'resubmit' | 'rejected'>('pending');
  const [decisions, setDecisions] = useState<Record<string, { action: 'resubmit' | 'rejected'; reason: string }>>({});

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== 'jack@brokerlink.mx') {
      router.push('/');
      return;
    }
    await loadProperties();
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

  const handleApprove = async (id: string) => {
    setProcessing(id);
    const res = await fetch('/api/admin/update-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approval_status: 'approved', show_on_mhf: true, status: 'active', rejection_reason: null }),
    });
    if (res.ok) {
      setProperties(prev =>
        prev.map(p => p.id === id ? { ...p, approval_status: 'approved', show_on_mhf: true, rejection_reason: undefined } : p)
      );
    }
    setProcessing(null);
  };

  const handleDecision = async (id: string) => {
    const decision = decisions[id];
    if (!decision?.action || !decision?.reason) {
      alert('Please select an action and a reason.');
      return;
    }
    setProcessing(id);
    const res = await fetch('/api/admin/update-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        approval_status: decision.action,
        show_on_mhf: false,
        rejection_reason: decision.reason,
      }),
    });
    if (res.ok) {
      setProperties(prev =>
        prev.map(p => p.id === id ? {
          ...p,
          approval_status: decision.action,
          show_on_mhf: false,
          rejection_reason: decision.reason,
        } : p)
      );
      setDecisions(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
    setProcessing(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getStatusBadge = (approval_status: ApprovalStatus) => {
    switch (approval_status) {
      case 'pending':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"><AlertCircle className="w-4 h-4" />Pending</span>;
      case 'approved':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"><CheckCircle className="w-4 h-4" />Approved</span>;
      case 'resubmit':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"><Clock className="w-4 h-4" />Resubmit</span>;
      case 'rejected':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"><XCircle className="w-4 h-4" />Rejected</span>;
    }
  };

  const filtered = filter === 'all'
    ? properties
    : properties.filter(p => p.approval_status === filter);

  const count = (f: string) => f === 'all'
    ? properties.length
    : properties.filter(p => p.approval_status === f).length;

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
                Admin — MHF Submissions
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

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {(['pending', 'approved', 'resubmit', 'rejected', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 text-xs opacity-70">({count(f)})</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-16">No properties in this category.</div>
        )}

        <div className="space-y-4">
          {filtered.map(property => (
            <div key={property.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpanded(expanded === property.id ? null : property.id)}
              >
                <div className="flex items-center gap-4">
                  {property.images?.[0] && (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{property.title}</p>
                    <p className="text-sm text-gray-400">
                      {property.neighborhood && `${property.neighborhood}, `}{property.state} · {property.contact_name} · {property.contact_email}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {new Date(property.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(property.approval_status)}
                  {expanded === property.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </div>
              </div>

              {expanded === property.id && (
                <div className="border-t border-gray-100 p-5 space-y-5">

                  {property.images?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {property.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Photo ${i + 1}`}
                          className="w-40 h-28 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Price</p>
                      <p className="font-medium">{property.currency} {property.price?.toLocaleString()}</p>
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
                      <p className="font-medium">{property.sqft} sqft</p>
                    </div>
                  </div>

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

                  {/* Actions — always show unless approved */}
                  {property.approval_status !== 'approved' && (
                    <div className="border-t border-gray-100 pt-4 space-y-3">

                      {/* Approve */}
                      <button
                        onClick={() => handleApprove(property.id)}
                        disabled={processing === property.id}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve — publish on MHF
                      </button>

                      {/* Resubmit or Reject with dropdown */}
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                          <select
                            value={decisions[property.id]?.action || ''}
                            onChange={e => setDecisions(prev => ({
                              ...prev,
                              [property.id]: { action: e.target.value as 'resubmit' | 'rejected', reason: '' }
                            }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                          >
                            <option value="">Select action...</option>
                            <option value="resubmit">Request resubmission</option>
                            <option value="rejected">Reject outright</option>
                          </select>

                          {decisions[property.id]?.action && (
                            <select
                              value={decisions[property.id]?.reason || ''}
                              onChange={e => setDecisions(prev => ({
                                ...prev,
                                [property.id]: { ...prev[property.id], reason: e.target.value }
                              }))}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                              <option value="">Select reason...</option>
                              {(decisions[property.id]?.action === 'resubmit'
                                ? RESUBMIT_REASONS
                                : REJECTION_REASONS
                              ).map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <button
                          onClick={() => handleDecision(property.id)}
                          disabled={processing === property.id || !decisions[property.id]?.reason}
                          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition disabled:opacity-30 self-start mt-0.5"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Re-review if already approved */}
                  {property.approval_status === 'approved' && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-400 mb-2">This property is live. You can still take action:</p>
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                          <select
                            value={decisions[property.id]?.action || ''}
                            onChange={e => setDecisions(prev => ({
                              ...prev,
                              [property.id]: { action: e.target.value as 'resubmit' | 'rejected', reason: '' }
                            }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                          >
                            <option value="">Select action...</option>
                            <option value="resubmit">Request resubmission</option>
                            <option value="rejected">Reject outright</option>
                          </select>

                          {decisions[property.id]?.action && (
                            <select
                              value={decisions[property.id]?.reason || ''}
                              onChange={e => setDecisions(prev => ({
                                ...prev,
                                [property.id]: { ...prev[property.id], reason: e.target.value }
                              }))}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                              <option value="">Select reason...</option>
                              {(decisions[property.id]?.action === 'resubmit'
                                ? RESUBMIT_REASONS
                                : REJECTION_REASONS
                              ).map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          )}
                        </div>
                        <button
                          onClick={() => handleDecision(property.id)}
                          disabled={processing === property.id || !decisions[property.id]?.reason}
                          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition disabled:opacity-30 self-start mt-0.5"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
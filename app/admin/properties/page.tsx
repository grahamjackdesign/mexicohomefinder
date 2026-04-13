'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle, XCircle, Clock, AlertCircle,
  ChevronDown, ChevronUp, LogOut, Home, MapPin, Eye,
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
type Panel = 'mhf' | 'quicklist' | 'unlisted' | 'agents';

type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  client_id: string;
  created_at: string;
  source?: string;
  business_name?: string;
  address?: string;
  city?: string;
  state?: string;
  mhf_tier?: string;
  subscription_status?: string;
  property_count: number;
};

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
  site?: string;
};

const UNLISTED_PAGE_SIZE = 50;

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<Panel>('mhf');

  // MHF submissions
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'resubmit' | 'rejected'>('pending');
  const [decisions, setDecisions] = useState<Record<string, { action: 'resubmit' | 'rejected'; reason: string }>>({});

  // Quicklist
  const [quicklist, setQuicklist] = useState<Property[]>([]);
  const [qlFilter, setQlFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [qlDecisions, setQlDecisions] = useState<Record<string, { action: 'resubmit' | 'rejected'; reason: string }>>({});

  // Unlisted
  const [unlisted, setUnlisted] = useState<Property[]>([]);
  const [unlistedTotal, setUnlistedTotal] = useState(0);
  const [unlistedPage, setUnlistedPage] = useState(0);
  const [unlistedLoading, setUnlistedLoading] = useState(false);

  // Live count from DB
  const [liveCount, setLiveCount] = useState(0);

  // Agents
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);

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
    await Promise.all([loadProperties(), loadQuicklist(), loadUnlisted(0), loadLiveCount(), loadAgents()]);
    setLoading(false);
  };

  const loadProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('site', 'mexico-home-finder')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (!error && data) setProperties(data);
  };

  const loadQuicklist = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_public_listing', true)
      .order('submitted_at', { ascending: false })
      .limit(500);
    if (!error && data) setQuicklist(data);
  };

  const loadLiveCount = async () => {
    const { count } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('show_on_mhf', true);
    if (count !== null) setLiveCount(count);
  };

  const loadAgents = async () => {
    setAgentsLoading(true);

    // Fetch all agent_users with their linked client company
    const { data: agentData, error } = await supabase
      .from('agent_users')
      .select(`
        id,
        name,
        email,
        phone,
        client_id,
        created_at,
        source,
        clients (
          business_name,
          address,
          city,
          state,
          mhf_tier,
          subscription_status
        )
      `)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error || !agentData) { setAgentsLoading(false); return; }

    // Fetch property counts per agent
    const { data: propCounts } = await supabase
      .from('properties')
      .select('agent_user_id')
      .not('agent_user_id', 'is', null);

    const countMap: Record<string, number> = {};
    propCounts?.forEach(p => {
      if (p.agent_user_id) countMap[p.agent_user_id] = (countMap[p.agent_user_id] || 0) + 1;
    });

    const merged: Agent[] = agentData.map((a: any) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      phone: a.phone,
      client_id: a.client_id,
      created_at: a.created_at,
      source: a.source,
      business_name: a.clients?.business_name,
      address: a.clients?.address,
      city: a.clients?.city,
      state: a.clients?.state,
      mhf_tier: a.clients?.mhf_tier,
      subscription_status: a.clients?.subscription_status,
      property_count: countMap[a.id] || 0,
    }));

    setAgents(merged);
    setAgentsLoading(false);
  };

  const loadUnlisted = async (page: number) => {
    setUnlistedLoading(true);
    const from = page * UNLISTED_PAGE_SIZE;
    const to = from + UNLISTED_PAGE_SIZE - 1;
    const { data, error, count } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('show_on_mhf', false)
      .order('created_at', { ascending: false })
      .range(from, to);
    if (!error && data) {
      setUnlisted(prev => page === 0 ? data : [...prev, ...data]);
      if (count !== null) setUnlistedTotal(count);
      setUnlistedPage(page);
    }
    setUnlistedLoading(false);
  };

  // ── Actions ──────────────────────────────────────────────

  const handleApprove = async (id: string, source: Panel) => {
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
      if (source === 'unlisted') {
        setUnlisted(prev => prev.filter(p => p.id !== id));
        setUnlistedTotal(prev => prev - 1);
        setLiveCount(prev => prev + 1);
      } else {
        const update = (p: Property) =>
          p.id === id ? { ...p, approval_status: 'approved' as ApprovalStatus, show_on_mhf: true, rejection_reason: undefined } : p;
        if (source === 'quicklist') setQuicklist(prev => prev.map(update));
        else setProperties(prev => prev.map(update));
      }
    }
    setProcessing(null);
  };

  const handleDecision = async (id: string, source: 'mhf' | 'quicklist') => {
    const dec = source === 'quicklist' ? qlDecisions[id] : decisions[id];
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
      if (source === 'quicklist') {
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
      case 'pending':  return <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"><AlertCircle className="w-4 h-4" />Pending</span>;
      case 'approved': return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"><CheckCircle className="w-4 h-4" />Approved</span>;
      case 'resubmit': return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"><Clock className="w-4 h-4" />Resubmit</span>;
      case 'rejected': return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"><XCircle className="w-4 h-4" />Rejected</span>;
    }
  };

  const formatPrice = (price: number, currency: string) =>
    `${currency === 'MXN' ? 'MX$' : '$'}${price?.toLocaleString('en-US')} ${currency}`;

  const mhfFiltered = filter === 'all' ? properties : properties.filter(p => p.approval_status === filter);
  const qlFiltered  = qlFilter === 'all' ? quicklist  : quicklist.filter(p => p.approval_status === qlFilter);
  const mhfCount = (f: string) => f === 'all' ? properties.length : properties.filter(p => p.approval_status === f).length;
  const qlCount  = (f: string) => f === 'all' ? quicklist.length  : quicklist.filter(p => p.approval_status === f).length;

  // ── Decision block ────────────────────────────────────────

  const DecisionBlock = ({ property, source }: { property: Property; source: 'mhf' | 'quicklist' }) => {
    const dec = source === 'quicklist' ? qlDecisions[property.id] : decisions[property.id];
    const setDec = (val: { action: 'resubmit' | 'rejected'; reason: string }) => {
      if (source === 'quicklist') setQlDecisions(prev => ({ ...prev, [property.id]: val }));
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
          onClick={() => handleDecision(property.id, source)}
          disabled={processing === property.id || !dec?.reason}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition disabled:opacity-30 self-start mt-0.5"
        >
          Confirm
        </button>
      </div>
    );
  };

  // ── Expandable card (MHF + Quicklist panels) ──────────────

  const PropertyCard = ({ property, source }: { property: Property; source: 'mhf' | 'quicklist' }) => (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
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
              {[property.neighborhood, property.state].filter(Boolean).join(', ')} · {property.contact_name} · {property.contact_email}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {source === 'quicklist'
                ? `Submitted ${property.submitted_at ? new Date(property.submitted_at).toLocaleDateString() : '—'}`
                : `Added ${new Date(property.created_at).toLocaleDateString()}`}
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
            <div><p className="text-gray-400 text-xs mb-0.5">Price</p><p className="font-medium">{formatPrice(property.price, property.currency)}</p></div>
            <div><p className="text-gray-400 text-xs mb-0.5">Type</p><p className="font-medium">{property.listing_type} · {property.property_category}</p></div>
            <div><p className="text-gray-400 text-xs mb-0.5">Beds / Baths</p><p className="font-medium">{property.bedrooms} bd / {property.bathrooms} ba</p></div>
            <div><p className="text-gray-400 text-xs mb-0.5">Size</p><p className="font-medium">{property.sqft} m²</p></div>
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
          <div className="border-t border-gray-100 pt-4 space-y-3">
            {property.approval_status !== 'approved' && (
              <button
                onClick={() => handleApprove(property.id, source)}
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
            <DecisionBlock property={property} source={source} />
          </div>
        </div>
      )}
    </div>
  );

  // ── Unlisted grid card ────────────────────────────────────

  const UnlistedCard = ({ property }: { property: Property }) => (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="relative w-full h-40 bg-gray-100 flex-shrink-0">
        {property.images?.[0] ? (
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-8 h-8 text-gray-300" />
          </div>
        )}
        {property.images?.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
            +{property.images.length - 1}
          </span>
        )}
        {property.site && (
          <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded capitalize">
            {property.site.replace('mexico-home-finder', 'MHF')}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{property.title}</p>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {[property.neighborhood, property.municipality, property.state].filter(Boolean).join(', ') || '—'}
          </span>
        </div>

        <div className="text-sm font-bold text-gray-800">
          {property.price ? formatPrice(property.price, property.currency) : '—'}
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs text-gray-500">
          {property.listing_type && <span className="px-2 py-0.5 bg-gray-100 rounded capitalize">{property.listing_type}</span>}
          {property.property_category && <span className="px-2 py-0.5 bg-gray-100 rounded capitalize">{property.property_category}</span>}
          {property.bedrooms != null && <span>{property.bedrooms} bd</span>}
          {property.bathrooms != null && <span>{property.bathrooms} ba</span>}
          {property.sqft != null && <span>{property.sqft} m²</span>}
        </div>

        {(property.contact_name || property.contact_phone || property.contact_email) && (
          <div className="border-t border-gray-100 pt-2 mt-1 space-y-0.5">
            {property.contact_name && <p className="text-xs text-gray-600 font-medium truncate">{property.contact_name}</p>}
            {property.contact_phone && <p className="text-xs text-gray-400 truncate">{property.contact_phone}</p>}
            {property.contact_email && <p className="text-xs text-gray-400 truncate">{property.contact_email}</p>}
          </div>
        )}

        <div className="mt-auto pt-3 flex gap-2">
          <button
            onClick={() => handleApprove(property.id, 'unlisted')}
            disabled={processing === property.id}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
          >
            {processing === property.id
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><CheckCircle className="w-3.5 h-3.5" />&nbsp;Publish to MHF</>
            }
          </button>
          <a
            href={`/properties/${property.id}`}
            target="_blank"
            className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition"
            title="Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-green-600">{liveCount}</span> live on MHF
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Panel switcher */}
        <div className="flex gap-1 mb-8 bg-white border border-gray-200 rounded-xl p-1 w-fit flex-wrap">
          {([
            { key: 'mhf' as Panel, label: 'MHF Submissions', badge: mhfCount('pending') },
            { key: 'quicklist' as Panel, label: 'Quicklist', badge: qlCount('pending') },
            { key: 'unlisted' as Panel, label: 'Unlisted on MHF', badge: unlistedTotal },
            { key: 'agents' as Panel, label: 'Agents', badge: agents.length },
          ]).map(({ key, label, badge }) => (
            <button
              key={key}
              onClick={() => { setPanel(key); setExpanded(null); }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                panel === key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
              {badge > 0 && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  panel === key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
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
                {mhfFiltered.map(p => <PropertyCard key={p.id} property={p} source="mhf" />)}
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
                {qlFiltered.map(p => <PropertyCard key={p.id} property={p} source="quicklist" />)}
              </div>
            )}
          </>
        )}

        {/* ── Unlisted Panel ── */}
        {panel === 'unlisted' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Showing{' '}
                <span className="font-semibold text-gray-800">{unlisted.length}</span> of{' '}
                <span className="font-semibold text-gray-800">{unlistedTotal}</span>{' '}
                properties not listed on MHF
              </p>
            </div>
            {unlisted.length === 0 && !unlistedLoading ? (
              <div className="text-center text-gray-400 py-16">No unlisted properties.</div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {unlisted.map(p => <UnlistedCard key={p.id} property={p} />)}
                </div>
                {unlisted.length < unlistedTotal && (
                  <div className="text-center">
                    <button
                      onClick={() => loadUnlisted(unlistedPage + 1)}
                      disabled={unlistedLoading}
                      className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition disabled:opacity-50"
                    >
                      {unlistedLoading ? 'Loading...' : `Load more (${unlistedTotal - unlisted.length} remaining)`}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── Agents Panel ── */}
        {panel === 'agents' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{agents.length}</span> registered agents
              </p>
            </div>
            {agentsLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center text-gray-400 py-16">No agents found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map(agent => (
                  <div key={agent.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">

                    {/* Name + company */}
                    <div>
                      <p className="font-semibold text-gray-900">{agent.name || '—'}</p>
                      {agent.business_name && (
                        <p className="text-xs text-gray-500 mt-0.5">{agent.business_name}</p>
                      )}
                    </div>

                    {/* Contact details */}
                    <div className="space-y-1">
                      {agent.email && (
                        <p className="text-sm text-gray-600 truncate">{agent.email}</p>
                      )}
                      {agent.phone && (
                        <p className="text-sm text-gray-600">{agent.phone}</p>
                      )}
                    </div>

                    {/* Address */}
                    {(agent.address || agent.city || agent.state) && (
                      <div className="flex items-start gap-1.5 text-xs text-gray-400">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{[agent.address, agent.city, agent.state].filter(Boolean).join(', ')}</span>
                      </div>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-gray-100 rounded-full text-gray-600">
                        <Home className="w-3 h-3" />
                        {agent.property_count} {agent.property_count === 1 ? 'property' : 'properties'}
                      </span>
                      {agent.mhf_tier && (
                        <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                          {agent.mhf_tier}
                        </span>
                      )}
                      {agent.subscription_status && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          agent.subscription_status === 'active'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {agent.subscription_status}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                      {agent.email && (
                        <a
                          href={`mailto:${agent.email}`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition"
                        >
                          Email
                        </a>
                      )}
                      {agent.phone && (
                        <a
                          href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition"
                          title="WhatsApp"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L.057 23.617a.75.75 0 00.921.921l5.772-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.93 0-3.736-.502-5.3-1.38l-.38-.22-3.93 1.002 1.021-3.835-.242-.395A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                          </svg>
                        </a>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

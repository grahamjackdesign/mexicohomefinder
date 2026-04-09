import { supabaseServer } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import { CheckCircle, XCircle, Clock, Home, MapPin, Phone, Mail, User, DollarSign } from 'lucide-react';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function approveProperty(id: string) {
  'use server';
  await supabaseAdmin
    .from('properties')
    .update({
      approval_status: 'approved',
      show_on_mhf: true,
      status: 'available',
      approved_at: new Date().toISOString(),
    })
    .eq('id', id);
  revalidatePath('/admin/quicklist');
}

async function rejectProperty(id: string) {
  'use server';
  await supabaseAdmin
    .from('properties')
    .update({
      approval_status: 'rejected',
      show_on_mhf: false,
      rejected_at: new Date().toISOString(),
    })
    .eq('id', id);
  revalidatePath('/admin/quicklist');
}

export default async function AdminQuicklistPage() {
  const { data: pending } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('approval_status', 'pending')
    .eq('is_public_listing', true)
    .order('submitted_at', { ascending: false });

  const { data: recent } = await supabaseAdmin
    .from('properties')
    .select('*')
    .in('approval_status', ['approved', 'rejected'])
    .eq('is_public_listing', true)
    .order('submitted_at', { ascending: false })
    .limit(10);

  const formatPrice = (price: number, currency: string) =>
    `${currency === 'MXN' ? 'MX$' : '$'}${price.toLocaleString('en-US')} ${currency}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Quicklist Approvals</h1>
          <p className="text-gray-500 mt-1">Review and approve property submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pending?.length || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Pending Review</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {recent?.filter((p) => p.approval_status === 'approved').length || 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">Approved (recent)</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-500">
              {recent?.filter((p) => p.approval_status === 'rejected').length || 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">Rejected (recent)</div>
          </div>
        </div>

        {/* Pending */}
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-500" />
          Pending ({pending?.length || 0})
        </h2>

        {!pending || pending.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500 mb-8">
            No pending submissions 🎉
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {pending.map((property: any) => (
              <div key={property.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex gap-0">
                  {/* Image */}
                  <div className="w-48 flex-shrink-0 relative bg-gray-100">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        style={{ minHeight: '160px' }}
                      />
                    ) : (
                      <div className="w-full h-full min-h-[160px] flex items-center justify-center">
                        <Home className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                    {property.images?.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        +{property.images.length - 1} photos
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-bold text-primary text-lg leading-tight">{property.title}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {[property.neighborhood, property.municipality, property.state]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-secondary">
                          {formatPrice(property.price, property.currency)}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 capitalize">
                          {property.listing_type} · {property.property_category}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      {property.bedrooms && <span>{property.bedrooms} bed</span>}
                      {property.bathrooms && <span>{property.bathrooms} bath</span>}
                      {property.sqft && <span>{property.sqft} m²</span>}
                    </div>

                    {property.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{property.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-4">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {property.contact_name}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {property.contact_phone}
                      </span>
                      {property.contact_email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {property.contact_email}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <form action={approveProperty.bind(null, property.id)}>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve & Publish
                        </button>
                      </form>
                      <form action={rejectProperty.bind(null, property.id)}>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-semibold rounded-lg transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </form>
                      <a
                        href={`/properties/${property.id}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                      >
                        Preview
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recently Reviewed */}
        {recent && recent.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-primary mb-4">Recently Reviewed</h2>
            <div className="space-y-2">
              {recent.map((property: any) => (
                <div
                  key={property.id}
                  className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      property.approval_status === 'approved' ? 'bg-green-500' : 'bg-red-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{property.title}</p>
                    <p className="text-sm text-gray-500">{property.contact_name} · {property.contact_phone}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      property.approval_status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {property.approval_status}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

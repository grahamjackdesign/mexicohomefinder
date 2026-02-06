import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';

export const metadata = {
  title: 'Manage Developments | Admin',
  description: 'Manage development microsites',
};

export default async function DevelopmentsAdminPage() {
  const { data: developments } = await supabaseServer
    .from('developments')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary">
              Development Microsites
            </h1>
            <p className="text-gray-600 mt-2">
              Manage custom landing pages for real estate developments
            </p>
          </div>
          <Link
            href="/admin/developments/new"
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Microsite
          </Link>
        </div>

        {/* Developments Grid */}
        {developments && developments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developments.map((dev) => (
              <div
                key={dev.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Preview Banner */}
                <div
                  className="h-32 relative"
                  style={{ backgroundColor: dev.primary_color }}
                >
                  {dev.hero_image_url && (
                    <img
                      src={dev.hero_image_url}
                      alt={dev.name}
                      className="w-full h-full object-cover opacity-40"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {dev.logo_url && (
                        <img
                          src={dev.logo_url}
                          alt={dev.name}
                          className="h-12 w-auto mx-auto mb-2"
                        />
                      )}
                      <h3 className="text-white font-bold text-xl">
                        {dev.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        dev.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {dev.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {dev.featured && (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Slug:</span> /{dev.slug}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Location:</span>{' '}
                    {dev.city}, {dev.state}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {dev.tagline || dev.description}
                  </p>

                  {/* Color Preview */}
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-8 h-8 rounded border border-gray-200"
                      style={{ backgroundColor: dev.primary_color }}
                      title="Primary Color"
                    />
                    <div
                      className="w-8 h-8 rounded border border-gray-200"
                      style={{ backgroundColor: dev.secondary_color }}
                      title="Secondary Color"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${dev.slug}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Link>
                    <Link
                      href={`/admin/developments/${dev.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No microsites yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first development microsite to get started
              </p>
              <Link
                href="/admin/developments/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Microsite
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

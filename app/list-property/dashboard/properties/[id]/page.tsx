'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PublicPropertyForm from '@/components/PublicPropertyForm';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [agentUser, setAgentUser] = useState<{ id: string; user_id: string; email: string; name?: string; phone?: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/list-property/login');
        return;
      }

      // Get agent_user
      const { data: agentUserData, error: agentError } = await supabase
        .from('agent_users')
        .select('id, user_id, email, name, phone')
        .eq('user_id', session.user.id)
        .single();

      if (agentError || !agentUserData) {
        router.push('/list-property/login');
        return;
      }

      setAgentUser(agentUserData);

      // Get the property — must belong to this user
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('agent_user_id', agentUserData.id)
        .single();

      if (propertyError || !propertyData) {
        // Property not found or doesn't belong to this user
        router.push('/list-property/dashboard');
        return;
      }

      setProperty(propertyData);
    } catch (err) {
      console.error('Error loading property:', err);
      router.push('/list-property/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!property) return;
    setDeleting(true);
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', property.id);
    if (error) {
      console.error('Delete error:', error);
      setDeleting(false);
      return;
    }
    router.push('/list-property/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!property || !agentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/list-property/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              ← Back to dashboard
            </button>
            <p className="text-sm text-gray-500 truncate max-w-xs">{property.title}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PublicPropertyForm
          userId={agentUser.user_id}
          userEmail={agentUser.email}
          userName={agentUser.name || ''}
          userPhone={agentUser.phone || ''}
          existingProperty={property}
        />

        {/* Delete listing */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          {!deleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Delete this listing</p>
                <p className="text-xs text-gray-400 mt-0.5">This action cannot be undone.</p>
              </div>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                Delete listing
              </button>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-red-800 mb-1">Are you sure you want to delete this listing?</p>
              <p className="text-xs text-red-600 mb-4">
                <span className="font-medium">{property.title}</span> will be permanently removed and cannot be recovered.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, delete permanently'}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

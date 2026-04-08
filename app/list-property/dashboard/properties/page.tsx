'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PublicPropertyForm from '@/components/PublicPropertyForm';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type AgentUser = {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  phone?: string;
};

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [agentUser, setAgentUser] = useState<AgentUser | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/list-property/login');
        return;
      }

      const { data: agentUserData, error } = await supabase
        .from('agent_users')
        .select('id, user_id, email, name, phone')
        .eq('user_id', session.user.id)
        .single();

      if (error || !agentUserData) {
        router.push('/list-property/login');
        return;
      }

      setAgentUser(agentUserData);
    } catch (err) {
      console.error('Error loading user:', err);
      router.push('/list-property/login');
    } finally {
      setLoading(false);
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
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link href="/">
                <img src="/Asset_1.svg" alt="MexicoHomeFinder" className="h-9 w-auto" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">List your property</h1>
          <p className="text-gray-500 mt-1">Fill in the details below and submit for review.</p>
        </div>
        <PublicPropertyForm
          userId={agentUser.user_id}
          userEmail={agentUser.email}
          userName={agentUser.name || ''}
          userPhone={agentUser.phone || ''}
        />
      </div>
    </div>
  );
}

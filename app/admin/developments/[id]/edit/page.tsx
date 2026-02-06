import DevelopmentForm from '@/components/DevelopmentForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { supabaseServer } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Development | Admin',
};

export default async function EditDevelopmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch the development and test it 
  const { data: development, error } = await supabaseServer
    .from('developments')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !development) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/developments"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Developments
          </Link>
          <h1 className="text-3xl font-display font-bold text-primary">
            Edit {development.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Update microsite settings and content
          </p>
        </div>

        {/* Form */}
        <DevelopmentForm mode="edit" development={development} />
      </div>
    </div>
  );
}

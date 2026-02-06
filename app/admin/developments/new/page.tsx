import DevelopmentForm from '@/components/DevelopmentForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'New Development | Admin',
};

export default function NewDevelopmentPage() {
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
            Create New Microsite
          </h1>
          <p className="text-gray-600 mt-2">
            Set up a custom landing page for a real estate development
          </p>
        </div>

        {/* Form */}
        <DevelopmentForm mode="create" />
      </div>
    </div>
  );
}

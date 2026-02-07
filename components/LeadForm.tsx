'use client';

import { useState } from 'react';
import { Property } from '@/lib/supabase';
import { Send, Phone, Mail, CheckCircle, Loader2 } from 'lucide-react';

type Props = {
  property: Property;
};

export default function LeadForm({ property }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in this property: ${property.title}`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setEmailError('');

    // Validate email before submitting
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: property.id,
          property_title: property.title,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">Inquiry Sent!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for your interest. A local agent will contact you shortly.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              message: `Hi, I'm interested in this property: ${property.title}`,
            });
          }}
          className="text-secondary hover:text-secondary-dark font-medium"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-6">
        <h3 className="text-xl font-bold text-white mb-1">
          Interested in this property?
        </h3>
        <p className="text-gray-300 text-sm">
          Contact a local expert for more information
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              // Clear error when typing
              if (emailError) setEmailError('');
            }}
            onBlur={() => {
              // Validate on blur
              if (formData.email && !validateEmail(formData.email)) {
                setEmailError('Please enter a valid email address');
              }
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary ${
              emailError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {emailError && (
            <p className="text-red-600 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-secondary hover:bg-secondary-dark disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Request Information
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>

      {/* Quick Contact */}
      <div className="border-t border-gray-200 p-6">
        <p className="text-sm text-gray-500 mb-4 text-center">
          Or contact us directly:
        </p>
        <div className="flex gap-3">
          <a
            href="tel:+521234567890"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>
          <a
            href="mailto:info@mexicohomefinder.com"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
        </div>
      </div>
    </div>
  );
}

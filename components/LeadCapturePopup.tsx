// components/LeadCapturePopup.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Download, CheckCircle } from 'lucide-react';

const POPUP_DELAY_MS = 30000; // 30 seconds
const POPUP_STORAGE_KEY = 'mhf_popup_dismissed';
const POPUP_COOLDOWN_DAYS = 7; // Don't show again for 7 days after dismissal

export default function LeadCapturePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if popup was recently dismissed
    const dismissed = localStorage.getItem(POPUP_STORAGE_KEY);
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < POPUP_COOLDOWN_DAYS) {
        return; // Don't show popup
      }
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(POPUP_STORAGE_KEY, new Date().toISOString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, source: 'popup_guide' }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setStatus('success');

      // Trigger PDF download
      window.open('/guides/MHF-Guide-Buying-Property-Mexico-2026.pdf', '_blank');

      // Auto-close after 3 seconds
      setTimeout(() => {
        handleDismiss();
      }, 3000);
    } catch (err: any) {
      setErrorMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {status === 'success' ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ backgroundColor: '#E8EEF4' }}>
              <CheckCircle className="w-8 h-8" style={{ color: '#C85A3E' }} />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#2C4563' }}>
              Your Guide is Downloading!
            </h3>
            <p className="text-gray-600">
              Check your downloads folder. We&apos;ve also sent a copy to your email.
            </p>
          </div>
        ) : (
          <>
            {/* Header with accent */}
            <div className="px-8 pt-8 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                     style={{ backgroundColor: '#E8EEF4' }}>
                  <Download className="w-6 h-6" style={{ color: '#C85A3E' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#C85A3E' }}>
                    Free Guide
                  </p>
                  <h3 className="text-xl font-bold" style={{ color: '#2C4563' }}>
                    Buying Property in Mexico
                  </h3>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                Get our comprehensive 2026 guide covering everything you need to know: 
                legal requirements, costs, top destinations, and step-by-step buying process.
              </p>
            </div>

            {/* What's Inside */}
            <div className="px-8 py-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Property law explained',
                  'Fideicomiso guide',
                  'Cost breakdown',
                  'Top destinations',
                  'Due diligence checklist',
                  'Visa & tax info',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C85A3E' }} />
                    <span style={{ color: '#2C4563' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4">
              {errorMessage && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700">{errorMessage}</p>
                </div>
              )}

              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your first name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:border-transparent transition"
                  style={{ focusRingColor: '#C85A3E' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:border-transparent transition"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 text-sm"
                  style={{ backgroundColor: '#C85A3E' }}
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </span>
                  ) : (
                    'Download Free Guide'
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-3">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

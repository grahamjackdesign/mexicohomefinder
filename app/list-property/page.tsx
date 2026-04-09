'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import {
  Upload,
  X,
  CheckCircle,
  Loader2,
  Home,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  User,
  ChevronDown,
  ImageIcon,
} from 'lucide-react';

export default function ListPropertyPage() {
  const [formData, setFormData] = useState({
    title: '',
    listing_type: 'sale',
    property_category: 'house',
    price: '',
    currency: 'USD',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    neighborhood: '',
    municipality: 'San Miguel de Allende',
    state: 'Guanajuato',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }
    const newImages = [...images, ...files];
    setImages(newImages);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError('');

    if (!formData.title || !formData.price || !formData.contact_name || !formData.contact_phone) {
      setError('Please fill in all required fields.');
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one photo.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      images.forEach((img) => data.append('images', img));

      const response = await fetch('/api/quicklist', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || 'Submission failed');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-3">Listing Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Thanks! We'll review your property and get it live within 24 hours. We'll contact you via WhatsApp once it's approved.
            </p>
            <p className="text-sm text-gray-500">
              Want to manage your listings and receive leads directly? We'll send you an invite to create a free account once your property is approved.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-gray-900 bg-white';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  return (
    <>
      <Header />
      <main className="pt-16 bg-gray-50 min-h-screen">
        {/* Hero */}
        <div className="bg-primary text-white py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Free • Unlimited • No account needed to start
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              List Your Property on Mexico Home Finder
            </h1>
            <p className="text-white/80 text-lg">
              Reach thousands of US buyers actively looking for property in Mexico. It takes less than 5 minutes.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

            {/* Section: Property Details */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-primary">Property Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Property Title *</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Charming Colonial Home in Centro"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Listing Type *</label>
                    <div className="relative">
                      <select
                        className={selectClass}
                        value={formData.listing_type}
                        onChange={(e) => setFormData({ ...formData, listing_type: e.target.value })}
                      >
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Property Type *</label>
                    <div className="relative">
                      <select
                        className={selectClass}
                        value={formData.property_category}
                        onChange={(e) => setFormData({ ...formData, property_category: e.target.value })}
                      >
                        <option value="house">House</option>
                        <option value="condo">Condo / Apartment</option>
                        <option value="land">Land</option>
                        <option value="commercial">Commercial</option>
                        <option value="villa">Villa</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Price *</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="250000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Currency</label>
                    <div className="relative">
                      <select
                        className={selectClass}
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      >
                        <option value="USD">USD</option>
                        <option value="MXN">MXN</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Bedrooms</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="3"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bathrooms</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="2"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Size (m²)</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="180"
                      value={formData.sqft}
                      onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={4}
                    placeholder="Describe your property—key features, condition, nearby amenities..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section: Location */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-primary">Location</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Neighborhood / Colonia</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Centro Histórico, Guadalupe, Atascadero"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Municipality</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={formData.municipality}
                      onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Photos */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-primary">Photos *</h2>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />

              {imagePreviews.length === 0 ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-secondary hover:bg-secondary/5 transition-colors group"
                >
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-secondary mx-auto mb-3 transition-colors" />
                  <p className="font-medium text-gray-700 group-hover:text-secondary transition-colors">Click to upload photos</p>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 10MB each · Max 10 photos</p>
                </button>
              ) : (
                <div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        {i === 0 && (
                          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded font-medium">
                            Cover
                          </div>
                        )}
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length < 10 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-secondary hover:bg-secondary/5 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">Add more</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section: Your Contact Info */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-primary">Your Contact Info</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Your Name *</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Maria García"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>WhatsApp Number *</label>
                    <input
                      type="tel"
                      className={inputClass}
                      placeholder="+52 415 123 4567"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="you@example.com"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="mt-6 w-full py-4 bg-secondary hover:brightness-110 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit My Listing'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Your listing will be reviewed within 24 hours. Completely free — no card required.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

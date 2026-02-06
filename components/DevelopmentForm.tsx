'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Upload } from 'lucide-react';

interface DevelopmentFormProps {
  development?: any; // Existing development data for editing
  mode: 'create' | 'edit';
}

export default function DevelopmentForm({ development, mode }: DevelopmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState<string[]>(
    development?.amenities || []
  );
  const [newAmenity, setNewAmenity] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Collect gallery images (filter out empty ones)
    const galleryImages = [];
    for (let i = 0; i < 6; i++) {
      const imageUrl = formData.get(`gallery_image_${i}`)?.toString().trim();
      if (imageUrl) {
        galleryImages.push(imageUrl);
      }
    }
    
    const data = {
      slug: formData.get('slug'),
      name: formData.get('name'),
      developer_name: formData.get('developer_name'),
      tagline: formData.get('tagline'),
      description: formData.get('description'),
      primary_color: formData.get('primary_color'),
      secondary_color: formData.get('secondary_color'),
      logo_url: formData.get('logo_url'),
      hero_image_url: formData.get('hero_image_url'),
      hero_video_url: formData.get('hero_video_url'),
      gallery_images: galleryImages,
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      map_embed_url: formData.get('map_embed_url'),
      contact_email: formData.get('contact_email'),
      contact_phone: formData.get('contact_phone'),
      contact_whatsapp: formData.get('contact_whatsapp'),
      meta_title: formData.get('meta_title'),
      meta_description: formData.get('meta_description'),
      is_active: formData.get('is_active') === 'on',
      featured: formData.get('featured') === 'on',
      amenities: amenities,
    };

    try {
      const url = mode === 'create' 
        ? '/api/developments'
        : `/api/developments/${development.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/developments');
        router.refresh();
      } else {
        alert('Error saving development');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving development');
    } finally {
      setLoading(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">Basic Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Development Name *
            </label>
            <input
              type="text"
              name="name"
              defaultValue={development?.name}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="La Luminaria"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">/</span>
              <input
                type="text"
                name="slug"
                defaultValue={development?.slug}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="laluminaria"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Developer Name
            </label>
            <input
              type="text"
              name="developer_name"
              defaultValue={development?.developer_name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Luminaria Development Group"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              defaultValue={development?.tagline}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Where Modern Luxury Meets Colonial Charm"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            defaultValue={development?.description}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Experience luxury living in the heart of San Miguel de Allende..."
          />
        </div>
      </div>

      {/* Branding */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">Branding</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="primary_color"
                defaultValue={development?.primary_color || '#1a3a52'}
                className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                defaultValue={development?.primary_color || '#1a3a52'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="#1a3a52"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="secondary_color"
                defaultValue={development?.secondary_color || '#D4745E'}
                className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                defaultValue={development?.secondary_color || '#D4745E'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="#D4745E"
              />
            </div>
          </div>
        </div>

        {/* Image URLs */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              name="logo_url"
              defaultValue={development?.logo_url}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Image URL
            </label>
            <input
              type="url"
              name="hero_image_url"
              defaultValue={development?.hero_image_url}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com/hero.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Video URL (optional)
            </label>
            <input
              type="url"
              name="hero_video_url"
              defaultValue={development?.hero_video_url}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com/hero-video.mp4"
            />
            <p className="text-xs text-gray-500 mt-1">
              If provided, will play instead of hero image
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">Gallery Images</h2>
        
        <div className="space-y-3">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Image {index + 1} URL
              </label>
              <input
                type="url"
                name={`gallery_image_${index}`}
                defaultValue={development?.gallery_images?.[index]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com/gallery-image.jpg"
              />
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          Add up to 6 images for the gallery section. Leave blank if not needed.
        </p>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">Location</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              defaultValue={development?.address}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Camino a Alcocer, San Miguel de Allende"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              defaultValue={development?.city}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="San Miguel de Allende"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              defaultValue={development?.state}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Guanajuato"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Maps Embed URL
            </label>
            <input
              type="url"
              name="map_embed_url"
              defaultValue={development?.map_embed_url}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Go to Google Maps → Share → Embed a map → Copy the URL
            </p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">Amenities</h2>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Add amenity (e.g., Rooftop Pool)"
          />
          <button
            type="button"
            onClick={addAmenity}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-700">{amenity}</span>
              <button
                type="button"
                onClick={() => removeAmenity(index)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">Contact Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              name="contact_email"
              defaultValue={development?.contact_email || 'jack@brokerlink.mx'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="contact_phone"
              defaultValue={development?.contact_phone}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+52 415 123 4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              name="contact_whatsapp"
              defaultValue={development?.contact_whatsapp}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="524151234567"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: country code + number (no + or spaces)
            </p>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">SEO</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              name="meta_title"
              defaultValue={development?.meta_title}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="La Luminaria - Luxury Living in San Miguel de Allende"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              name="meta_description"
              defaultValue={development?.meta_description}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Discover luxury homes in San Miguel de Allende at La Luminaria..."
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">Status</h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={development?.is_active !== false}
              className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <div>
              <span className="font-medium text-gray-900">Active</span>
              <p className="text-sm text-gray-500">
                Microsite is publicly accessible
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={development?.featured}
              className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <div>
              <span className="font-medium text-gray-900">Featured</span>
              <p className="text-sm text-gray-500">
                Highlight this development
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Microsite' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useTranslations } from '@/components/TranslationProvider';
import { getStateNames, getMunicipalitiesByState } from '@/lib/locations';
import imageCompression from 'browser-image-compression';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Upload,
  X,
  MapPin,
  Home,
  Car,
  Save,
  Send,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Building,
  Video,
  GripVertical,
} from 'lucide-react';

const PROPERTY_CATEGORIES = [
  { value: 'house', label: 'House / Casa' },
  { value: 'apartment', label: 'Apartment / Departamento' },
  { value: 'condo', label: 'Condo / Condominio' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'villa', label: 'Villa' },
  { value: 'hacienda', label: 'Hacienda' },
  { value: 'ranch', label: 'Ranch / Rancho' },
  { value: 'land', label: 'Land / Terreno' },
  { value: 'commercial', label: 'Commercial / Comercial' },
];

const LISTING_TYPES = [
  { value: 'sale', label: 'For Sale / En Venta' },
  { value: 'rent', label: 'For Rent / En Renta' },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'MXN', label: 'MXN ($)' },
];

const SECURITY_LEVELS = [
  { value: '', label: 'Select / Seleccionar...' },
  { value: 'Gated & Guard', label: 'Gated & Guard / Vigilancia 24/7' },
  { value: 'Gated', label: 'Gated Community / Fraccionamiento' },
  { value: 'Medium', label: 'Medium / Medio' },
  { value: 'Low', label: 'Low / Bajo' },
];

// Sortable photo component for drag-and-drop reorder
function SortablePhoto({ id, url, index, onRemove }: { id: string; url: string; index: number; onRemove: (index: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto' as any,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
      <div {...attributes} {...listeners} className="absolute inset-0 cursor-grab active:cursor-grabbing z-10">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <GripVertical className="w-8 h-8 text-white opacity-0 group-hover:opacity-70 transition-opacity drop-shadow-lg" />
        </div>
      </div>
      <img src={url} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(index); }}
        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <X className="w-4 h-4" />
      </button>
      {index === 0 && (
        <span className="absolute bottom-2 left-2 px-2 py-1 bg-secondary text-white text-xs rounded-lg z-20">
          Main
        </span>
      )}
      <div className="absolute top-2 left-2 bg-gray-900/70 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-20">
        {index + 1}
      </div>
    </div>
  );
}

type Props = {
  userId: string;
  userEmail: string;
  userName: string;
  existingProperty?: any;
};

export default function PublicPropertyForm({ userId, userEmail, userName, existingProperty }: Props) {
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [images, setImages] = useState<string[]>(existingProperty?.images || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  // DnD sensors for photo reorder
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Cascading location state
  const [selectedState, setSelectedState] = useState(existingProperty?.state || '');
  const [selectedMunicipality, setSelectedMunicipality] = useState(existingProperty?.municipality || '');
  const [availableMunicipalities, setAvailableMunicipalities] = useState<{ name: string }[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    title: existingProperty?.title || '',
    description: existingProperty?.description || '',
    security: existingProperty?.security || '',
    price: existingProperty?.price || 0,
    currency: existingProperty?.currency || 'USD',
    listing_type: existingProperty?.listing_type || 'sale',
    property_category: existingProperty?.property_category || '',
    bedrooms: existingProperty?.bedrooms || 0,
    bathrooms: existingProperty?.bathrooms || 0,
    sqft: existingProperty?.sqft || 0,
    lot_size: existingProperty?.lot_size || 0,
    year_construction: existingProperty?.year_construction || '',
    neighborhood: existingProperty?.neighborhood || '',
    address: existingProperty?.address || '',
    country: 'Mexico',
    // Basic amenities
    has_pool: existingProperty?.has_pool || false,
    has_ac: existingProperty?.has_ac || false,
    pets_allowed: existingProperty?.pets_allowed || false,
    parking: existingProperty?.parking || '',
    // Location
    google_maps_link: existingProperty?.google_maps_link || '',
    // Video
    video_url: existingProperty?.video_url || '',
    // Contact
    contact_name: existingProperty?.contact_name || userName || '',
    contact_email: existingProperty?.contact_email || userEmail || '',
    contact_phone: existingProperty?.contact_phone || '',
    // Extended amenities
    has_spa: existingProperty?.has_spa || false,
    has_jacuzzi: existingProperty?.has_jacuzzi || false,
    has_gym: existingProperty?.has_gym || false,
    has_sauna: existingProperty?.has_sauna || false,
    has_24_7_security: existingProperty?.has_24_7_security || false,
    has_reception: existingProperty?.has_reception || false,
    has_event_room: existingProperty?.has_event_room || false,
    has_restaurant: existingProperty?.has_restaurant || false,
    has_pet_area: existingProperty?.has_pet_area || false,
    has_playground: existingProperty?.has_playground || false,
    has_soccer_field: existingProperty?.has_soccer_field || false,

    has_bbq_area: existingProperty?.has_bbq_area || false,
    has_laundry: existingProperty?.has_laundry || false,
    has_storage: existingProperty?.has_storage || false,
    has_elevator: existingProperty?.has_elevator || false,
    has_padel_court: existingProperty?.has_padel_court || false,
  });

  const [extractedCoords, setExtractedCoords] = useState<{ lat: number; lng: number } | null>(
    existingProperty?.latitude && existingProperty?.longitude
      ? { lat: existingProperty.latitude, lng: existingProperty.longitude }
      : null
  );

  // Initialize cascading location
  useEffect(() => {
    if (selectedState) {
      const municipalities = getMunicipalitiesByState(selectedState);
      setAvailableMunicipalities(municipalities);
    }
  }, [selectedState]);

  // Handle state change - reset municipality
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    setSelectedMunicipality('');
    setAvailableMunicipalities(getMunicipalitiesByState(newState));
  };

  // Categories that show bedrooms/bathrooms
  const categoriesWithBedrooms = ['house', 'apartment', 'condo', 'townhouse', 'villa', 'hacienda', 'ranch'];
  const showBedrooms = categoriesWithBedrooms.includes(formData.property_category);

  // Extract coordinates from Google Maps link
  const extractCoordinatesFromLink = (input: string): { lat: number; lng: number } | null => {
    if (!input) return null;
    try {
      // DMS Format
      const dmsPattern = /(\d+)°(\d+)'([\d.]+)"([NS])\s+(\d+)°(\d+)'([\d.]+)"([EW])/;
      const dmsMatch = input.match(dmsPattern);
      if (dmsMatch) {
        let lat = parseInt(dmsMatch[1]) + (parseInt(dmsMatch[2]) / 60) + (parseFloat(dmsMatch[3]) / 3600);
        let lng = parseInt(dmsMatch[5]) + (parseInt(dmsMatch[6]) / 60) + (parseFloat(dmsMatch[7]) / 3600);
        if (dmsMatch[4] === 'S') lat = -lat;
        if (dmsMatch[8] === 'W') lng = -lng;
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) return { lat, lng };
      }

      const patterns = [
        /@(-?\d+\.\d+),(-?\d+\.\d+)/,
        /place\/(-?\d+\.\d+),(-?\d+\.\d+)/,
        /\?q=(-?\d+\.\d+),(-?\d+\.\d+)/,
        /ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
        /(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
      ];
      for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);
          if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) return { lat, lng };
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleGoogleMapsLinkChange = (link: string) => {
    setFormData(prev => ({ ...prev, google_maps_link: link }));
    setExtractedCoords(extractCoordinatesFromLink(link));
  };

  // Handle image upload - uses BrokerLink bucket
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setUploadProgress({ current: 0, total: files.length });
    setError(null); // Clear error when uploading

    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        setUploadProgress({ current: i + 1, total: files.length });

        // Compress image
        const compressedFile = await imageCompression(files[i], {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        // Upload to Supabase Storage - using 'properties' bucket like BrokerLink
        const fileName = `public-listings/${userId}/${Date.now()}_${i}.jpg`;
        const { data, error } = await supabase.storage
          .from('public_properties')
          .upload(fileName, compressedFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/jpeg',
          });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('public_properties')
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          newImages.push(urlData.publicUrl);
        }
      } catch (err) {
        console.error('Error uploading image:', err);
      }
    }

    setImages(prev => [...prev, ...newImages]);
    setUploadingImage(false);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Build property data for save
  const buildPropertyData = (status: 'draft' | 'pending') => {
    return {
      user_id: userId,
      title: formData.title,
      description: formData.description,
      security: formData.security,
      price: formData.price,
      currency: formData.currency,
      listing_type: formData.listing_type,
      property_category: formData.property_category,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      sqft: formData.sqft,
      lot_size: formData.lot_size,
      year_construction: formData.year_construction ? parseInt(formData.year_construction) : null,
      address: formData.address,
      neighborhood: formData.neighborhood,
      municipality: selectedMunicipality,
      state: selectedState,
      country: formData.country,
      latitude: extractedCoords?.lat || null,
      longitude: extractedCoords?.lng || null,
      images,
      has_pool: formData.has_pool,
      has_ac: formData.has_ac,
      pets_allowed: formData.pets_allowed,
      parking: formData.parking,
      google_maps_link: formData.google_maps_link,
      video_url: formData.video_url,
      contact_name: formData.contact_name,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      has_spa: formData.has_spa,
      has_jacuzzi: formData.has_jacuzzi,
      has_gym: formData.has_gym,
      has_sauna: formData.has_sauna,
      has_24_7_security: formData.has_24_7_security,
      has_reception: formData.has_reception,
      has_event_room: formData.has_event_room,
      has_restaurant: formData.has_restaurant,
      has_pet_area: formData.has_pet_area,
      has_playground: formData.has_playground,
      has_soccer_field: formData.has_soccer_field,
      has_bbq_area: formData.has_bbq_area,
      has_laundry: formData.has_laundry,
      has_storage: formData.has_storage,
      has_elevator: formData.has_elevator,
      has_padel_court: formData.has_padel_court,
      status,
    };
  };

  // Save draft
  const saveDraft = async () => {
    setSaveStatus('saving');
    try {
      const propertyData = buildPropertyData('draft');

      if (existingProperty?.id) {
        const { error } = await supabase
          .from('public_properties')
          .update(propertyData)
          .eq('id', existingProperty.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('public_properties')
          .insert(propertyData);
        if (error) throw error;
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Error saving draft:', err);
      setSaveStatus('error');
    }
  };

  // Submit for review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate at least one photo
    if (images.length === 0) {
      setError('Please upload at least one photo of your property. Listings without photos cannot be accepted.');
      document.getElementById('photos-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const propertyData = buildPropertyData('pending');

      if (existingProperty?.id) {
        const { error } = await supabase
          .from('public_properties')
          .update(propertyData)
          .eq('id', existingProperty.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('public_properties')
          .insert(propertyData);
        if (error) throw error;
      }

      window.location.reload();
    } catch (err: any) {
      console.error('Error submitting property:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      console.error('Error message:', err?.message);
      console.error('Error code:', err?.code);
      setError(err?.message || 'Failed to submit property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <Home className="w-5 h-5 text-secondary" />
          {t('propertyForm.propertyDetails')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.title')} *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t('propertyForm.titlePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          {/* Property Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.propertyType')} *
            </label>
            <select
              required
              value={formData.property_category}
              onChange={(e) => setFormData(prev => ({ ...prev, property_category: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            >
              <option value="">{t('propertyForm.selectType')}</option>
              {PROPERTY_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.listingType')} *
            </label>
            <select
              required
              value={formData.listing_type}
              onChange={(e) => setFormData(prev => ({ ...prev, listing_type: e.target.value as 'sale' | 'rent' }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            >
              {LISTING_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.price')} *
            </label>
            <div className="flex gap-2">
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              >
                {CURRENCIES.map(cur => (
                  <option key={cur.value} value={cur.value}>{cur.label}</option>
                ))}
              </select>
              <input
                type="number"
                required
                min="0"
                value={formData.price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
          </div>

          {/* Bedrooms - only for certain categories */}
          {showBedrooms && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('propertyForm.bedrooms')}
                </label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n === 0 ? 'Studio' : n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('propertyForm.bathrooms')}
                </label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseFloat(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                >
                  {[0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.constructionSize')} (m²)
            </label>
            <input
              type="number"
              min="0"
              value={formData.sqft || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, sqft: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.lotSize')} (m²)
            </label>
            <input
              type="number"
              min="0"
              value={formData.lot_size || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, lot_size: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          {/* Year Built */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.yearBuilt')}
            </label>
            <input
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              value={formData.year_construction || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, year_construction: e.target.value }))}
              placeholder={t('propertyForm.yearBuiltPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.description')} *
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('propertyForm.descriptionPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          {/* Security Level - right under description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.securityLevel')}
            </label>
            <select
              value={formData.security}
              onChange={(e) => setFormData(prev => ({ ...prev, security: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            >
              {SECURITY_LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-secondary" />
          {t('propertyForm.location')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* State - cascading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.state')} *
            </label>
            <select
              required
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            >
              <option value="">{t('propertyForm.selectState')}</option>
              {getStateNames().map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Municipality - cascading with free text option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.municipality')} *
            </label>
            {availableMunicipalities.length > 0 ? (
              <>
                <select
                  value={selectedMunicipality}
                  onChange={(e) => setSelectedMunicipality(e.target.value)}
                  disabled={!selectedState}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {selectedState ? t('propertyForm.selectOrType') : t('propertyForm.selectStateFirst')}
                  </option>
                  {availableMunicipalities.map(muni => (
                    <option key={muni.name} value={muni.name}>{muni.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={selectedMunicipality}
                  onChange={(e) => setSelectedMunicipality(e.target.value)}
                  placeholder={t('propertyForm.orTypeMunicipality')}
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </>
            ) : (
              <input
                type="text"
                required
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(e.target.value)}
                disabled={!selectedState}
                placeholder={selectedState ? t('propertyForm.typeMunicipality') : t('propertyForm.selectStateFirst')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            )}
          </div>

          {/* Neighborhood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.neighborhood')}
            </label>
            <input
              type="text"
              value={formData.neighborhood}
              onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
              placeholder={t('propertyForm.neighborhoodPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.address')}
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder={t('propertyForm.addressPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          {/* Google Maps Link */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.googleMapsLink')}
            </label>
            <input
              type="text"
              value={formData.google_maps_link}
              onChange={(e) => handleGoogleMapsLinkChange(e.target.value)}
              placeholder={t('propertyForm.googleMapsPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
            {extractedCoords && (
              <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {t('propertyForm.coordinatesExtracted')}: {extractedCoords.lat.toFixed(6)}, {extractedCoords.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-primary mb-6">{t('propertyForm.amenities')}</h2>

        {/* Parking Dropdown */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Car className="w-4 h-4 text-gray-500" />
            {t('propertyForm.parking')}
          </label>
          <select
            value={formData.parking}
            onChange={(e) => setFormData(prev => ({ ...prev, parking: e.target.value }))}
            className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white"
          >
            <option value="">No parking / Sin estacionamiento</option>
            <option value="Off Street">Off Street / Fuera de la calle</option>
            <option value="On Street">On Street / En la calle</option>
            <option value="Garage">Garage / Cochera</option>
            <option value="Covered Parking">Covered Parking / Estacionamiento techado</option>
          </select>
        </div>

        {/* All Amenities as Checkboxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'has_pool', label: '🏊 Pool / Alberca' },
            { key: 'has_ac', label: '❄️ A/C / Aire acondicionado' },
            { key: 'pets_allowed', label: '🐾 Pets Allowed / Mascotas' },
            { key: 'has_spa', label: '🧖 Spa' },
            { key: 'has_jacuzzi', label: '🛁 Jacuzzi' },
            { key: 'has_gym', label: '💪 Gym' },
            { key: 'has_sauna', label: '🧖 Sauna' },
            { key: 'has_24_7_security', label: '🔒 24/7 Security / Seguridad' },
            { key: 'has_reception', label: '🛎️ Reception / Recepción' },
            { key: 'has_event_room', label: '🎉 Event Room / Salón' },
            { key: 'has_restaurant', label: '🍽️ Restaurant / Restaurante' },
            { key: 'has_pet_area', label: '🐕 Pet Area / Área de mascotas' },
            { key: 'has_playground', label: '🎪 Playground / Juegos infantiles' },
            { key: 'has_soccer_field', label: '⚽ Soccer Field / Cancha' },
            { key: 'has_bbq_area', label: '🔥 BBQ Area / Asador' },
            { key: 'has_laundry', label: '🧺 Laundry / Lavandería' },
            { key: 'has_storage', label: '📦 Storage / Bodega' },
            { key: 'has_elevator', label: '🛗 Elevator / Elevador' },
            { key: 'has_padel_court', label: '🎾 Padel Court / Cancha de pádel' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={(formData as any)[key]}
                onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.checked }))}
                className="w-4 h-4 text-secondary rounded"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div id="photos-section" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-secondary" />
          {t('propertyForm.photos')} <span className="text-red-500">*</span>
        </h2>

        {/* Error message for no photos */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((img, idx) => (
                <SortablePhoto
                  key={img}
                  id={img}
                  url={img}
                  index={idx}
                  onRemove={removeImage}
                />
              ))}

              <label className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                {uploadingImage ? (
                  <>
                    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-sm text-gray-500">
                      {uploadProgress.current} / {uploadProgress.total}
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">{t('propertyForm.uploadPhotos')}</span>
                  </>
                )}
              </label>
            </div>
          </SortableContext>
        </DndContext>

        <p className="text-sm text-gray-500">
          {t('propertyForm.uploadHint')}
        </p>
      </div>

      {/* Video URL - right after Photos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <Video className="w-5 h-5 text-secondary" />
          {t('propertyForm.videoUrl')}
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('propertyForm.videoLabel')}
          </label>
          <input
            type="url"
            value={formData.video_url}
            onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
            placeholder={t('propertyForm.videoPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
          <p className="text-sm text-gray-500 mt-2">
            {t('propertyForm.videoHint')}
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-primary mb-6">{t('propertyForm.contactInfo')}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {t('propertyForm.contactDescription')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.contactName')} *
            </label>
            <input
              type="text"
              required
              value={formData.contact_name}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.contactEmail')} *
            </label>
            <input
              type="email"
              required
              value={formData.contact_email}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('propertyForm.contactPhone')} *
            </label>
            <input
              type="tel"
              required
              value={formData.contact_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
              placeholder="+52 xxx xxx xxxx"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg -mx-4 px-4 py-4 md:-mx-8 md:px-8">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            {saveStatus === 'saving' && (
              <span className="text-gray-500 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                {t('propertyForm.saving')}
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-green-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {t('propertyForm.draftSaved')}
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {t('propertyForm.errorSaving')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={saveDraft}
              disabled={loading || saveStatus === 'saving'}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {t('propertyForm.saveDraft')}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t('propertyForm.submit')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

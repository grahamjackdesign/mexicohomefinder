'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Upload,
  X,
  CheckCircle,
  Loader2,
  Home,
  MapPin,
  Phone,
  Mail,
  User,
  ChevronDown,
  ImageIcon,
} from 'lucide-react';

const content = {
  en: {
    badge: 'Free · Unlimited · No account needed to start',
    heading: 'List Your Property on Mexico Home Finder',
    subheading: 'Reach thousands of US homeseekers actively looking for property in Mexico. It takes less than 5 minutes.',
    sections: {
      property: 'Property Details',
      location: 'Location',
      photos: 'Photos',
      contact: 'Your Contact Info',
    },
    fields: {
      title: 'Property Title',
      titlePlaceholder: 'e.g. Charming Colonial Home in Centro',
      listingType: 'Listing Type',
      propertyType: 'Property Type',
      price: 'Price',
      pricePlaceholder: '250000',
      currency: 'Currency',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      size: 'Size (m²)',
      description: 'Description',
      descriptionPlaceholder: 'Describe your property—key features, condition, nearby amenities...',
      neighborhood: 'Neighborhood / Colonia',
      neighborhoodPlaceholder: 'e.g. Centro Histórico, Guadalupe, Atascadero',
      municipality: 'Municipality',
      state: 'State',
      name: 'Your Name',
      namePlaceholder: 'Maria García',
      whatsapp: 'WhatsApp Number',
      whatsappPlaceholder: '+52 415 123 4567',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
    },
    listingTypes: { sale: 'For Sale', rent: 'For Rent' },
    propertyTypes: {
      house: 'House',
      condo: 'Condo / Apartment',
      land: 'Land',
      commercial: 'Commercial',
      villa: 'Villa',
    },
    photos: {
      upload: 'Click to upload photos',
      hint: 'JPG, PNG up to 10MB each · Max 10 photos',
      addMore: 'Add more',
      cover: 'Cover',
      maxError: 'Maximum 10 images allowed',
    },
    required: '*',
    submit: 'Submit My Listing',
    submitting: 'Submitting...',
    disclaimer: 'Your listing will be reviewed within 24 hours. Completely free — no card required.',
    errors: {
      required: 'Please fill in all required fields.',
      photos: 'Please upload at least one photo.',
      generic: 'Something went wrong. Please try again.',
    },
    success: {
      title: 'Listing Submitted!',
      body: "Thanks! We'll review your property and get it live within 24 hours. We'll contact you via WhatsApp once it's approved.",
      note: "Want to manage your listings and receive leads directly? We'll send you an invite to create a free account once your property is approved.",
    },
  },
  es: {
    badge: 'Gratis · Ilimitado · Sin cuenta para empezar',
    heading: 'Publica tu Propiedad en Mexico Home Finder',
    subheading: 'Llega a miles de compradores estadounidenses buscando propiedades en México. Tarda menos de 5 minutos.',
    sections: {
      property: 'Datos de la Propiedad',
      location: 'Ubicación',
      photos: 'Fotos',
      contact: 'Tus Datos de Contacto',
    },
    fields: {
      title: 'Título de la Propiedad',
      titlePlaceholder: 'Ej. Encantadora Casa Colonial en el Centro',
      listingType: 'Tipo de Anuncio',
      propertyType: 'Tipo de Propiedad',
      price: 'Precio',
      pricePlaceholder: '250000',
      currency: 'Moneda',
      bedrooms: 'Recámaras',
      bathrooms: 'Baños',
      size: 'Tamaño (m²)',
      description: 'Descripción',
      descriptionPlaceholder: 'Describe tu propiedad: características clave, estado, amenidades cercanas...',
      neighborhood: 'Colonia / Fraccionamiento',
      neighborhoodPlaceholder: 'Ej. Centro Histórico, Guadalupe, Atascadero',
      municipality: 'Municipio',
      state: 'Estado',
      name: 'Tu Nombre',
      namePlaceholder: 'María García',
      whatsapp: 'Número de WhatsApp',
      whatsappPlaceholder: '+52 415 123 4567',
      email: 'Correo Electrónico',
      emailPlaceholder: 'tu@correo.com',
    },
    listingTypes: { sale: 'En Venta', rent: 'En Renta' },
    propertyTypes: {
      house: 'Casa',
      condo: 'Departamento / Condominio',
      land: 'Terreno',
      commercial: 'Comercial',
      villa: 'Villa',
    },
    photos: {
      upload: 'Haz clic para subir fotos',
      hint: 'JPG, PNG hasta 10MB cada una · Máximo 10 fotos',
      addMore: 'Agregar más',
      cover: 'Portada',
      maxError: 'Máximo 10 imágenes permitidas',
    },
    required: '*',
    submit: 'Enviar mi Propiedad',
    submitting: 'Enviando...',
    disclaimer: 'Tu propiedad será revisada en 24 horas. Completamente gratis — sin tarjeta.',
    errors: {
      required: 'Por favor completa todos los campos obligatorios.',
      photos: 'Por favor sube al menos una foto.',
      generic: 'Algo salió mal. Por favor intenta de nuevo.',
    },
    success: {
      title: '¡Propiedad Enviada!',
      body: '¡Gracias! Revisaremos tu propiedad y la publicaremos en 24 horas. Te contactaremos por WhatsApp cuando sea aprobada.',
      note: '¿Quieres gestionar tus propiedades y recibir leads directamente? Te enviaremos una invitación para crear una cuenta gratuita una vez aprobada tu propiedad.',
    },
  },
};

type Lang = 'en' | 'es';

export default function ListPropertyPage() {
  const [lang, setLang] = useState<Lang>('en');
  const t = content[lang];

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
      setError(t.photos.maxError);
      return;
    }
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.title || !formData.price || !formData.contact_name || !formData.contact_phone || !formData.contact_email) {
      setError(t.errors.required);
      return;
    }
    if (images.length === 0) {
      setError(t.errors.photos);
      return;
    }
    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      images.forEach((img) => data.append('images', img));
      const response = await fetch('/api/quicklist', { method: 'POST', body: data });
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || t.errors.generic);
      }
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || t.errors.generic);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-gray-900 bg-white';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  // Language toggle
  const LangToggle = () => (
    <div className="fixed top-20 right-4 z-50 flex items-center bg-white border border-gray-200 rounded-full shadow-md overflow-hidden">
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
          lang === 'en' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('es')}
        className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
          lang === 'es' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        ES
      </button>
    </div>
  );

  if (isSubmitted) {
    return (
      <>
        <Header />
        <LangToggle />
        <main className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-3">{t.success.title}</h2>
            <p className="text-gray-600 mb-4">{t.success.body}</p>
            <p className="text-sm text-gray-500">{t.success.note}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <LangToggle />
      <main className="pt-16 bg-gray-50 min-h-screen">
        {/* Hero */}
        <div className="bg-primary text-white py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              {t.badge}
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{t.heading}</h1>
            <p className="text-white/80 text-lg">{t.subheading}</p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

            {/* Property Details */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-primary">{t.sections.property}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>{t.fields.title} {t.required}</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={t.fields.titlePlaceholder}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.fields.listingType} {t.required}</label>
                    <div className="relative">
                      <select
                        className={selectClass}
                        value={formData.listing_type}
                        onChange={(e) => setFormData({ ...formData, listing_type: e.target.value })}
                      >
                        <option value="sale">{t.listingTypes.sale}</option>
                        <option value="rent">{t.listingTypes.rent}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{t.fields.propertyType} {t.required}</label>
                    <div className="relative">
                      <select
                        className={selectClass}
                        value={formData.property_category}
                        onChange={(e) => setFormData({ ...formData, property_category: e.target.value })}
                      >
                        <option value="house">{t.propertyTypes.house}</option>
                        <option value="condo">{t.propertyTypes.condo}</option>
                        <option value="land">{t.propertyTypes.land}</option>
                        <option value="commercial">{t.propertyTypes.commercial}</option>
                        <option value="villa">{t.propertyTypes.villa}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.fields.price} {t.required}</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder={t.fields.pricePlaceholder}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.fields.currency}</label>
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
                    <label className={labelClass}>{t.fields.bedrooms}</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="3"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.fields.bathrooms}</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="2"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.fields.size}</label>
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
                  <label className={labelClass}>{t.fields.description}</label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={4}
                    placeholder={t.fields.descriptionPlaceholder}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-primary">{t.sections.location}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>{t.fields.neighborhood}</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={t.fields.neighborhoodPlaceholder}
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.fields.municipality}</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={formData.municipality}
                      onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.fields.state}</label>
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

            {/* Photos */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-primary">{t.sections.photos} {t.required}</h2>
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
                  <p className="font-medium text-gray-700 group-hover:text-secondary transition-colors">{t.photos.upload}</p>
                  <p className="text-sm text-gray-500 mt-1">{t.photos.hint}</p>
                </button>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded font-medium">
                          {t.photos.cover}
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
                      <span className="text-xs text-gray-500 mt-1">{t.photos.addMore}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-primary">{t.sections.contact}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>{t.fields.name} {t.required}</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={t.fields.namePlaceholder}
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.fields.whatsapp} {t.required}</label>
                    <input
                      type="tel"
                      className={inputClass}
                      placeholder={t.fields.whatsappPlaceholder}
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.fields.email} {t.required}</label>
                    <input
                      type="email"
                      required
                      className={inputClass}
                      placeholder={t.fields.emailPlaceholder}
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
                    {t.submitting}
                  </>
                ) : (
                  t.submit
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">{t.disclaimer}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// components/NewListingBadge.tsx
'use client';

interface NewListingBadgeProps {
  createdAt: string; // ISO date string
  className?: string;
}

export default function NewListingBadge({ createdAt, className = '' }: NewListingBadgeProps) {
  // Calculate days since listing was created
  const daysSinceCreated = Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Don't show badge if older than 14 days
  if (daysSinceCreated > 14) {
    return null;
  }

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-secondary to-secondary-dark text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-lg animate-pulse ${className}`}
    >
      <svg 
        className="w-3.5 h-3.5" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      New Listing
    </div>
  );
}

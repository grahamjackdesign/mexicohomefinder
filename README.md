# MexicoHomeFinder

A consumer-facing real estate portal that displays properties from the BrokerLink database and generates leads for agents.

## Overview

MexicoHomeFinder is designed to:
1. Display active property listings from BrokerLink's Supabase database
2. Allow users to search and filter properties by location, price, beds, etc.
3. Show properties on an interactive map (Google Maps)
4. Capture leads via inquiry forms on property pages
5. Notify you via email when a lead comes in
6. Store leads in a `portal_leads` table for tracking

## Business Model

- **Free for agents**: You import their listings from their existing websites
- **Pay-per-lead**: Agents pay a set price for each qualified lead

## Setup

### 1. Install dependencies

```bash
cd mexicohomefinder
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

You'll need:
- Supabase credentials (same as BrokerLink)
- Google Maps API key (same as BrokerLink)
- Resend API key for email notifications
- Your admin email for lead alerts

### 3. Create the portal_leads table

Run this SQL in your Supabase dashboard:

```sql
CREATE TABLE portal_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'purchased')),
  source text DEFAULT 'mexicohomefinder',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE portal_leads ENABLE ROW LEVEL SECURITY;

-- Policy for service role to insert
CREATE POLICY "Service role can insert leads" ON portal_leads
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Policy for authenticated users to view their leads
CREATE POLICY "Users can view leads for their properties" ON portal_leads
  FOR SELECT TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE client_id IN (
        SELECT client_id FROM agent_users WHERE user_id = auth.uid()
      )
    )
  );
```

### 4. Run development server

```bash
npm run dev
```

The site will be available at http://localhost:3001

## Deployment

Deploy to Vercel as a separate project:

1. Push the `mexicohomefinder` folder to a new GitHub repo (or subfolder)
2. Create a new Vercel project
3. Set the root directory to `mexicohomefinder` if it's a monorepo
4. Add environment variables in Vercel dashboard
5. Connect your domain (mexicohomefinder.com)

## Project Structure

```
mexicohomefinder/
├── app/
│   ├── api/
│   │   └── leads/           # Lead capture endpoint
│   ├── properties/
│   │   ├── page.tsx         # Search results (cards + map)
│   │   └── [id]/
│   │       └── page.tsx     # Property detail page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PropertyCard.tsx     # Property card for listings
│   ├── PropertyMap.tsx      # Google Maps integration
│   └── LeadForm.tsx         # Contact form for leads
├── lib/
│   └── supabase.ts          # Supabase client + types
└── public/
```

## Key Features

### Homepage
- Hero section with search
- Browse by location (clickable cards)
- Featured properties (from BrokerLink)
- How it works section
- Trust/credibility section
- Blog/guides section (static for now)

### Property Search
- Split view: property cards on left, map on right
- Filters: location, price, beds, baths, property type
- Responsive: list view on mobile, toggle between list/map
- Hover interaction between cards and map markers

### Property Detail
- Image gallery with fullscreen modal
- Key features (beds, baths, sqft, etc.)
- Full description
- Amenities list
- Google Maps embed
- Lead capture form (sidebar)
- Similar properties

### Lead Capture
- Form on property detail page
- Stores in `portal_leads` table
- Sends email notification to admin
- Status tracking (new → contacted → purchased)

## Next Steps

1. **SEO**: Add location-specific pages (e.g., `/san-miguel-de-allende/`)
2. **Content**: Create actual blog posts for guides
3. **Agent Dashboard**: Allow agents to view/manage their leads
4. **Paid Leads**: Build payment flow for lead purchases
5. **Analytics**: Track page views, lead conversion rates

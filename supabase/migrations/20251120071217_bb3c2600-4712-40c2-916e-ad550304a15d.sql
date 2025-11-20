-- Add secondary_blog column to domain_listings table
ALTER TABLE public.domain_listings
ADD COLUMN secondary_blog text NOT NULL DEFAULT '';
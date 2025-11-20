-- Add secondary_blog_title column to domain_listings table
ALTER TABLE public.domain_listings
ADD COLUMN secondary_blog_title text NOT NULL DEFAULT '';
-- Add backlink counter and screenshot URLs to domain_listings table
ALTER TABLE public.domain_listings 
ADD COLUMN backlink_counter integer NOT NULL DEFAULT 0,
ADD COLUMN screenshot_urls text[] NOT NULL DEFAULT '{}';

-- Create storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('screenshots', 'screenshots', true);

-- Allow anyone to view screenshots
CREATE POLICY "Screenshots are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'screenshots');

-- Allow anyone to upload screenshots (in production, you might want to restrict this)
CREATE POLICY "Anyone can upload screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'screenshots');

-- Allow anyone to delete screenshots
CREATE POLICY "Anyone can delete screenshots" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'screenshots');
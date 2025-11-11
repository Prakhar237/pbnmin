-- Remove existing restrictive RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.domain_listings;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON public.domain_listings;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON public.domain_listings;

-- Create new public access policies
CREATE POLICY "Allow public insert access" 
ON public.domain_listings 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON public.domain_listings 
FOR UPDATE 
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete access" 
ON public.domain_listings 
FOR DELETE 
TO public
USING (true);

-- Update storage bucket policies for screenshots
DROP POLICY IF EXISTS "Authenticated users can upload screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete screenshots" ON storage.objects;

-- Allow public uploads to screenshots bucket
CREATE POLICY "Public can upload screenshots" 
ON storage.objects 
FOR INSERT 
TO public
WITH CHECK (bucket_id = 'screenshots');

CREATE POLICY "Public can update screenshots" 
ON storage.objects 
FOR UPDATE 
TO public
USING (bucket_id = 'screenshots')
WITH CHECK (bucket_id = 'screenshots');

CREATE POLICY "Public can delete screenshots" 
ON storage.objects 
FOR DELETE 
TO public
USING (bucket_id = 'screenshots');
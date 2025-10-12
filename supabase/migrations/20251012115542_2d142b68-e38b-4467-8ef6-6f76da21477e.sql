-- Create domain_listings table
CREATE TABLE public.domain_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  overview TEXT NOT NULL,
  price TEXT NOT NULL,
  domain_age INTEGER NOT NULL,
  monthly_visits INTEGER NOT NULL,
  seo_rating TEXT NOT NULL,
  about TEXT NOT NULL,
  perfect_for TEXT[] NOT NULL DEFAULT '{}',
  market_opportunity TEXT[] NOT NULL DEFAULT '{}',
  mini_blog TEXT NOT NULL,
  special_feature_1 TEXT NOT NULL,
  special_feature_2 TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.domain_listings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for the frontend website)
CREATE POLICY "Allow public read access"
ON public.domain_listings
FOR SELECT
USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert"
ON public.domain_listings
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update"
ON public.domain_listings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete"
ON public.domain_listings
FOR DELETE
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_domain_listings_updated_at
BEFORE UPDATE ON public.domain_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
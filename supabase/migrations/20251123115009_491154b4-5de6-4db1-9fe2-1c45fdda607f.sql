-- Add powered_by_promotionocean column to domain_listings table
ALTER TABLE domain_listings
ADD COLUMN powered_by_promotionocean BOOLEAN NOT NULL DEFAULT false;
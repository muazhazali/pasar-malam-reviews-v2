-- Add tags array column to shops table
ALTER TABLE public.shops
ADD COLUMN tags text[] DEFAULT '{}';

-- Update existing shops with sample tags
UPDATE public.shops
SET tags = CASE
  WHEN name = 'Delicious Corner' THEN ARRAY['satay', 'roti john', 'kuih']
  WHEN name = 'Street Wok' THEN ARRAY['martabak', 'satay']
  ELSE '{}'::text[]
END
WHERE name IN ('Delicious Corner', 'Street Wok');

-- Create an index for tag searching
CREATE INDEX shops_tags_gin_idx ON public.shops USING gin (tags);

-- Function to search shops by tag
CREATE OR REPLACE FUNCTION search_shops_by_tag(search_tag text)
RETURNS SETOF shops
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM shops
  WHERE tags && ARRAY[search_tag]
  ORDER BY name;
$$; 
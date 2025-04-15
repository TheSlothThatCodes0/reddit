-- Populate the award table with predefined award types
INSERT INTO public.award ("awardType", name, price) 
VALUES 
  ('bronze', 'Bronze Award', 50),
  ('silver', 'Silver Award', 100),
  ('gold', 'Gold Award', 250),
  ('diamond', 'Diamond Award', 500)
ON CONFLICT DO NOTHING;

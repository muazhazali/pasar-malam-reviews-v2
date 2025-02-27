-- Seed data for shops
INSERT INTO public.shops (
  name,
  description,
  category,
  coordinates,
  address,
  operating_hours,
  phone,
  website,
  verified,
  photos,
  rating,
  review_count
) VALUES
(
  'Delicious Corner',
  'Traditional street food with a modern twist. We serve authentic Malaysian cuisine in a contemporary setting.',
  'Food',
  point(3.1390, 101.6869),
  '123 Jalan Example, Taman Sample, 50000 Kuala Lumpur',
  '10:00 AM - 10:00 PM',
  '+60123456789',
  'https://example.com/delicious-corner',
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
  ],
  4.5,
  3
),
(
  'Fashion Hub',
  'Your one-stop destination for trendy fashion. Find the latest styles and accessories.',
  'Fashion',
  point(3.1421, 101.6867),
  '456 Jalan Sample, Taman Test, 50000 Kuala Lumpur',
  '11:00 AM - 9:00 PM',
  '+60123456790',
  'https://example.com/fashion-hub',
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e'
  ],
  4.2,
  2
),
(
  'Tech Zone',
  'Latest gadgets and electronics at competitive prices. Expert staff to help with your tech needs.',
  'Electronics',
  point(3.1380, 101.6871),
  '789 Jalan Test, Taman Demo, 50000 Kuala Lumpur',
  '10:00 AM - 8:00 PM',
  '+60123456791',
  'https://example.com/tech-zone',
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'
  ],
  4.7,
  2
),
(
  'Street Wok',
  'Experience the best of Asian street food. Famous for our char kway teow and laksa.',
  'Food',
  point(3.1395, 101.6865),
  '321 Jalan Demo, Taman Test, 50000 Kuala Lumpur',
  '11:00 AM - 11:00 PM',
  '+60123456792',
  'https://example.com/street-wok',
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
  ],
  4.3,
  2
),
(
  'Gadget World',
  'Find all your favorite gadgets and accessories under one roof.',
  'Electronics',
  point(3.1375, 101.6873),
  '654 Jalan Sample, Taman Example, 50000 Kuala Lumpur',
  '10:00 AM - 9:00 PM',
  '+60123456793',
  'https://example.com/gadget-world',
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'
  ],
  4.0,
  1
);

-- Get some user IDs for reviews (replace these with actual user IDs from your auth.users table)
DO $$ 
DECLARE
  user1_id uuid;
  user2_id uuid;
  shop1_id uuid;
  shop2_id uuid;
  shop3_id uuid;
  shop4_id uuid;
  shop5_id uuid;
BEGIN
  -- Get the first user ID (replace with a specific user ID if needed)
  SELECT id INTO user1_id FROM auth.users LIMIT 1;
  -- Get the second user ID
  SELECT id INTO user2_id FROM auth.users OFFSET 1 LIMIT 1;
  
  -- Get shop IDs
  SELECT id INTO shop1_id FROM public.shops WHERE name = 'Delicious Corner';
  SELECT id INTO shop2_id FROM public.shops WHERE name = 'Fashion Hub';
  SELECT id INTO shop3_id FROM public.shops WHERE name = 'Tech Zone';
  SELECT id INTO shop4_id FROM public.shops WHERE name = 'Street Wok';
  SELECT id INTO shop5_id FROM public.shops WHERE name = 'Gadget World';

  -- Insert reviews if we have users
  IF user1_id IS NOT NULL THEN
    -- Reviews for Delicious Corner
    INSERT INTO public.reviews (shop_id, user_id, rating, content, status)
    VALUES
    (shop1_id, user1_id, 5, 'Amazing food and great service! The nasi lemak was perfect.', 'approved'),
    (shop1_id, user2_id, 4, 'Good food but can be a bit crowded during peak hours.', 'approved'),
    (shop1_id, user1_id, 4, 'Consistent quality and friendly staff.', 'approved');

    -- Reviews for Fashion Hub
    INSERT INTO public.reviews (shop_id, user_id, rating, content, status)
    VALUES
    (shop2_id, user2_id, 4, 'Great selection of clothes at reasonable prices.', 'approved'),
    (shop2_id, user1_id, 5, 'Found some amazing deals here!', 'approved');

    -- Reviews for Tech Zone
    INSERT INTO public.reviews (shop_id, user_id, rating, content, status)
    VALUES
    (shop3_id, user1_id, 5, 'Excellent customer service and competitive prices.', 'approved'),
    (shop3_id, user2_id, 4, 'Good range of products but limited parking.', 'approved');

    -- Reviews for Street Wok
    INSERT INTO public.reviews (shop_id, user_id, rating, content, status)
    VALUES
    (shop4_id, user2_id, 4, 'The char kway teow is amazing!', 'approved'),
    (shop4_id, user1_id, 5, 'Best laksa in town, will definitely come back.', 'approved');

    -- Reviews for Gadget World
    INSERT INTO public.reviews (shop_id, user_id, rating, content, status)
    VALUES
    (shop5_id, user1_id, 4, 'Decent selection but prices could be better.', 'approved');

    -- Add some votes
    INSERT INTO public.review_votes (review_id, user_id, vote_type)
    SELECT id, 
      CASE WHEN random() > 0.5 THEN user1_id ELSE user2_id END,
      CASE WHEN random() > 0.3 THEN 'up' ELSE 'down' END
    FROM public.reviews
    WHERE random() > 0.5;
  END IF;
END $$; 
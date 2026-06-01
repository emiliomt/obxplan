-- Run in Supabase SQL Editor to update existing events (keeps IDs and RSVPs).
-- Safe to run multiple times.

-- July 5 — Uncle Ike's (Corolla)
update events set
  title       = 'Arrival + Corolla group dinner',
  area        = 'Corolla',
  restaurant  = 'Uncle Ike''s Sandbar & Grill',
  description = 'First-night dinner close to the house in Corolla — easy after travel and great for large family groups. Uncle Ike''s is family friendly, handles big parties well, and keeps the first evening low-stress with minimal driving.',
  note        = 'Current working reservation target: 14 people. Dinners are kept close to Corolla unless the day''s activities already place the group farther south.',
  link        = 'https://uncleikesobx.com/',
  reserve     = true
where date = 'July 5' and event_type = 'dinner';

-- July 8 — Agave Roja (varied menu, Corolla)
update events set
  title       = 'Varied menu group dinner',
  area        = 'Corolla',
  restaurant  = 'Agave Roja',
  description = 'Mexican and Latin-inspired dinner in Corolla with seafood, steaks, chicken, and vegetarian-friendly choices — swapped from a seafood buffet so the week isn''t too seafood-centered. Corolla dinner after the kayak activity farther south.',
  note        = 'Current working reservation target: 19 people. Dinners are kept close to Corolla unless the day''s activities already place the group farther south.',
  link        = 'https://www.agaveroja.com/',
  reserve     = true
where date = 'July 8' and event_type = 'dinner';

-- July 11 — Outer Banks Boil Company (catered at house)
update events set
  title       = 'Final dinner + seafood boil at the house',
  area        = 'Corolla',
  restaurant  = 'Outer Banks Boil Company',
  description = 'Not a restaurant sit-down — a catered seafood boil at the rental (or take-home steam pots to cook at the house). Outer Banks Boil Company can set up, cook, and clean up for a special final-night group meal in Corolla with almost no driving.',
  note        = 'Working catering / headcount target: 14 people. Request availability via Book Your Boil on their site.',
  link        = 'https://www.corolla.outerbanksboilcompany.com/book-your-boil',
  reserve     = true
where date = 'July 11' and event_type = 'dinner';

-- Farther-south dinners — planning notes
update events set
  description = 'Sunset dinner over the sound — farther south while the group is already out that way.',
  note = 'Working count can be approximate. Dinners are kept close to Corolla unless the day''s activities already place the group farther south.'
where date = 'July 6' and event_type = 'dinner';

update events set
  description = 'Waterfront dinner still to be finalized — Manteo area while the group explores Roanoke / Bodie that day.',
  note = 'Working reservation range: 15–19 people. Dinners are kept close to Corolla unless the day''s activities already place the group farther south.'
where date = 'July 9' and event_type = 'dinner';

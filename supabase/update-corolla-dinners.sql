-- Run in Supabase SQL Editor to update existing events (keeps IDs and RSVPs).
-- Safe to run multiple times.

-- July 5 — La Dolce Vita (Corolla)
update events set
  title       = 'Arrival + first group dinner',
  area        = 'Corolla',
  restaurant  = 'La Dolce Vita',
  description = 'A relaxed first-night group dinner in Corolla with Italian food, pizza, pasta, and classic comfort dishes. This keeps the first evening close to the house and adds more cuisine variety to the trip.',
  note        = 'Current working reservation target: 14 people. Chosen as a closer first-night option in Corolla with broader appeal beyond seafood.',
  link        = 'https://www.ladolcevitacorolla.com/',
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

-- July 9 — 1587 Restaurant & Lounge (Manteo)
update events set
  title       = 'Roanoke / Manteo / Bodie dinner',
  area        = 'Manteo',
  restaurant  = '1587 Restaurant & Lounge',
  description = 'A Manteo dinner option that keeps the group close to the day''s Roanoke / Bodie plans while adding more variety beyond seafood-heavy meals. This gives the itinerary a more balanced mix of cuisines for the week.',
  note        = 'Working reservation range: 15–19 people. Updated for more variety and to keep dinner aligned with the Manteo area.',
  link        = 'https://www.tranquilhouseinn.com/food-drink-1587-lounge',
  reserve     = true
where date = 'July 9' and event_type = 'dinner';

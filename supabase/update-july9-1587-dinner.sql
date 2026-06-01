-- Update July 9 dinner to 1587 Restaurant & Lounge in Manteo (keeps event ID and RSVPs).
-- Run in Supabase SQL Editor. Safe to run multiple times.

update events set
  title       = 'Roanoke / Manteo / Bodie dinner',
  area        = 'Manteo',
  restaurant  = '1587 Restaurant & Lounge',
  event_type  = 'dinner',
  reserve     = true,
  description = 'A Manteo dinner option that keeps the group close to the day''s Roanoke / Bodie plans while adding more variety beyond seafood-heavy meals. This gives the itinerary a more balanced mix of cuisines for the week.',
  note        = 'Working reservation range: 15–19 people. Updated for more variety and to keep dinner aligned with the Manteo area.',
  link        = 'https://www.tranquilhouseinn.com/food-drink-1587-lounge'
where date = 'July 9' and event_type = 'dinner';

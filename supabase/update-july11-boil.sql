-- Update July 11 final dinner to Outer Banks Boil Company (keeps event IDs and RSVPs).
-- Run in Supabase SQL Editor.

update events set
  title       = 'Final dinner + seafood boil at the house',
  area        = 'Corolla',
  restaurant  = 'Outer Banks Boil Company',
  event_type  = 'dinner',
  reserve     = true,
  description = 'This is not a normal sit-down restaurant dinner — a catered seafood boil or boil-at-home service at the rental in Corolla, so the last night feels special without extra driving south.',
  note        = 'Working catering / headcount target: 14 people. Especially well suited for a large group and a relaxed final-night gathering at the house.',
  link        = 'https://www.corolla.outerbanksboilcompany.com/book-your-boil'
where date = 'July 11' and event_type = 'dinner';

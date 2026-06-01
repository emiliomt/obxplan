-- Update July 5 first-night dinner to La Dolce Vita in Corolla (keeps event ID and RSVPs).
-- Run in Supabase SQL Editor. Safe to run multiple times.

update events set
  title       = 'Arrival + first group dinner',
  area        = 'Corolla',
  restaurant  = 'La Dolce Vita',
  event_type  = 'dinner',
  reserve     = true,
  description = 'A relaxed first-night group dinner in Corolla with Italian food, pizza, pasta, and classic comfort dishes. This keeps the first evening close to the house and adds more cuisine variety to the trip.',
  note        = 'Current working reservation target: 14 people. Chosen as a closer first-night option in Corolla with broader appeal beyond seafood.',
  link        = 'https://www.ladolcevitacorolla.com/'
where date = 'July 5' and event_type = 'dinner';

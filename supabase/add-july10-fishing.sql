-- Add July 10 fishing activity (alongside beach horseback ride).
-- Run in Supabase SQL Editor. Safe to re-run (skips if title already exists).

insert into events (
  day, date, title, area, event_type, reserve, restaurant,
  description, note, link, sort_order,
  short_description, full_description, best_for, effort_level,
  indoor_outdoor, accessibility, reservation_info, family_fit,
  area_tag, kids_friendly, grandparent_friendly, activity_tags
)
select
  'Day 6',
  'July 10',
  'Fishing Day in OBX',
  'Corolla / Outer Banks',
  'activity',
  true,
  'Fishing charter or family fishing outing',
  'Family-friendly fishing day in the Outer Banks, either as a charter outing, a shorter inshore trip, or a more relaxed fishing option. This is a good alternative for anyone who wants an outdoor activity on July 10 that is less intense than horseback riding.',
  'Advance reservation recommended, especially in July.',
  'https://www.outerbanks.com/',
  75,
  'Family-friendly fishing in the OBX — charter, inshore trip, or relaxed outing; easier than horseback riding.',
  'Plan a family-friendly fishing day in the Outer Banks: a half-day charter, a shorter inshore trip from Corolla or nearby, or a more relaxed pier or sound-side option. Good for guests who want an outdoor July 10 activity without the longer drive and intensity of beach horseback riding on Hatteras.',
  'Families wanting a calmer outdoor option, beginners, guests skipping horseback riding, mixed ages',
  'relaxed',
  'outdoor',
  'Boat charters vary by operator; ask about motion sensitivity and seating. Pier fishing may be easier for limited mobility.',
  'Advance reservation recommended, especially in July. Morning charters often best for heat and wind.',
  'Strong alternative on July 10 for anyone who prefers fishing over horseback riding; confirm age limits with the charter.',
  'corolla',
  true,
  true,
  '["family-favorite","outdoor","reservation"]'
where not exists (
  select 1 from events
  where date = 'July 10'
    and event_type = 'activity'
    and title = 'Fishing Day in OBX'
);

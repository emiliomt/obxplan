-- Add rich activity fields to events. Safe to re-run (IF NOT EXISTS).

alter table events add column if not exists short_description text not null default '';
alter table events add column if not exists full_description text not null default '';
alter table events add column if not exists best_for text not null default '';
alter table events add column if not exists effort_level text not null default 'moderate';
alter table events add column if not exists indoor_outdoor text not null default 'outdoor';
alter table events add column if not exists accessibility text not null default '';
alter table events add column if not exists reservation_info text not null default '';
alter table events add column if not exists family_fit text not null default '';
alter table events add column if not exists area_tag text not null default '';
alter table events add column if not exists kids_friendly boolean not null default false;
alter table events add column if not exists grandparent_friendly boolean not null default false;
alter table events add column if not exists activity_tags text not null default '[]';

-- Wright Brothers (add if missing)
insert into events
  (day, date, title, area, event_type, reserve, restaurant, description, note, link, sort_order,
   short_description, full_description, best_for, effort_level, indoor_outdoor, accessibility,
   reservation_info, family_fit, area_tag, kids_friendly, grandparent_friendly, activity_tags)
select
  'Day 5', 'July 9', 'Wright Brothers National Memorial', 'Kill Devil Hills', 'activity', false,
  'National Park Service', 'Historic first-flight site.', 'Optional culture day while exploring south.',
  'https://www.nps.gov/wrbr/index.htm', 55,
  'Historic first-flight site with museum, monument, and wide coastal views.',
  'Visitor center with interactive exhibits, the 1903 flight line, and a hilltop monument with broad views over the dunes and sound.',
  'History lovers, first-time OBX visitors, school-age kids and up, grandparents who enjoy museums',
  'relaxed', 'both',
  'Paved paths to the monument; visitor center wheelchair accessible.',
  'Park entry fee; check seasonal hours.',
  'Strong multi-generational half-day — indoor exhibits plus optional monument walk.',
  'kill-devil-hills', true, true, '["family-favorite","accessible"]'
where not exists (select 1 from events where title ilike '%Wright Brothers%');

-- Jockey's Ridge dunes visit (optional)
insert into events
  (day, date, title, area, event_type, reserve, restaurant, description, note, link, sort_order,
   short_description, full_description, best_for, effort_level, indoor_outdoor, accessibility,
   reservation_info, family_fit, area_tag, kids_friendly, grandparent_friendly, activity_tags)
select
  'Extra', 'Flexible', 'Jockey''s Ridge dunes & sunset', 'Nags Head', 'activity', false,
  'Jockey''s Ridge State Park', 'Tallest living sand dunes on the Atlantic coast.', 'Pair with hang gliding or do on its own.',
  'https://www.ncparks.gov/jockeys-ridge-state-park', 85,
  'Tallest living sand dune system on the Atlantic coast — sunsets, kites, and dune walks.',
  'Jockey''s Ridge State Park offers sweeping dune ridges, kite flying, sunset views, and short hikes. Hang gliding launches nearby but visiting the park does not require a flight booking.',
  'Sunset seekers, active kids, photographers, mixed-age groups',
  'moderate', 'outdoor',
  'Boardwalk accessible; dune climbs are sandy and uneven.',
  'No reservation for park entry.',
  'Great for kids with energy; grandparents may enjoy the boardwalk.',
  'nags-head', true, true, '["family-favorite","outdoor"]'
where not exists (select 1 from events where title ilike '%Jockey%Ridge dunes%');

-- Refresh copy on existing seeded activities
update events set
  description = 'Family-friendly guided off-road tour (~2 hours) with wild horse viewing and local history in Corolla.',
  short_description = coalesce(nullif(short_description, ''), 'Guided off-road tour (~2 hours) — wild horses and Corolla history.'),
  full_description = coalesce(nullif(full_description, ''), 'A Corolla wild horse tour is a guided off-road experience along the beach and back roads, typically about two hours, with horse viewing and local history. Expect a bumpy ride — book ahead in summer.'),
  effort_level = 'relaxed', indoor_outdoor = 'outdoor', area_tag = 'corolla',
  kids_friendly = true, grandparent_friendly = true
where title ilike '%wild horse%';

update events set
  description = 'Signature OBX adventure from the dunes — tandem hang gliding; advance registration required.',
  short_description = coalesce(nullif(short_description, ''), 'Tandem hang gliding from Jockey''s Ridge — book in advance.'),
  full_description = coalesce(nullif(full_description, ''), 'A hang gliding lesson with Kitty Hawk Kites is one of the signature Outer Banks adventure experiences. Flights are weather-dependent and require advance registration; minimum age and weight limits apply.'),
  effort_level = 'high', indoor_outdoor = 'outdoor', area_tag = 'nags-head',
  activity_tags = '["adventure","reservation"]'
where title ilike '%hang glid%';

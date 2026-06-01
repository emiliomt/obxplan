-- OBX Family Trip RSVP — Supabase Schema
-- Paste into Supabase SQL Editor and run once.
-- Re-running is safe: seeds use ON CONFLICT DO NOTHING.

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table if not exists families (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  headcount   int  not null default 1 check (headcount >= 0 and headcount <= 50),
  created_at  timestamptz default now()
);

create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  day         text not null,
  date        text not null,
  title       text not null,
  area        text not null default '',
  event_type  text not null default 'dinner' check (event_type in ('dinner', 'activity')),
  reserve     boolean not null default false,
  restaurant  text not null default '',
  description text not null default '',
  note        text not null default '',
  link        text not null default '',
  sort_order  int  not null default 0,
  short_description text not null default '',
  full_description  text not null default '',
  best_for          text not null default '',
  effort_level      text not null default 'moderate',
  indoor_outdoor    text not null default 'outdoor',
  accessibility     text not null default '',
  reservation_info  text not null default '',
  family_fit        text not null default '',
  area_tag          text not null default '',
  kids_friendly         boolean not null default false,
  grandparent_friendly  boolean not null default false,
  activity_tags         text not null default '[]',
  created_at  timestamptz default now()
);

create table if not exists rsvps (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references families(id) on delete cascade,
  event_id    uuid not null references events(id)   on delete cascade,
  going       boolean not null default false,
  updated_at  timestamptz default now(),
  constraint rsvps_unique unique (family_id, event_id)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table families enable row level security;
alter table events   enable row level security;
alter table rsvps    enable row level security;

-- Families: public can read and write (families self-register)
create policy "families_select" on families for select using (true);
create policy "families_insert" on families for insert with check (true);
create policy "families_update" on families for update using (true);

-- Events: public read; any write allowed via anon key (admin page is client-gated)
create policy "events_select" on events for select using (true);
create policy "events_insert" on events for insert with check (true);
create policy "events_update" on events for update using (true);
create policy "events_delete" on events for delete using (true);

-- RSVPs: public read and write
create policy "rsvps_select" on rsvps for select using (true);
create policy "rsvps_insert" on rsvps for insert with check (true);
create policy "rsvps_update" on rsvps for update using (true);

-- ─── Realtime ─────────────────────────────────────────────────────────────────
-- Enable realtime in Supabase dashboard:
--   Database → Replication → toggle families, events, rsvps tables ON

-- ─── Seed: Events ─────────────────────────────────────────────────────────────

insert into events
  (day, date, title, area, event_type, reserve, restaurant, description, note, link, sort_order)
values
  ('Day 1',  'July 5',    'Arrival + first group dinner',    'Kill Devil Hills',
   'dinner',   true,  'Kill Devil Grill',
   'Large casual dinner replacing Henry''s, which is closed.',
   'Current working reservation target: 14 people.',
   'https://www.killdevilgrillobx.com', 10),

  ('Day 2',  'July 6',    'Waterfront group dinner',         'Nags Head / soundside',
   'dinner',   false, 'Miller''s Waterfront Restaurant',
   'Sunset dinner over the sound. Good to track headcount even if no strict reservation is needed.',
   'Working count can be approximate.',
   'https://millerswaterfront.com/', 20),

  ('Day 3',  'July 7',    'Wild horses tour',                'Corolla',
   'activity', true,  'Wild Horse Tour',
   '4WD or guided safari to see the wild horses in Corolla.',
   'MG family asked about this; can track RSVPs here too.',
   'https://wildhorsetour.com/', 30),

  ('Day 4',  'July 8',    'Kayak tour',                      'Alligator River',
   'activity', true,  'Outer Banks Kayak Tours',
   'Calm-water kayak option for adults and kids.',
   'Currently mentioned for Robertha and Pia.',
   'https://www.outerbankskayaktours.com/alligator-river-kayak-tours/', 40),

  ('Day 4',  'July 8',    'Seafood buffet dinner',           'Kill Devil Hills',
   'dinner',   true,  'Captain George''s Seafood Buffet',
   'Classic big-group seafood dinner night.',
   'Current working reservation target: 19 people.',
   'https://www.captaingeorges.com/', 50),

  ('Day 5',  'July 9',    'Roanoke / Manteo / Bodie dinner', 'Manteo area',
   'dinner',   true,  'Tale of the Whale or Basnight''s Lone Cedar Cafe',
   'Waterfront dinner still to be finalized.',
   'Working reservation range: 15–19 people.',
   'https://www.outerbanks.com/', 60),

  ('Day 6',  'July 10',   'Beach horseback ride',            'Frisco / Hatteras',
   'activity', true,  'Equine Adventures',
   'Bucket-list beach ride experience.',
   'MG family wants all 4 spots.',
   'https://www.equineadventures.com/beach-rides.html', 70),

  ('Day 7',  'July 11',   'Final dinner + toast',            'Nags Head',
   'dinner',   true,  'Blue Moon Beach Grill',
   'Closing family dinner with a farewell toast.',
   'Current working reservation target: 14 people.',
   'https://www.bluemoonbeachgrill.com/', 80),

  ('Extra',  'Flexible',  'Hang gliding lesson',             'Jockey''s Ridge',
   'activity', true,  'Kitty Hawk Kites',
   'Optional lesson for the more adventurous side of the group.',
   'Salvador and Eva want to reserve this.',
   'https://www.kittyhawk.com/adventures/hang-gliding/', 90)
on conflict do nothing;

-- ─── Seed: Families ───────────────────────────────────────────────────────────

insert into families (name, headcount) values
  ('Emilio family',   4),
  ('Abuelo + Lucre',  2),
  ('Tío Roge family', 5),
  ('Tía Lucre family',4),
  ('Tío Güero / MG',  4)
on conflict (name) do nothing;

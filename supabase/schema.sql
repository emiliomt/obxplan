-- OBX Family Trip RSVP — attendee-based schema
-- Fresh install: paste into Supabase SQL Editor and run once.

create table if not exists attendees (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  family_group text not null default '',
  type         text not null default 'adult' check (type in ('adult', 'child')),
  created_at   timestamptz default now()
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
  created_at  timestamptz default now()
);

create table if not exists attendee_rsvps (
  id          uuid primary key default gen_random_uuid(),
  attendee_id uuid not null references attendees(id) on delete cascade,
  event_id    uuid not null references events(id)   on delete cascade,
  going       boolean not null default false,
  updated_at  timestamptz default now(),
  constraint attendee_rsvps_unique unique (attendee_id, event_id)
);

alter table attendees      enable row level security;
alter table events         enable row level security;
alter table attendee_rsvps enable row level security;

create policy "attendees_select" on attendees for select using (true);
create policy "attendees_insert" on attendees for insert with check (true);
create policy "attendees_update" on attendees for update using (true);
create policy "attendees_delete" on attendees for delete using (true);

create policy "events_select" on events for select using (true);
create policy "events_insert" on events for insert with check (true);
create policy "events_update" on events for update using (true);
create policy "events_delete" on events for delete using (true);

create policy "attendee_rsvps_select" on attendee_rsvps for select using (true);
create policy "attendee_rsvps_insert" on attendee_rsvps for insert with check (true);
create policy "attendee_rsvps_update" on attendee_rsvps for update using (true);

-- Enable realtime: attendees, events, attendee_rsvps

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
   'Sunset dinner over the sound.',
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
  ('Day 7',  'July 11',   'Final dinner + seafood boil at the house', 'Corolla',
   'dinner',   true,  'Outer Banks Boil Company',
   'Not a normal sit-down restaurant dinner — catered seafood boil at the rental in Corolla.',
   'Working catering / headcount target: 14 people.',
   'https://www.corolla.outerbanksboilcompany.com/book-your-boil', 80),
  ('Extra',  'Flexible',  'Hang gliding lesson',             'Jockey''s Ridge',
   'activity', true,  'Kitty Hawk Kites',
   'Optional lesson for the more adventurous side of the group.',
   'Salvador and Eva want to reserve this.',
   'https://www.kittyhawk.com/adventures/hang-gliding/', 90)
on conflict do nothing;

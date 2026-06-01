-- Migrate existing family-based OBX RSVP data to per-attendee RSVPs.
-- Run once in Supabase SQL Editor, then rename attendees as needed in the app.

create table if not exists attendees (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  family_group text not null default '',
  type         text not null default 'adult' check (type in ('adult', 'child')),
  max_party_size int not null default 1 check (max_party_size >= 1 and max_party_size <= 20),
  created_at   timestamptz default now()
);

alter table attendees enable row level security;
drop policy if exists "attendees_select" on attendees;
drop policy if exists "attendees_insert" on attendees;
drop policy if exists "attendees_update" on attendees;
drop policy if exists "attendees_delete" on attendees;
create policy "attendees_select" on attendees for select using (true);
create policy "attendees_insert" on attendees for insert with check (true);
create policy "attendees_update" on attendees for update using (true);
create policy "attendees_delete" on attendees for delete using (true);

insert into attendees (full_name, family_group, type)
select
  f.name || ' — person ' || g.n,
  f.name,
  case when g.n <= greatest(1, (f.headcount + 1) / 2) then 'adult' else 'child' end
from families f
cross join lateral generate_series(1, greatest(1, f.headcount)) as g(n)
where not exists (select 1 from attendees a where a.family_group = f.name limit 1);

create table if not exists attendee_rsvps (
  id          uuid primary key default gen_random_uuid(),
  attendee_id uuid not null references attendees(id) on delete cascade,
  event_id    uuid not null references events(id)   on delete cascade,
  going       boolean not null default false,
  attending   boolean,
  party_size  int not null default 0,
  extra_guest_names jsonb not null default '[]'::jsonb,
  updated_at  timestamptz default now(),
  constraint attendee_rsvps_unique unique (attendee_id, event_id)
);

alter table attendee_rsvps enable row level security;
drop policy if exists "attendee_rsvps_select" on attendee_rsvps;
drop policy if exists "attendee_rsvps_insert" on attendee_rsvps;
drop policy if exists "attendee_rsvps_update" on attendee_rsvps;
create policy "attendee_rsvps_select" on attendee_rsvps for select using (true);
create policy "attendee_rsvps_insert" on attendee_rsvps for insert with check (true);
create policy "attendee_rsvps_update" on attendee_rsvps for update using (true);

insert into attendee_rsvps (attendee_id, event_id, going, updated_at)
select a.id, r.event_id, r.going, coalesce(r.updated_at, now())
from rsvps r
join attendees a on a.family_group = (select name from families f where f.id = r.family_id)
on conflict (attendee_id, event_id) do update set
  going = excluded.going,
  updated_at = excluded.updated_at;

-- After verifying: drop table rsvps; drop table families;

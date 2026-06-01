-- Party-size RSVPs: run in Supabase SQL Editor after migrate-to-attendees.sql
-- Edit per-person limits in supabase/seed-attendees-party.sql (see header comment there).

alter table attendees add column if not exists max_party_size int not null default 1
  check (max_party_size >= 1 and max_party_size <= 20);

alter table attendee_rsvps add column if not exists attending boolean;
alter table attendee_rsvps add column if not exists party_size int not null default 0
  check (party_size >= 0 and party_size <= 20);
alter table attendee_rsvps add column if not exists extra_guest_names jsonb not null default '[]'::jsonb;

-- Backfill from legacy going flag
update attendee_rsvps
set
  attending = coalesce(attending, going, false),
  party_size = case
    when coalesce(attending, going, false) then greatest(1, party_size)
    else 0
  end
where attending is null or (coalesce(attending, going) and party_size = 0);

update attendee_rsvps set party_size = 0, extra_guest_names = '[]'::jsonb
where coalesce(attending, going, false) = false;

-- Defaults by role (customize in seed-attendees-party.sql for named people)
update attendees set max_party_size = 4 where type = 'adult' and max_party_size = 1;
update attendees set max_party_size = 2 where type = 'child' and max_party_size = 1;

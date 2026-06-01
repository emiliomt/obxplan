-- Seed OBX trip attendees (run after migrate-to-attendees.sql + party-size-rsvp.sql)
-- Edit names and max_party_size below, then run in Supabase SQL Editor.

insert into attendees (full_name, family_group, type, max_party_size) values
  ('Montemayor Tatum — adult 1', 'Montemayor Tatum',  'adult', 4),
  ('Montemayor Tatum — adult 2', 'Montemayor Tatum',  'adult', 4),
  ('Montemayor Tatum — child 1', 'Montemayor Tatum',  'child', 2),
  ('Montemayor Tatum — child 2', 'Montemayor Tatum',  'child', 2),
  ('Abuelo',                     'Abuelo + Lucre',    'adult', 2),
  ('Lucre',                      'Abuelo + Lucre',    'adult', 2),
  ('Montemayor Taylor — adult 1','Montemayor Taylor', 'adult', 5),
  ('Montemayor Taylor — adult 2','Montemayor Taylor', 'adult', 5),
  ('Montemayor Taylor — child 1','Montemayor Taylor', 'child', 2),
  ('Montemayor Taylor — child 2','Montemayor Taylor', 'child', 2),
  ('Montemayor Taylor — child 3','Montemayor Taylor', 'child', 2),
  ('Lozano Montemayor — adult 1','Lozano Montemayor', 'adult', 4),
  ('Lozano Montemayor — adult 2','Lozano Montemayor', 'adult', 4),
  ('Lozano Montemayor — child 1','Lozano Montemayor', 'child', 2),
  ('Lozano Montemayor — child 2','Lozano Montemayor', 'child', 2),
  ('Montemayor Galvan — adult 1','Montemayor Galvan', 'adult', 4),
  ('Montemayor Galvan — adult 2','Montemayor Galvan', 'adult', 4),
  ('Montemayor Galvan — child 1','Montemayor Galvan', 'child', 2),
  ('Montemayor Galvan — child 2','Montemayor Galvan', 'child', 2)
on conflict do nothing;

-- Rename rows in Table Editor to real first names after running this.

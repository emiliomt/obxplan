-- EDIT max_party_size in the VALUES list below (see js/attendee-config.js for UI defaults).

insert into attendees (full_name, family_group, type, max_party_size)
select fn, fg, ty, mp from (values
  ('Emilio Montemayor',   'Montemayor Tatum',  'adult', 4),
  ('Partner Montemayor',  'Montemayor Tatum',  'adult', 4),
  ('Abuelo',              'Abuelo + Lucre',    'adult', 2),
  ('Lucre',               'Abuelo + Lucre',    'adult', 2),
  ('Tío Roge',            'Montemayor Taylor', 'adult', 5),
  ('Tía Lucre',           'Lozano Montemayor', 'adult', 4),
  ('MG parent',           'Montemayor Galvan', 'adult', 4),
  ('Child example',       'Montemayor Galvan', 'child', 1)
) as v(fn, fg, ty, mp)
where not exists (select 1 from attendees a where a.full_name = v.fn);

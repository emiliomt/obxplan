// Activity metadata: DB fields + presets for richer cards and filters.

const ACTIVITY_PRESETS = [
  {
    match: /wright brothers/i,
    short_description: 'Historic first-flight site with museum, monument, and wide coastal views.',
    full_description: 'Wright Brothers National Memorial in Kill Devil Hills includes a visitor center with interactive exhibits, the exact site of the first powered flights in 1903, and a hilltop monument with broad views over the dunes and sound. Easy paths and indoor exhibits make it a strong half-day for mixed ages.',
    best_for: 'History lovers, first-time OBX visitors, school-age kids and up, grandparents who enjoy museums',
    effort_level: 'relaxed',
    indoor_outdoor: 'both',
    accessibility: 'Paved paths to the monument; visitor center is wheelchair accessible. Some dune walks are optional and sandy.',
    reservation_info: 'Park entry fee; no timed ticket required for most visits. Check NPS hours seasonally.',
    family_fit: 'Excellent for multi-generational groups — indoor breaks, short walks, and big “wow” moments at the monument.',
    area_tag: 'kill-devil-hills',
    kids_friendly: true,
    grandparent_friendly: true,
    tags: ['family-favorite', 'accessible']
  },
  {
    match: /wild horse/i,
    short_description: 'Guided off-road tour to see Corolla’s wild horses — about two hours, family-friendly.',
    full_description: 'A Corolla wild horse tour is a guided off-road experience along the beach and back roads north of Corolla, with a strong chance of seeing the Banker horses in their natural habitat. Tours typically run about two hours and include local history, ecology, and photo stops. Expect bouncing ride segments — not ideal for anyone very motion-sensitive.',
    best_for: 'Families with kids, nature lovers, visitors who want a signature Corolla experience without a long drive south',
    effort_level: 'relaxed',
    indoor_outdoor: 'outdoor',
    accessibility: '4WD vehicles only; not wheelchair accessible. Best for guests who can sit through a bumpy ride.',
    reservation_info: 'Reservation required — book ahead in summer. Arrive early for parking in Corolla.',
    family_fit: 'Family-friendly and popular with kids; keep younger children buckled and bring sunscreen.',
    area_tag: 'corolla',
    kids_friendly: true,
    grandparent_friendly: true,
    tags: ['family-favorite', 'reservation']
  },
  {
    match: /jockey.*ridge|jockey's ridge/i,
    short_description: 'Tallest living sand dune system on the Atlantic coast — sunsets, kites, and dune walks.',
    full_description: 'Jockey’s Ridge State Park in Nags Head is home to the tallest living sand dune system on the Atlantic coast. Families come for sunset, kite flying, photos on the ridge, and short dune walks. Hang gliding operations launch from the dunes nearby, but you can also enjoy the park on foot without booking a flight.',
    best_for: 'Sunset seekers, active kids, photographers, anyone who wants an iconic OBX landscape',
    effort_level: 'moderate',
    indoor_outdoor: 'outdoor',
    accessibility: 'Boardwalk and visitor center are accessible; climbing the dunes requires sandy, uneven footing.',
    reservation_info: 'No reservation for park entry; parking can fill at sunset in peak season.',
    family_fit: 'Great for kids with energy; grandparents may prefer the boardwalk and visitor center over a full dune climb.',
    area_tag: 'nags-head',
    kids_friendly: true,
    grandparent_friendly: true,
    tags: ['family-favorite', 'outdoor', 'adventure']
  },
  {
    match: /hang glid/i,
    short_description: 'Signature OBX adventure — tandem hang gliding from the dunes; register in advance.',
    full_description: 'A hang gliding lesson with Kitty Hawk Kites is one of the signature Outer Banks adventure experiences: tandem flights from the dunes with certified instructors. Flights are weather-dependent and require advance registration. Minimum age and weight limits apply — confirm when booking.',
    best_for: 'Teens and adults seeking adventure, milestone birthdays, thrill-seekers in the group',
    effort_level: 'high',
    indoor_outdoor: 'outdoor',
    accessibility: 'Participants must meet operator requirements; not suitable for all mobility needs.',
    reservation_info: 'Advance registration required — book early for holiday weeks. Weather cancellations are common.',
    family_fit: 'Best for older kids/teens and adults; spectators welcome from the dunes.',
    area_tag: 'nags-head',
    kids_friendly: false,
    grandparent_friendly: false,
    tags: ['adventure', 'reservation']
  },
  {
    match: /kayak/i,
    short_description: 'Calm-water paddle through Alligator River — wildlife, quiet channels, moderate effort.',
    full_description: 'Outer Banks kayak tours on Alligator River offer calm-water paddling through sheltered channels — good for spotting birds, turtles, and peaceful marsh scenery. Trips are guided with instruction; some outfitters welcome kids with adults. Plan for sun, water shoes, and a few hours on the water.',
    best_for: 'Nature lovers, active families with older kids, guests who want a break from the beach',
    effort_level: 'moderate',
    indoor_outdoor: 'outdoor',
    accessibility: 'Requires getting in/out of a kayak; check with outfitter for adaptive options.',
    reservation_info: 'Reservation required; morning slots often calmer and cooler.',
    family_fit: 'Good for school-age kids and up who can paddle or ride tandem; less ideal for toddlers.',
    area_tag: 'alligator-river',
    kids_friendly: true,
    grandparent_friendly: false,
    tags: ['outdoor', 'adventure', 'reservation']
  },
  {
    match: /horseback|equine/i,
    short_description: 'Bucket-list beach ride on Hatteras Island — memorable but a longer drive from Corolla.',
    full_description: 'Beach horseback riding with Equine Adventures on Hatteras Island is a bucket-list experience: riding along the surf with guides. This is a farther drive from Corolla and requires reservations. Riders have age and weight limits; wear long pants and closed-toe shoes.',
    best_for: 'Horse lovers, families with tweens/teens, guests planning a Hatteras day trip',
    effort_level: 'moderate',
    indoor_outdoor: 'outdoor',
    accessibility: 'Mounting/dismounting required; call ahead for accommodation questions.',
    reservation_info: 'Reservation required — popular slots sell out. Allow drive time from Corolla.',
    family_fit: 'Memorable for the right age group; verify minimum age before promising kids.',
    area_tag: 'hatteras',
    kids_friendly: true,
    grandparent_friendly: false,
    tags: ['adventure', 'reservation', 'family-favorite']
  },
  {
    match: /fishing day|fishing charter|family fishing/i,
    short_description: 'Family-friendly fishing in the OBX — charter, inshore trip, or relaxed outing; easier than horseback riding.',
    full_description: 'Plan a family-friendly fishing day in the Outer Banks: a half-day charter, a shorter inshore trip from Corolla or nearby, or a more relaxed pier or sound-side option. Good for guests who want an outdoor July 10 activity without the longer drive and intensity of beach horseback riding on Hatteras.',
    best_for: 'Families wanting a calmer outdoor option, beginners, guests skipping horseback riding, mixed ages',
    effort_level: 'relaxed',
    indoor_outdoor: 'outdoor',
    accessibility: 'Boat charters vary by operator; ask about motion sensitivity and seating. Pier fishing may be easier for limited mobility.',
    reservation_info: 'Advance reservation recommended, especially in July. Morning charters often best for heat and wind.',
    family_fit: 'Strong alternative on July 10 for anyone who prefers fishing over horseback riding; confirm age limits with the charter.',
    area_tag: 'corolla',
    kids_friendly: true,
    grandparent_friendly: true,
    tags: ['family-favorite', 'outdoor', 'reservation']
  }
];

function presetForEvent(ev) {
  const hay = `${ev.title || ''} ${ev.restaurant || ''}`.toLowerCase();
  return ACTIVITY_PRESETS.find(p => p.match.test(hay)) || null;
}

function enrichEvent(ev) {
  if (ev.event_type !== 'activity') return ev;
  const preset = presetForEvent(ev);
  const pick = (key, fallback = '') => {
    const dbVal = ev[key];
    if (dbVal != null && String(dbVal).trim() !== '') return String(dbVal).trim();
    return preset ? (preset[key] ?? fallback) : fallback;
  };
  return {
    ...ev,
    short_description: pick('short_description', ev.description || ''),
    full_description: pick('full_description', ev.description || ''),
    best_for: pick('best_for', ''),
    effort_level: pick('effort_level', 'moderate'),
    indoor_outdoor: pick('indoor_outdoor', 'outdoor'),
    accessibility: pick('accessibility', ''),
    reservation_info: pick('reservation_info', ev.reserve ? 'Reservation recommended.' : ''),
    family_fit: pick('family_fit', ''),
    area_tag: pick('area_tag', inferAreaTag(ev.area)),
    kids_friendly: ev.kids_friendly ?? preset?.kids_friendly ?? false,
    grandparent_friendly: ev.grandparent_friendly ?? preset?.grandparent_friendly ?? false,
    activity_tags: parseTags(ev.activity_tags, preset?.tags || [])
  };
}

function inferAreaTag(area) {
  const a = (area || '').toLowerCase();
  if (a.includes('corolla')) return 'corolla';
  if (a.includes('kill devil')) return 'kill-devil-hills';
  if (a.includes('nags head') || a.includes("jockey")) return 'nags-head';
  if (a.includes('manteo')) return 'manteo';
  if (a.includes('hatteras') || a.includes('frisco')) return 'hatteras';
  if (a.includes('alligator')) return 'alligator-river';
  return 'other';
}

function parseTags(dbVal, presetTags) {
  if (Array.isArray(dbVal)) return dbVal;
  if (typeof dbVal === 'string' && dbVal.trim()) {
    try {
      const parsed = JSON.parse(dbVal);
      if (Array.isArray(parsed)) return parsed;
    } catch { /* ignore */ }
    return dbVal.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [...presetTags];
}

function activityBadges(ev) {
  const badges = [];
  if (ev.reserve || (ev.activity_tags || []).includes('reservation')) {
    badges.push({ key: 'reservation', label: 'Reservation', icon: '📅' });
  }
  if ((ev.indoor_outdoor || '') === 'outdoor' || (ev.activity_tags || []).includes('outdoor')) {
    badges.push({ key: 'outdoor', label: 'Outdoor', icon: '☀️' });
  }
  if ((ev.indoor_outdoor || '') === 'indoor' || (ev.indoor_outdoor || '') === 'both') {
    badges.push({ key: 'indoor', label: 'Indoor option', icon: '🏛️' });
  }
  if (ev.kids_friendly || (ev.activity_tags || []).includes('family-favorite')) {
    badges.push({ key: 'kids', label: 'Kids friendly', icon: '👨‍👩‍👧' });
  }
  if (ev.grandparent_friendly) {
    badges.push({ key: 'gp', label: 'Grandparent friendly', icon: '♿' });
  }
  if ((ev.effort_level || '') === 'high' || (ev.activity_tags || []).includes('adventure')) {
    badges.push({ key: 'adventure', label: 'Adventure', icon: '🪂' });
  }
  if ((ev.activity_tags || []).includes('accessible') || /wheelchair|accessible/i.test(ev.accessibility || '')) {
    badges.push({ key: 'accessible', label: 'Accessible', icon: '♿' });
  }
  const seen = new Set();
  return badges.filter(b => {
    if (seen.has(b.key)) return false;
    seen.add(b.key);
    return true;
  });
}

function matchesViewMode(ev, mode) {
  if (mode === 'dinners') return ev.event_type === 'dinner';
  if (mode === 'activities') return ev.event_type === 'activity';
  if (mode === 'kids') return ev.event_type === 'activity' && ev.kids_friendly;
  if (mode === 'easy') {
    return ev.event_type === 'activity' && (ev.effort_level === 'relaxed' || ev.grandparent_friendly);
  }
  return true;
}

function matchesFacet(ev, facet) {
  if (!facet || ev.event_type !== 'activity') return true;
  switch (facet) {
    case 'kids-friendly': return ev.kids_friendly;
    case 'grandparent-friendly': return ev.grandparent_friendly;
    case 'indoor': return ev.indoor_outdoor === 'indoor' || ev.indoor_outdoor === 'both';
    case 'outdoor': return ev.indoor_outdoor === 'outdoor' || ev.indoor_outdoor === 'both';
    case 'reservation': return ev.reserve;
    case 'near-corolla': return ev.area_tag === 'corolla';
    case 'near-kdh-nags': return ev.area_tag === 'kill-devil-hills' || ev.area_tag === 'nags-head';
    case 'high-activity': return ev.effort_level === 'high';
    case 'relaxed': return ev.effort_level === 'relaxed';
    default: return true;
  }
}

function effortLabel(level) {
  if (level === 'relaxed') return 'Relaxed';
  if (level === 'high') return 'High activity';
  return 'Moderate';
}

window.ActivityEnrichment = {
  enrichEvent,
  activityBadges,
  matchesViewMode,
  matchesFacet,
  effortLabel,
  ACTIVITY_PRESETS
};

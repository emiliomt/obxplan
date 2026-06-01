// RSVP page: party-size RSVPs per attendee (attending + partySize + optional guest names)

let currentAttendee = null;
let attendees = [];
let events  = [];
let rsvps   = [];
let viewMode = 'all';
const activeFacets = new Set();
const expandedIds = new Set();
let channel = null;

const AE = () => window.ActivityEnrichment;
const tr = (key, vars) => (window.I18n ? I18n.t(key, vars) : key);
const cfg = () => window.ATTENDEE_CONFIG || { defaultMaxPartyAdult: 4, defaultMaxPartyChild: 1, absoluteMaxParty: 20 };

function enrichAndLocalize(list) {
  const mapped = list.map(ev =>
    ev.event_type === 'activity' && AE() ? AE().enrichEvent({ ...ev }) : { ...ev }
  );
  return window.I18n ? I18n.localizeEvents(mapped) : mapped;
}

function maxPartyFor(attendee) {
  const n = parseInt(attendee?.max_party_size, 10);
  const cap = cfg().absoluteMaxParty || 20;
  return Math.min(cap, Math.max(1, Number.isNaN(n) ? 1 : n));
}

function getRsvp(attendeeId, eventId) {
  const r = rsvps.find(x => x.attendee_id === attendeeId && x.event_id === eventId);
  if (r) return r;
  return {
    attendee_id: attendeeId,
    event_id: eventId,
    attending: false,
    party_size: 0,
    extra_guest_names: []
  };
}

function eventPartyTotal(eventId) {
  return rsvps
    .filter(r => r.event_id === eventId && r.attending && r.party_size > 0)
    .reduce((sum, r) => sum + r.party_size, 0);
}

function goingPartySummaries(eventId) {
  return rsvps
    .filter(r => r.event_id === eventId && r.attending && r.party_size > 0 && r.attendees)
    .map(r => {
      const base = r.attendees.full_name;
      if (r.party_size <= 1) return base;
      const extras = (r.extra_guest_names || []).filter(Boolean);
      const guestPart = extras.length ? ` — ${extras.join(', ')}` : ` (+${r.party_size - 1})`;
      return `${base} (${r.party_size})${guestPart}`;
    });
}

async function init() {
  initThemeToggle();
  initPageI18n(onLanguageChanged);

  try {
    [attendees, events, rsvps] = await Promise.all([
      db.getAttendees(),
      db.getEvents(),
      db.getAllAttendeeRsvps()
    ]);
    events = enrichAndLocalize(events);
  } catch (err) {
    showDaysError(tr('errorLoadTrip'), err.message);
    showToast(tr('errorLoadData') + ' ' + err.message, 'error');
    return;
  }

  try {
    const attendeeId = getAttendeeFromUrl();
    if (attendeeId) {
      currentAttendee = attendees.find(a => a.id === attendeeId) || null;
      if (!currentAttendee) {
        try {
          currentAttendee = await db.getAttendee(attendeeId);
          attendees.push(currentAttendee);
        } catch {
          if (attendees.length > 0) currentAttendee = attendees[0];
          else {
            window.location.href = 'index.html';
            return;
          }
        }
      }
    } else if (attendees.length > 0) {
      currentAttendee = attendees[0];
    }

    updateAttendeeHeader();
    wireFilters();
    renderDays();
    renderSummary();

    channel = db.subscribeToChanges(['attendee_rsvps', 'attendees', 'events'], async () => {
      try {
        [attendees, events, rsvps] = await Promise.all([
          db.getAttendees(),
          db.getEvents(),
          db.getAllAttendeeRsvps()
        ]);
        events = enrichAndLocalize(events);
        if (currentAttendee) {
          currentAttendee = attendees.find(a => a.id === currentAttendee.id) || currentAttendee;
        }
        updateAttendeeHeader();
        renderDays();
        renderSummary();
      } catch { /* silent */ }
    });

    document.getElementById('fillGroupDinnersBtn').addEventListener('click', confirmGroupDinners);
    document.getElementById('copySummaryBtn').addEventListener('click', copySummary);
  } catch (err) {
    showDaysError(tr('errorLoadTrip'), err.message);
    showToast(tr('errorLoadData') + ' ' + err.message, 'error');
  }
}

function onLanguageChanged() {
  events = enrichAndLocalize(events.map(ev => {
    const base = { ...ev };
    if (ev._en) Object.assign(base, ev._en);
    return base;
  }));
  updateAttendeeHeader();
  renderDays();
  renderSummary();
}

function wireFilters() {
  document.querySelectorAll('#viewFilters [data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      viewMode = btn.dataset.view;
      document.querySelectorAll('#viewFilters .filter-btn').forEach(b => {
        b.classList.toggle('is-active', b === btn);
      });
      renderDays();
    });
  });

  document.querySelectorAll('#activityFacets [data-facet]').forEach(btn => {
    btn.addEventListener('click', () => {
      const facet = btn.dataset.facet;
      if (activeFacets.has(facet)) activeFacets.delete(facet);
      else activeFacets.add(facet);
      btn.classList.toggle('is-active', activeFacets.has(facet));
      renderDays();
    });
  });
}

function updateAttendeeHeader() {
  const nameEl = document.getElementById('currentAttendeeName');
  const metaEl = document.getElementById('currentAttendeeMeta');
  const navEl  = document.getElementById('attendeeNavName');
  const hintEl = document.getElementById('partyLimitHint');

  if (!currentAttendee) {
    nameEl.textContent = tr('rosterTitle');
    metaEl.textContent = tr('rosterMeta', { count: attendees.length });
    navEl.textContent = tr('navEveryone');
    if (hintEl) hintEl.hidden = true;
    return;
  }

  const maxP = maxPartyFor(currentAttendee);
  nameEl.textContent = currentAttendee.full_name;
  metaEl.textContent = `${currentAttendee.family_group} · ${currentAttendee.type === 'child' ? tr('typeChild') : tr('typeAdult')}`;
  navEl.textContent = currentAttendee.full_name;
  if (hintEl) {
    hintEl.hidden = false;
    hintEl.textContent = tr('partyMaxHint', { max: maxP });
  }
}

function visibleEvents() {
  const enrich = AE();
  return events.filter(ev => {
    if (enrich && !enrich.matchesViewMode(ev, viewMode)) return false;
    if (!enrich) {
      if (viewMode === 'dinners' && ev.event_type !== 'dinner') return false;
      if (viewMode === 'activities' && ev.event_type !== 'activity') return false;
      if (viewMode === 'kids' || viewMode === 'easy') return false;
    }
    for (const facet of activeFacets) {
      if (enrich && !enrich.matchesFacet(ev, facet)) return false;
    }
    return true;
  });
}

function groupAttendees(list) {
  const groups = new Map();
  list.forEach(a => {
    const key = a.family_group || tr('otherGroup');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(a);
  });
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function showDaysError(title, detail) {
  const container = document.getElementById('daysContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">
      <p><strong>${escapeHtml(title)}</strong></p>
      ${detail ? `<p style="margin-top:8px;font-size:var(--text-sm);color:var(--color-text-muted)">${escapeHtml(detail)}</p>` : ''}
      <p style="margin-top:var(--space-4)"><button type="button" class="primary-btn" onclick="location.reload()">${escapeHtml(tr('btnRetry'))}</button></p>
    </div>
  `;
}

function linkLabelFor(ev) {
  return /boil company/i.test(ev.restaurant || '') ? tr('linkBoil') : tr('linkVenue');
}

function indoorOutdoorLabel(value) {
  return window.I18n ? I18n.indoorOutdoorI18n(value) : value;
}

function renderActivityBadges(ev) {
  const badges = AE() ? AE().activityBadges(ev) : [];
  if (!badges.length) return '';
  return `<div class="activity-badges" aria-label="${escapeHtml(tr('activityHighlights'))}">${badges.map(b =>
    `<span class="meta-badge meta-badge--${escapeHtml(b.key)}">${b.icon} ${escapeHtml((window.I18n ? I18n.badgeLabelI18n(b.key, b.label) : b.label))}</span>`
  ).join('')}</div>`;
}

function renderExpandedActivityDetails(ev) {
  const effort = window.I18n ? I18n.effortLabelI18n(ev.effort_level) : (AE() ? AE().effortLabel(ev.effort_level) : ev.effort_level);
  const rows = [
    ['detailFullDesc', ev.full_description],
    ['detailBestFor', ev.best_for],
    ['detailEffort', effort],
    ['detailIndoorOutdoor', indoorOutdoorLabel(ev.indoor_outdoor)],
    ['detailAccessibility', ev.accessibility],
    ['detailReservation', ev.reservation_info || (ev.reserve ? tr('reservationNeededShort') : '')],
    ['detailFamilyFit', ev.family_fit]
  ].filter(([, val]) => val && String(val).trim());

  if (!rows.length) return '';

  return `
    <div class="activity-details-grid">
      ${rows.map(([labelKey, val]) => `
        <div class="activity-detail-row">
          <h6>${escapeHtml(typeof labelKey === 'string' && labelKey.startsWith('detail') ? t(labelKey) : labelKey)}</h6>
          <p>${escapeHtml(val)}</p>
        </div>
      `).join('')}
      ${ev.note ? `
        <div class="activity-detail-row">
          <h6>${escapeHtml(tr('detailTripNote'))}</h6>
          <p>${escapeHtml(ev.note)}</p>
        </div>
      ` : ''}
    </div>
  `;
}

function renderExtraGuestFields(attendeeId, eventId, rsvp, maxP) {
  if (!rsvp.attending || rsvp.party_size <= 1) return '';
  const slots = rsvp.party_size - 1;
  const names = rsvp.extra_guest_names || [];
  let html = `<div class="extra-guest-fields" id="guests-${attendeeId}-${eventId}">`;
  html += `<p class="tiny extra-guest-label">${escapeHtml(tr('extraGuestLabel'))}</p>`;
  for (let i = 0; i < slots; i++) {
    const val = names[i] || '';
    html += `
      <div class="field field--compact">
        <label for="guest-${attendeeId}-${eventId}-${i}">${escapeHtml(tr('extraGuestName', { n: i + 1 }))}</label>
        <input type="text" id="guest-${attendeeId}-${eventId}-${i}" class="extra-guest-input"
          value="${escapeHtml(val)}" placeholder="${escapeHtml(tr('extraGuestPlaceholder'))}"
          onchange="updateGuestName('${attendeeId}', '${eventId}', ${i}, this.value)" />
      </div>
    `;
  }
  html += '</div>';
  return html;
}

function renderPartyRsvpRow(attendee, eventId) {
  const rsvp = getRsvp(attendee.id, eventId);
  const maxP = maxPartyFor(attendee);
  const highlight = currentAttendee && attendee.id === currentAttendee.id ? ' attendee-row--you' : '';
  const sizeDisabled = !rsvp.attending ? 'disabled' : '';

  return `
    <div class="attendee-row attendee-row--party${highlight}">
      <div class="attendee-row-info">
        <span class="attendee-row-name">${escapeHtml(attendee.full_name)}</span>
        <span class="type-pill type-pill--${attendee.type}">${attendee.type === 'child' ? tr('typeChild') : tr('typeAdult')}</span>
        <span class="tiny party-cap">${escapeHtml(tr('partyCapShort', { max: maxP }))}</span>
      </div>
      <div class="party-rsvp-stack">
        <div class="segmented segmented--compact">
          <button type="button"
            class="${rsvp.attending ? 'active-yes' : ''}"
            onclick="setAttending('${attendee.id}', '${eventId}', true)"
            title="${escapeHtml(tr('goingYes'))}" aria-label="${escapeHtml(tr('goingYes'))}">✓</button>
          <button type="button"
            class="${!rsvp.attending ? 'active-no' : ''}"
            onclick="setAttending('${attendee.id}', '${eventId}', false)"
            title="${escapeHtml(tr('goingNo'))}" aria-label="${escapeHtml(tr('goingNo'))}">✕</button>
        </div>
        <div class="party-size-field">
          <label class="tiny" for="party-size-${attendee.id}-${eventId}">${escapeHtml(tr('partySizeLabel'))}</label>
          <input type="number" id="party-size-${attendee.id}-${eventId}" class="party-size-input"
            min="1" max="${maxP}" value="${rsvp.attending ? rsvp.party_size : 1}"
            ${sizeDisabled}
            onchange="updatePartySize('${attendee.id}', '${eventId}', this.value)" />
        </div>
        ${renderExtraGuestFields(attendee.id, eventId, rsvp, maxP)}
      </div>
    </div>
  `;
}

function renderAttendeeRsvpRows(eventId) {
  const grouped = groupAttendees(attendees);
  return grouped.map(([familyGroup, members]) => `
    <div class="attendee-group-block">
      <div class="attendee-group-label">${escapeHtml(familyGroup)}</div>
      ${members.map(a => renderPartyRsvpRow(a, eventId)).join('')}
    </div>
  `).join('');
}

function renderWhosGoing(eventId) {
  const total = eventPartyTotal(eventId);
  const lines = goingPartySummaries(eventId);
  const goingChips = lines.length
    ? `<div class="going-families">${lines.map(n => `<span class="going-chip">${escapeHtml(n)}</span>`).join('')}</div>`
    : `<p class="tiny" style="margin-top:4px">${escapeHtml(tr('noConfirmations'))}</p>`;
  return `
    <div class="detail-item">
      <h5>${escapeHtml(tr('labelWhosGoing'))} <span style="font-weight:400;color:var(--color-text-muted)">(${total} ${total === 1 ? tr('person') : tr('people')})</span></h5>
      ${goingChips}
    </div>
  `;
}

function renderActivityCard(ev) {
  const count = eventPartyTotal(ev.id);
  const expanded = expandedIds.has(ev.id);
  const shortDesc = ev.short_description || ev.description || '';
  const detailsId = `activity-details-${ev.id}`;

  return `
    <article class="day-card day-card--activity" data-kind="activity">
      <div class="day-head">
        <div>
          <div class="tiny">${escapeHtml(ev.day)} · ${escapeHtml(ev.date)}</div>
          <h4>${escapeHtml(ev.title)}</h4>
          <div class="day-meta">${escapeHtml(ev.restaurant)} · ${escapeHtml(ev.area)}</div>
        </div>
        <div class="row day-head-badges">
          ${renderActivityBadges(ev)}
          <span class="count-pill" title="${escapeHtml(tr('peopleConfirmed', { count }))}">${count}</span>
        </div>
      </div>
      <div class="day-body day-body--attendees">
        <div class="detail-list activity-summary">
          <div class="detail-item detail-item--lead">
            <p class="activity-short">${escapeHtml(shortDesc)}</p>
            ${ev.link ? `<p class="activity-link"><a href="${escapeHtml(ev.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkLabelFor(ev))}</a></p>` : ''}
          </div>
          <button type="button" class="details-toggle" aria-expanded="${expanded}" aria-controls="${detailsId}"
            onclick="toggleActivityDetails('${ev.id}')">
            ${expanded ? tr('hideDetails') : tr('moreDetails')}
            <span class="details-toggle-chevron" aria-hidden="true">${expanded ? '▴' : '▾'}</span>
          </button>
          <div id="${detailsId}" class="activity-details ${expanded ? 'is-open' : ''}">
            ${renderExpandedActivityDetails(ev)}
          </div>
          ${renderWhosGoing(ev.id)}
        </div>
        <div class="attendee-rsvp-panel">
          <h5 class="attendee-rsvp-heading">${escapeHtml(tr('rsvpByParty'))}</h5>
          ${renderAttendeeRsvpRows(ev.id)}
        </div>
      </div>
    </article>
  `;
}

function renderDinnerCard(ev) {
  const count = eventPartyTotal(ev.id);
  const reserveClass = ev.reserve ? 'reserve' : 'noreserve';
  const reserveLabel = ev.reserve ? tr('reservationNeeded') : tr('noReservation');

  return `
    <article class="day-card" data-kind="dinner">
      <div class="day-head">
        <div>
          <div class="tiny">${escapeHtml(ev.day)} · ${escapeHtml(ev.date)}</div>
          <h4>${escapeHtml(ev.title)}</h4>
          <div class="day-meta">${escapeHtml(ev.restaurant)} · ${escapeHtml(ev.area)}</div>
        </div>
        <div class="row">
          <span class="badge ${reserveClass}">${reserveLabel}</span>
          <span class="count-pill" title="${escapeHtml(tr('peopleConfirmed', { count }))}">${count}</span>
        </div>
      </div>
      <div class="day-body day-body--attendees">
        <div class="detail-list">
          <div class="detail-item">
            <h5>${escapeHtml(tr('labelDescription'))}</h5>
            <p>${escapeHtml(ev.description)}</p>
          </div>
          ${ev.note ? `<div class="detail-item"><h5>${escapeHtml(tr('labelNote'))}</h5><p>${escapeHtml(ev.note)}</p></div>` : ''}
          ${ev.link ? `<div class="detail-item"><h5>${escapeHtml(tr('labelLink'))}</h5><p><a href="${escapeHtml(ev.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkLabelFor(ev))}</a></p></div>` : ''}
          ${renderWhosGoing(ev.id)}
        </div>
        <div class="attendee-rsvp-panel">
          <h5 class="attendee-rsvp-heading">${escapeHtml(tr('rsvpByParty'))}</h5>
          ${renderAttendeeRsvpRows(ev.id)}
        </div>
      </div>
    </article>
  `;
}

function renderDays() {
  const container = document.getElementById('daysContainer');
  const visible   = visibleEvents();

  if (visible.length === 0) {
    container.innerHTML = `<p class="empty-state">${escapeHtml(tr('emptyNoEvents'))}</p>`;
    return;
  }

  container.innerHTML = visible.map(ev =>
    ev.event_type === 'activity' ? renderActivityCard(ev) : renderDinnerCard(ev)
  ).join('');
}

function toggleActivityDetails(id) {
  if (expandedIds.has(id)) expandedIds.delete(id);
  else expandedIds.add(id);
  renderDays();
}
window.toggleActivityDetails = toggleActivityDetails;

function renderSummary() {
  const el = document.getElementById('attendeeSummary');
  if (!currentAttendee) {
    const totalPeople = rsvps
      .filter(r => r.attending && r.party_size > 0)
      .reduce((s, r) => s + r.party_size, 0);
    el.innerHTML = `
      <div class="summary-card">
        <strong>${attendees.length}</strong>
        <span>${escapeHtml(tr('summaryAttendeesListed', { count: attendees.length }))}</span>
      </div>
      <div class="summary-card">
        <strong>${totalPeople}</strong>
        <span>${escapeHtml(tr('summaryAllPartyTotal', { total: totalPeople }))}</span>
      </div>
    `;
    return;
  }

  const myRsvps = rsvps.filter(r => r.attendee_id === currentAttendee.id && r.attending && r.party_size > 0);
  const dinners = myRsvps.filter(r => events.find(e => e.id === r.event_id && e.event_type === 'dinner')).length;
  const acts    = myRsvps.filter(r => events.find(e => e.id === r.event_id && e.event_type === 'activity')).length;
  const peopleTotal = myRsvps.reduce((s, r) => s + r.party_size, 0);

  el.innerHTML = `
    <div class="summary-card">
      <strong>${escapeHtml(currentAttendee.full_name)}</strong>
      <span>${escapeHtml(currentAttendee.family_group)}</span>
    </div>
    <div class="summary-card">
      <strong>${escapeHtml(tr('summaryEventsGoing', { count: myRsvps.length }))}</strong>
      <span>${escapeHtml(tr('summaryDinnersActs', { dinners, acts }))}</span>
    </div>
    <div class="summary-card">
      <strong>${escapeHtml(tr('summaryPeopleRepresented', { total: peopleTotal }))}</strong>
      <span>${escapeHtml(tr('summaryPeopleRepresentedHint'))}</span>
    </div>
  `;
}

function upsertLocalRsvp(attendeeId, eventId, payload) {
  const attendee = attendees.find(a => a.id === attendeeId);
  let existing = rsvps.find(r => r.attendee_id === attendeeId && r.event_id === eventId);
  const maxP = maxPartyFor(attendee);
  const attending = !!payload.attending;
  let partySize = attending ? Math.min(maxP, Math.max(1, parseInt(payload.partySize, 10) || 1)) : 0;
  let extraGuestNames = attending && partySize > 1
    ? (payload.extraGuestNames || []).slice(0, partySize - 1)
    : [];

  while (extraGuestNames.length < partySize - 1) extraGuestNames.push('');

  const row = {
    attendee_id: attendeeId,
    event_id: eventId,
    attending,
    going: attending,
    party_size: partySize,
    extra_guest_names: extraGuestNames,
    attendees: attendee ? { ...attendee } : existing?.attendees
  };

  if (existing) Object.assign(existing, row);
  else rsvps.push(row);
  return row;
}

async function persistRsvp(attendeeId, eventId, payload) {
  upsertLocalRsvp(attendeeId, eventId, payload);
  renderDays();
  renderSummary();
  try {
    await db.upsertAttendeeRsvp(attendeeId, eventId, payload);
  } catch (err) {
    showToast(tr('toastSaveRsvpError') + ' ' + err.message, 'error');
    try {
      attendees = await db.getAttendees();
      events = enrichAndLocalize(await db.getEvents());
      rsvps = await db.getAllAttendeeRsvps();
      renderDays();
      renderSummary();
    } catch { /* keep optimistic state */ }
  }
}

function setAttending(attendeeId, eventId, attending) {
  if (!attending) {
    persistRsvp(attendeeId, eventId, { attending: false, partySize: 0, extraGuestNames: [] });
    return;
  }
  const prev = getRsvp(attendeeId, eventId);
  const partySize = prev.party_size > 0 ? prev.party_size : 1;
  persistRsvp(attendeeId, eventId, {
    attending: true,
    partySize,
    extraGuestNames: prev.extra_guest_names || []
  });
}
window.setAttending = setAttending;

function updatePartySize(attendeeId, eventId, rawValue) {
  const attendee = attendees.find(a => a.id === attendeeId);
  const maxP = maxPartyFor(attendee);
  let partySize = parseInt(rawValue, 10);
  if (Number.isNaN(partySize)) partySize = 1;
  partySize = Math.min(maxP, Math.max(1, partySize));

  const prev = getRsvp(attendeeId, eventId);
  let names = [...(prev.extra_guest_names || [])];
  if (partySize <= 1) names = [];
  else {
    names = names.slice(0, partySize - 1);
    while (names.length < partySize - 1) names.push('');
  }

  persistRsvp(attendeeId, eventId, {
    attending: true,
    partySize,
    extraGuestNames: names
  });
}
window.updatePartySize = updatePartySize;

function updateGuestName(attendeeId, eventId, index, name) {
  const prev = getRsvp(attendeeId, eventId);
  if (!prev.attending || prev.party_size <= 1) return;
  const names = [...(prev.extra_guest_names || [])];
  while (names.length < prev.party_size - 1) names.push('');
  names[index] = name.trim();
  persistRsvp(attendeeId, eventId, {
    attending: true,
    partySize: prev.party_size,
    extraGuestNames: names
  });
}
window.updateGuestName = updateGuestName;

async function confirmGroupDinners() {
  if (!currentAttendee) {
    showToast(tr('toastSelectName'), 'error');
    return;
  }

  const group = attendees.filter(a => a.family_group === currentAttendee.family_group);
  const dinnerIds = events.filter(e => e.event_type === 'dinner').map(e => e.id);

  try {
    const ops = [];
    for (const person of group) {
      for (const eventId of dinnerIds) {
        ops.push(db.upsertAttendeeRsvp(person.id, eventId, {
          attending: true,
          partySize: 1,
          extraGuestNames: []
        }));
        upsertLocalRsvp(person.id, eventId, { attending: true, partySize: 1, extraGuestNames: [] });
      }
    }
    await Promise.all(ops);
    renderDays();
    renderSummary();
    showToast(tr('toastDinnersSuccess', { group: currentAttendee.family_group }), 'success');
  } catch (err) {
    showToast(tr('toastDinnersError') + ' ' + err.message, 'error');
  }
}

async function copySummary() {
  if (!currentAttendee) {
    showToast(tr('toastCopySelectName'), 'error');
    return;
  }

  const myRows = rsvps
    .filter(r => r.attendee_id === currentAttendee.id && r.attending && r.party_size > 0);

  const lines = myRows.map(r => {
    const ev = events.find(e => e.id === r.event_id);
    if (!ev) return '';
    const guests = (r.extra_guest_names || []).filter(Boolean).join(', ');
    const sizeNote = r.party_size > 1 ? ` (${r.party_size} ${tr('people')}${guests ? ': ' + guests : ''})` : '';
    return `${ev.date} – ${ev.title}${sizeNote}`;
  }).filter(Boolean);

  const text = [
    `${currentAttendee.full_name} (${currentAttendee.family_group})`,
    ...lines
  ].join('\n');

  try {
    await navigator.clipboard.writeText(text);
    showToast(tr('toastCopySuccess'), 'success');
  } catch {
    showToast(tr('toastCopyFail'), 'error');
  }
}

document.addEventListener('DOMContentLoaded', init);

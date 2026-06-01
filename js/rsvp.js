// RSVP page: per-attendee Going / Not Going, enriched activity cards

let currentAttendee = null;
let attendees = [];
let events  = [];
let rsvps   = [];
let viewMode = 'all';
const activeFacets = new Set();
const expandedIds = new Set();
let channel = null;

const AE = () => window.ActivityEnrichment;
const t = (key, vars) => (window.I18n ? I18n.t(key, vars) : key);

function enrichAndLocalize(list) {
  const mapped = list.map(ev =>
    ev.event_type === 'activity' && AE() ? AE().enrichEvent({ ...ev }) : { ...ev }
  );
  return window.I18n ? I18n.localizeEvents(mapped) : mapped;
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
    showDaysError(t('errorLoadTrip'), err.message);
    showToast(t('errorLoadData') + ' ' + err.message, 'error');
    return;
  }

  const attendeeId = getAttendeeFromUrl();
  if (attendeeId) {
    currentAttendee = attendees.find(a => a.id === attendeeId) || null;
    if (!currentAttendee) {
      try {
        currentAttendee = await db.getAttendee(attendeeId);
        attendees.push(currentAttendee);
      } catch {
        window.location.href = 'index.html';
        return;
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

  if (!currentAttendee) {
    nameEl.textContent = t('rosterTitle');
    metaEl.textContent = t('rosterMeta', { count: attendees.length });
    navEl.textContent = t('navEveryone');
    return;
  }

  nameEl.textContent = currentAttendee.full_name;
  metaEl.textContent = `${currentAttendee.family_group} · ${currentAttendee.type === 'child' ? t('typeChild') : t('typeAdult')}`;
  navEl.textContent = currentAttendee.full_name;
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

function attendeeRsvp(attendeeId, eventId) {
  const r = rsvps.find(x => x.attendee_id === attendeeId && x.event_id === eventId);
  return r ? r.going : null;
}

function eventGoingCount(eventId) {
  return rsvps.filter(r => r.event_id === eventId && r.going).length;
}

function goingAttendeeNames(eventId) {
  return rsvps
    .filter(r => r.event_id === eventId && r.going && r.attendees)
    .map(r => r.attendees.full_name);
}

function groupAttendees(list) {
  const groups = new Map();
  list.forEach(a => {
    const key = a.family_group || t('otherGroup');
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
      <p style="margin-top:var(--space-4)"><button type="button" class="primary-btn" onclick="location.reload()">${escapeHtml(t('btnRetry'))}</button></p>
    </div>
  `;
}

function linkLabelFor(ev) {
  return /boil company/i.test(ev.restaurant || '')
    ? t('linkBoil')
    : t('linkVenue');
}

function indoorOutdoorLabel(value) {
  return window.I18n ? I18n.indoorOutdoorI18n(value) : value;
}

function renderActivityBadges(ev) {
  const badges = AE() ? AE().activityBadges(ev) : [];
  if (!badges.length) return '';
  return `<div class="activity-badges" aria-label="${escapeHtml(t('activityHighlights'))}">${badges.map(b =>
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
    ['detailReservation', ev.reservation_info || (ev.reserve ? t('reservationNeededShort') : '')],
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
          <h6>${escapeHtml(t('detailTripNote'))}</h6>
          <p>${escapeHtml(ev.note)}</p>
        </div>
      ` : ''}
    </div>
  `;
}

function renderAttendeeRsvpRows(eventId) {
  const grouped = groupAttendees(attendees);
  return grouped.map(([familyGroup, members]) => `
    <div class="attendee-group-block">
      <div class="attendee-group-label">${escapeHtml(familyGroup)}</div>
      ${members.map(a => {
        const answer = attendeeRsvp(a.id, eventId);
        const highlight = currentAttendee && a.id === currentAttendee.id ? ' attendee-row--you' : '';
        return `
          <div class="attendee-row${highlight}">
            <div class="attendee-row-info">
              <span class="attendee-row-name">${escapeHtml(a.full_name)}</span>
              <span class="type-pill type-pill--${a.type}">${a.type === 'child' ? t('typeChild') : t('typeAdult')}</span>
            </div>
            <div class="segmented segmented--compact">
              <button type="button"
                class="${answer === true ? 'active-yes' : ''}"
                onclick="rsvpClick('${a.id}', '${eventId}', true)" title="${escapeHtml(t('goingYes'))}" aria-label="${escapeHtml(t('goingYes'))}">✓</button>
              <button type="button"
                class="${answer === false ? 'active-no' : ''}"
                onclick="rsvpClick('${a.id}', '${eventId}', false)" title="${escapeHtml(t('goingNo'))}" aria-label="${escapeHtml(t('goingNo'))}">✕</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `).join('');
}

function renderWhosGoing(count, going) {
  const goingChips = going.length
    ? `<div class="going-families">${going.map(n => `<span class="going-chip">${escapeHtml(n)}</span>`).join('')}</div>`
    : `<p class="tiny" style="margin-top:4px">${escapeHtml(t('noConfirmations'))}</p>`;
  return `
    <div class="detail-item">
      <h5>${escapeHtml(t('labelWhosGoing'))} <span style="font-weight:400;color:var(--color-text-muted)">(${count} ${count === 1 ? t('person') : t('people')})</span></h5>
      ${goingChips}
    </div>
  `;
}

function renderActivityCard(ev) {
  const count = eventGoingCount(ev.id);
  const going = goingAttendeeNames(ev.id);
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
          <span class="count-pill" title="${escapeHtml(t('peopleConfirmed', { count }))}">${count}</span>
        </div>
      </div>
      <div class="day-body day-body--attendees">
        <div class="detail-list activity-summary">
          <div class="detail-item detail-item--lead">
            <p class="activity-short">${escapeHtml(shortDesc)}</p>
            ${ev.link ? `<p class="activity-link"><a href="${escapeHtml(ev.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkLabelFor(ev))}</a></p>` : ''}
          </div>
          <button type="button"
            class="details-toggle"
            aria-expanded="${expanded}"
            aria-controls="${detailsId}"
            onclick="toggleActivityDetails('${ev.id}')">
            ${expanded ? t('hideDetails') : t('moreDetails')}
            <span class="details-toggle-chevron" aria-hidden="true">${expanded ? '▴' : '▾'}</span>
          </button>
          <div id="${detailsId}" class="activity-details ${expanded ? 'is-open' : ''}">
            ${renderExpandedActivityDetails(ev)}
          </div>
          ${renderWhosGoing(count, going)}
        </div>
        <div class="attendee-rsvp-panel">
          <h5 class="attendee-rsvp-heading">${escapeHtml(t('rsvpByPerson'))}</h5>
          ${renderAttendeeRsvpRows(ev.id)}
        </div>
      </div>
    </article>
  `;
}

function renderDinnerCard(ev) {
  const count = eventGoingCount(ev.id);
  const going = goingAttendeeNames(ev.id);
  const reserveClass = ev.reserve ? 'reserve' : 'noreserve';
  const reserveLabel = ev.reserve ? t('reservationNeeded') : t('noReservation');

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
          <span class="count-pill" title="${escapeHtml(t('peopleConfirmed', { count }))}">${count}</span>
        </div>
      </div>
      <div class="day-body day-body--attendees">
        <div class="detail-list">
          <div class="detail-item">
            <h5>${escapeHtml(t('labelDescription'))}</h5>
            <p>${escapeHtml(ev.description)}</p>
          </div>
          ${ev.note ? `
            <div class="detail-item">
              <h5>${escapeHtml(t('labelNote'))}</h5>
              <p>${escapeHtml(ev.note)}</p>
            </div>
          ` : ''}
          ${ev.link ? `
            <div class="detail-item">
              <h5>${escapeHtml(t('labelLink'))}</h5>
              <p><a href="${escapeHtml(ev.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkLabelFor(ev))}</a></p>
            </div>
          ` : ''}
          ${renderWhosGoing(count, going)}
        </div>
        <div class="attendee-rsvp-panel">
          <h5 class="attendee-rsvp-heading">RSVP by person</h5>
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
    container.innerHTML = `<p class="empty-state">${escapeHtml(t('emptyNoEvents'))}</p>`;
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
    const totalGoing = rsvps.filter(r => r.going).length;
    el.innerHTML = `
      <div class="summary-card">
        <strong>${attendees.length}</strong>
        <span>${escapeHtml(t("summaryTotalGoing", { total: totalGoing }))}</span>
      </div>
    `;
    return;
  }

  const myYes = rsvps.filter(r => r.attendee_id === currentAttendee.id && r.going);
  const dinners = myYes.filter(r => events.find(e => e.id === r.event_id && e.event_type === 'dinner')).length;
  const acts    = myYes.filter(r => events.find(e => e.id === r.event_id && e.event_type === 'activity')).length;
  const groupSize = attendees.filter(a => a.family_group === currentAttendee.family_group).length;

  el.innerHTML = `
    <div class="summary-card">
      <strong>${escapeHtml(currentAttendee.full_name)}</strong>
      <span>${escapeHtml(currentAttendee.family_group)}</span>
    </div>
    <div class="summary-card">
      <strong>${escapeHtml(t('summaryEventsGoing', { count: myYes.length }))}</strong>
      <span>${escapeHtml(t('summaryDinnersActs', { dinners, acts }))}</span>
    </div>
    <div class="summary-card">
      <strong>${escapeHtml(t('summaryInGroup', { count: groupSize }))}</strong>
      <span>${escapeHtml(t('summaryUpdateHint'))}</span>
    </div>
  `;
}

async function rsvpClick(attendeeId, eventId, going) {
  const existing = rsvps.find(r => r.attendee_id === attendeeId && r.event_id === eventId);
  const attendee = attendees.find(a => a.id === attendeeId);

  if (existing) existing.going = going;
  else if (attendee) {
    rsvps.push({ attendee_id: attendeeId, event_id: eventId, going, attendees: { ...attendee } });
  }

  renderDays();
  renderSummary();

  try {
    await db.upsertAttendeeRsvp(attendeeId, eventId, going);
  } catch (err) {
    showToast(t('toastSaveRsvpError') + ' ' + err.message, 'error');
    if (existing) existing.going = !going;
    else {
      const idx = rsvps.findIndex(r => r.attendee_id === attendeeId && r.event_id === eventId);
      if (idx !== -1) rsvps.splice(idx, 1);
    }
    renderDays();
    renderSummary();
  }
}
window.rsvpClick = rsvpClick;

async function confirmGroupDinners() {
  if (!currentAttendee) {
    showToast(t('toastSelectName'), 'error');
    return;
  }

  const group = attendees.filter(a => a.family_group === currentAttendee.family_group);
  const dinnerIds = events.filter(e => e.event_type === 'dinner').map(e => e.id);

  try {
    const ops = [];
    for (const person of group) {
      for (const eventId of dinnerIds) {
        ops.push(db.upsertAttendeeRsvp(person.id, eventId, true));
        const existing = rsvps.find(r => r.attendee_id === person.id && r.event_id === eventId);
        if (existing) existing.going = true;
        else {
          rsvps.push({
            attendee_id: person.id,
            event_id: eventId,
            going: true,
            attendees: { ...person }
          });
        }
      }
    }
    await Promise.all(ops);
    renderDays();
    renderSummary();
    showToast(t('toastDinnersSuccess', { group: currentAttendee.family_group }), 'success');
  } catch (err) {
    showToast(t('toastDinnersError') + ' ' + err.message, 'error');
  }
}

async function copySummary() {
  if (!currentAttendee) {
    showToast(t('toastCopySelectName'), 'error');
    return;
  }

  const myYes = rsvps
    .filter(r => r.attendee_id === currentAttendee.id && r.going)
    .map(r => events.find(e => e.id === r.event_id))
    .filter(Boolean)
    .sort((a, b) => a.sort_order - b.sort_order);

  const text = [
    `${currentAttendee.full_name} (${currentAttendee.family_group})`,
    ...myYes.map(ev => `${ev.date} – ${ev.title} (${ev.restaurant})`)
  ].join('\n');

  try {
    await navigator.clipboard.writeText(text);
    showToast(t('toastCopySuccess'), 'success');
  } catch {
    showToast(t('toastCopyFail'), 'error');
  }
}

document.addEventListener('DOMContentLoaded', init);

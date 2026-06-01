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

async function init() {
  initThemeToggle();

  try {
    [attendees, events, rsvps] = await Promise.all([
      db.getAttendees(),
      db.getEvents(),
      db.getAllAttendeeRsvps()
    ]);
    events = events.map(ev =>
      ev.event_type === 'activity' && AE() ? AE().enrichEvent(ev) : ev
    );
  } catch (err) {
    showDaysError('Could not load trip data.', err.message);
    showToast('Failed to load data: ' + err.message, 'error');
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
      events = events.map(ev =>
        ev.event_type === 'activity' && AE() ? AE().enrichEvent(ev) : ev
      );
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
    nameEl.textContent = 'Full trip roster';
    metaEl.textContent = `${attendees.length} attendees`;
    navEl.textContent = 'Everyone';
    return;
  }

  nameEl.textContent = currentAttendee.full_name;
  metaEl.textContent = `${currentAttendee.family_group} · ${currentAttendee.type === 'child' ? 'Child' : 'Adult'}`;
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
    const key = a.family_group || 'Other';
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
      <p style="margin-top:var(--space-4)"><button type="button" class="primary-btn" onclick="location.reload()">Retry</button></p>
    </div>
  `;
}

function linkLabelFor(ev) {
  return /boil company/i.test(ev.restaurant || '')
    ? 'Book catering / boil'
    : 'Open venue / activity site';
}

function indoorOutdoorLabel(value) {
  if (value === 'both') return 'Indoor & outdoor';
  if (value === 'indoor') return 'Indoor';
  return 'Outdoor';
}

function renderActivityBadges(ev) {
  const badges = AE() ? AE().activityBadges(ev) : [];
  if (!badges.length) return '';
  return `<div class="activity-badges" aria-label="Activity highlights">${badges.map(b =>
    `<span class="meta-badge meta-badge--${escapeHtml(b.key)}">${b.icon} ${escapeHtml(b.label)}</span>`
  ).join('')}</div>`;
}

function renderExpandedActivityDetails(ev) {
  const effort = AE() ? AE().effortLabel(ev.effort_level) : ev.effort_level;
  const rows = [
    ['Full description', ev.full_description],
    ['Best for', ev.best_for],
    ['Effort level', effort],
    ['Indoor / outdoor', indoorOutdoorLabel(ev.indoor_outdoor)],
    ['Accessibility', ev.accessibility],
    ['Reservation info', ev.reservation_info || (ev.reserve ? 'Reservation needed.' : '')],
    ['Why this fits the trip', ev.family_fit]
  ].filter(([, val]) => val && String(val).trim());

  if (!rows.length) return '';

  return `
    <div class="activity-details-grid">
      ${rows.map(([label, val]) => `
        <div class="activity-detail-row">
          <h6>${escapeHtml(label)}</h6>
          <p>${escapeHtml(val)}</p>
        </div>
      `).join('')}
      ${ev.note ? `
        <div class="activity-detail-row">
          <h6>Trip note</h6>
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
              <span class="type-pill type-pill--${a.type}">${a.type === 'child' ? 'Child' : 'Adult'}</span>
            </div>
            <div class="segmented segmented--compact">
              <button type="button"
                class="${answer === true ? 'active-yes' : ''}"
                onclick="rsvpClick('${a.id}', '${eventId}', true)">✓</button>
              <button type="button"
                class="${answer === false ? 'active-no' : ''}"
                onclick="rsvpClick('${a.id}', '${eventId}', false)">✕</button>
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
    : '<p class="tiny" style="margin-top:4px">No confirmations yet</p>';
  return `
    <div class="detail-item">
      <h5>Who's going <span style="font-weight:400;color:var(--color-text-muted)">(${count} ${count === 1 ? 'person' : 'people'})</span></h5>
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
          <span class="count-pill" title="${count} people confirmed">${count}</span>
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
            ${expanded ? 'Hide details' : 'More details'}
            <span class="details-toggle-chevron" aria-hidden="true">${expanded ? '▴' : '▾'}</span>
          </button>
          <div id="${detailsId}" class="activity-details ${expanded ? 'is-open' : ''}">
            ${renderExpandedActivityDetails(ev)}
          </div>
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

function renderDinnerCard(ev) {
  const count = eventGoingCount(ev.id);
  const going = goingAttendeeNames(ev.id);
  const reserveClass = ev.reserve ? 'reserve' : 'noreserve';
  const reserveLabel = ev.reserve ? 'Reservation needed' : 'No reservation required';

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
          <span class="count-pill" title="${count} people confirmed">${count}</span>
        </div>
      </div>
      <div class="day-body day-body--attendees">
        <div class="detail-list">
          <div class="detail-item">
            <h5>Description</h5>
            <p>${escapeHtml(ev.description)}</p>
          </div>
          ${ev.note ? `
            <div class="detail-item">
              <h5>Note</h5>
              <p>${escapeHtml(ev.note)}</p>
            </div>
          ` : ''}
          ${ev.link ? `
            <div class="detail-item">
              <h5>Link</h5>
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
    container.innerHTML = '<p class="empty-state">No events match this view or filter. Try clearing activity filters or switching the view.</p>';
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
        <strong>${attendees.length} attendees</strong>
        <span>${totalGoing} total Going responses</span>
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
      <strong>${myYes.length} event${myYes.length !== 1 ? 's' : ''} Going</strong>
      <span>${dinners} dinner${dinners !== 1 ? 's' : ''} · ${acts} activit${acts !== 1 ? 'ies' : 'y'}</span>
    </div>
    <div class="summary-card">
      <strong>${groupSize} in your group</strong>
      <span>Update each person on the event cards</span>
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
    showToast('Could not save RSVP: ' + err.message, 'error');
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
    showToast('Select your name on the home page first.', 'error');
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
    showToast(`Marked all dinners Going for ${currentAttendee.family_group}.`, 'success');
  } catch (err) {
    showToast('Could not update dinners: ' + err.message, 'error');
  }
}

async function copySummary() {
  if (!currentAttendee) {
    showToast('Select your name on the home page to copy a personal summary.', 'error');
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
    showToast('Summary copied to clipboard.', 'success');
  } catch {
    showToast('Clipboard copy failed in this browser.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', init);

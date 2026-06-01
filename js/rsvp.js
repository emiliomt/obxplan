// RSVP page: live itinerary with Going / Not Going per event

let currentFamily = null;
let events  = [];
let rsvps   = [];
let filter  = 'all';
let channel = null;

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  initThemeToggle();

  const familyId = getFamilyFromUrl();
  if (!familyId) { window.location.href = 'index.html'; return; }

  try {
    currentFamily = await db.getFamily(familyId);
  } catch {
    // Family not found or bad ID
    window.location.href = 'index.html';
    return;
  }

  updateFamilyHeader();
  document.getElementById('familyCountInput').value = currentFamily.headcount;

  try {
    [events, rsvps] = await Promise.all([db.getEvents(), db.getAllRsvps()]);
  } catch (err) {
    showToast('Failed to load data: ' + err.message, 'error');
    return;
  }

  renderDays();
  renderSummary();

  // Real-time: re-fetch on any rsvp or family change
  channel = db.subscribeToChanges(['rsvps', 'families'], async () => {
    try {
      [rsvps, events] = await Promise.all([db.getAllRsvps(), db.getEvents()]);
      // Refresh family headcount in case admin changed it
      currentFamily = await db.getFamily(currentFamily.id);
      document.getElementById('familyCountInput').value = currentFamily.headcount;
      updateFamilyHeader();
      renderDays();
      renderSummary();
    } catch { /* silent — next change will retry */ }
  });

  // Filter buttons
  document.getElementById('showAllBtn').addEventListener('click', () => setFilter('all'));
  document.getElementById('showDinnersBtn').addEventListener('click', () => setFilter('dinners'));
  document.getElementById('showActivitiesBtn').addEventListener('click', () => setFilter('activities'));

  // Headcount save
  document.getElementById('applyCountBtn').addEventListener('click', applyCount);

  // Confirm all dinners
  document.getElementById('fillAllYesBtn').addEventListener('click', confirmAllDinners);

  // Copy summary
  document.getElementById('copySummaryBtn').addEventListener('click', copySummary);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function updateFamilyHeader() {
  document.getElementById('currentFamilyName').textContent = currentFamily.name;
  document.getElementById('familyNavName').textContent     = currentFamily.name;
}

function setFilter(f) {
  filter = f;
  renderDays();
}

function visibleEvents() {
  if (filter === 'dinners')    return events.filter(e => e.event_type === 'dinner');
  if (filter === 'activities') return events.filter(e => e.event_type === 'activity');
  return events;
}

// Sum of headcounts for families that marked going=true for this event
function eventHeadcount(eventId) {
  return rsvps
    .filter(r => r.event_id === eventId && r.going && r.families)
    .reduce((sum, r) => sum + (r.families.headcount || 0), 0);
}

// Names of families going (excluding current family — shown separately)
function goingFamilies(eventId) {
  return rsvps
    .filter(r => r.event_id === eventId && r.going && r.families)
    .map(r => r.families.name);
}

function myRsvp(eventId) {
  const r = rsvps.find(r => r.event_id === eventId && r.family_id === currentFamily.id);
  return r ? r.going : null; // null = not yet answered
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderDays() {
  const container = document.getElementById('daysContainer');
  const visible   = visibleEvents();

  if (visible.length === 0) {
    container.innerHTML = '<p class="empty-state">No events match this filter.</p>';
    return;
  }

  container.innerHTML = visible.map(ev => {
    const count    = eventHeadcount(ev.id);
    const going    = goingFamilies(ev.id);
    const myAnswer = myRsvp(ev.id);
    const reserveClass = ev.reserve ? 'reserve' : 'noreserve';
    const reserveLabel = ev.reserve ? 'Reservation needed' : 'No reservation required';

    const goingChips = going.length
      ? `<div class="going-families">${going.map(n => `<span class="going-chip">${escapeHtml(n)}</span>`).join('')}</div>`
      : '<p style="font-size:var(--text-xs);color:var(--color-text-faint);margin-top:4px">No confirmations yet</p>';

    return `
      <article class="day-card" data-kind="${ev.event_type}">
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
        <div class="day-body">
          <div class="detail-list">
            <div class="detail-item">
              <h5>Description</h5>
              <p>${escapeHtml(eventDescriptionText(ev))}</p>
            </div>
            <div class="detail-item">
              <h5>Note</h5>
              <p>${escapeHtml(ev.note)}</p>
            </div>
            <div class="detail-item">
              <h5>Link</h5>
              <p><a href="${escapeHtml(ev.link)}" target="_blank" rel="noopener noreferrer">Open venue / activity site</a></p>
            </div>
            <div class="detail-item">
              <h5>Who's going <span style="font-weight:400;color:var(--color-text-muted)">(${count} people)</span></h5>
              ${goingChips}
            </div>
          </div>
          <div class="family-card">
            <div>
              <div class="tiny">Your family</div>
              <h5>${escapeHtml(currentFamily.name)}</h5>
              <p class="family-status">${currentFamily.headcount} ${currentFamily.headcount === 1 ? 'person' : 'people'}</p>
            </div>
            <div class="segmented">
              <button type="button"
                class="${myAnswer === true ? 'active-yes' : ''}"
                onclick="rsvpClick('${ev.id}', true)">✓ Going</button>
              <button type="button"
                class="${myAnswer === false ? 'active-no' : ''}"
                onclick="rsvpClick('${ev.id}', false)">✕ Not going</button>
            </div>
            <p class="tiny">Only updates your family's RSVP.</p>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderSummary() {
  const myYes   = rsvps.filter(r => r.family_id === currentFamily.id && r.going);
  const dinners = myYes.filter(r => events.find(e => e.id === r.event_id && e.event_type === 'dinner')).length;
  const acts    = myYes.filter(r => events.find(e => e.id === r.event_id && e.event_type === 'activity')).length;

  document.getElementById('familySummary').innerHTML = `
    <div class="summary-card">
      <strong>${escapeHtml(currentFamily.name)}</strong>
      <span>${currentFamily.headcount} ${currentFamily.headcount === 1 ? 'person' : 'people'}</span>
    </div>
    <div class="summary-card">
      <strong>${myYes.length} confirmation${myYes.length !== 1 ? 's' : ''}</strong>
      <span>${dinners} dinner${dinners !== 1 ? 's' : ''} · ${acts} activit${acts !== 1 ? 'ies' : 'y'}</span>
    </div>
  `;
}

// ── Actions ───────────────────────────────────────────────────────────────────

async function rsvpClick(eventId, going) {
  // Optimistic UI: update local state immediately
  const existing = rsvps.find(r => r.event_id === eventId && r.family_id === currentFamily.id);
  if (existing) {
    existing.going = going;
  } else {
    rsvps.push({ event_id: eventId, family_id: currentFamily.id, going, families: { ...currentFamily } });
  }
  renderDays();
  renderSummary();

  try {
    await db.upsertRsvp(currentFamily.id, eventId, going);
  } catch (err) {
    showToast('Could not save RSVP: ' + err.message, 'error');
    // Revert on failure
    const idx = rsvps.findIndex(r => r.event_id === eventId && r.family_id === currentFamily.id);
    if (idx !== -1) rsvps[idx].going = !going;
    renderDays();
    renderSummary();
  }
}
window.rsvpClick = rsvpClick;

async function applyCount() {
  const val = Math.max(0, parseInt(document.getElementById('familyCountInput').value, 10) || 0);
  try {
    await db.updateFamilyHeadcount(currentFamily.id, val);
    currentFamily.headcount = val;
    updateFamilyHeader();
    // Also update any cached rsvp rows so headcount pills update before next subscription refresh
    rsvps.forEach(r => { if (r.families && r.family_id === currentFamily.id) r.families.headcount = val; });
    renderDays();
    renderSummary();
    showToast(`${currentFamily.name} updated to ${val} people.`, 'success');
  } catch (err) {
    showToast('Could not update headcount: ' + err.message, 'error');
  }
}

async function confirmAllDinners() {
  const dinnerIds = events.filter(e => e.event_type === 'dinner').map(e => e.id);
  try {
    await Promise.all(dinnerIds.map(id => db.upsertRsvp(currentFamily.id, id, true)));
    // Update local state
    dinnerIds.forEach(id => {
      const existing = rsvps.find(r => r.event_id === id && r.family_id === currentFamily.id);
      if (existing) { existing.going = true; }
      else { rsvps.push({ event_id: id, family_id: currentFamily.id, going: true, families: { ...currentFamily } }); }
    });
    renderDays();
    renderSummary();
    showToast(`${currentFamily.name} confirmed for all dinners.`, 'success');
  } catch (err) {
    showToast('Could not confirm all dinners: ' + err.message, 'error');
  }
}

async function copySummary() {
  const myYes = rsvps
    .filter(r => r.family_id === currentFamily.id && r.going)
    .map(r => events.find(e => e.id === r.event_id))
    .filter(Boolean)
    .sort((a, b) => a.sort_order - b.sort_order);

  const text = [
    `${currentFamily.name} · ${currentFamily.headcount} people`,
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

// Admin page: edit events, protected by a client-side password gate

let events = [];
let channel = null;

// ── Auth ──────────────────────────────────────────────────────────────────────

function checkAuth() {
  document.getElementById('authForm').addEventListener('submit', e => {
    e.preventDefault();
    const val = document.getElementById('passwordInput').value;
    if (val === ADMIN_PASSWORD) {
      document.getElementById('authOverlay').remove();
      initAdmin();
    } else {
      document.getElementById('authError').textContent = 'Incorrect password.';
      document.getElementById('passwordInput').value = '';
      document.getElementById('passwordInput').focus();
    }
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

async function initAdmin() {
  initThemeToggle();
  await loadEvents();

  channel = db.subscribeToChanges(['events'], async () => {
    events = await db.getEvents();
    renderEvents();
  });

  document.getElementById('addEventBtn').addEventListener('click', addEvent);
}

async function loadEvents() {
  try {
    events = await db.getEvents();
    renderEvents();
  } catch (err) {
    showToast('Failed to load events: ' + err.message, 'error');
  }
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderEvents() {
  const container = document.getElementById('eventsContainer');

  if (events.length === 0) {
    container.innerHTML = '<p class="empty-state">No events yet — add one below.</p>';
    return;
  }

  container.innerHTML = events.map(ev => `
    <div class="edit-card" id="card-${ev.id}">
      <div class="edit-card-head">
        <div class="edit-card-head-info">
          <h4>${escapeHtml(ev.title)}</h4>
          <div class="tiny">${escapeHtml(ev.day)} · ${escapeHtml(ev.date)} · ${escapeHtml(ev.area)}</div>
        </div>
        <div class="edit-card-actions">
          <button class="danger-btn" onclick="deleteEvent('${ev.id}', ${JSON.stringify(escapeHtml(ev.title))})">Delete</button>
        </div>
      </div>
      <div class="edit-card-body">
        <div class="field">
          <label>Day label</label>
          <input type="text" id="${ev.id}-day" value="${escapeHtml(ev.day)}" placeholder="Day 1" />
        </div>
        <div class="field">
          <label>Date</label>
          <input type="text" id="${ev.id}-date" value="${escapeHtml(ev.date)}" placeholder="July 5" />
        </div>
        <div class="field full">
          <label>Event title</label>
          <input type="text" id="${ev.id}-title" value="${escapeHtml(ev.title)}" />
        </div>
        <div class="field">
          <label>Area / location</label>
          <input type="text" id="${ev.id}-area" value="${escapeHtml(ev.area)}" />
        </div>
        <div class="field">
          <label>Venue / operator name</label>
          <input type="text" id="${ev.id}-restaurant" value="${escapeHtml(ev.restaurant)}" />
        </div>
        <div class="field">
          <label>Type</label>
          <select id="${ev.id}-event_type">
            <option value="dinner"   ${ev.event_type === 'dinner'   ? 'selected' : ''}>Dinner</option>
            <option value="activity" ${ev.event_type === 'activity' ? 'selected' : ''}>Activity</option>
          </select>
        </div>
        <div class="field">
          <label>Sort order</label>
          <input type="number" id="${ev.id}-sort_order" value="${ev.sort_order}" min="0" step="10" />
        </div>
        <div class="field full">
          <div class="checkbox-row">
            <input type="checkbox" id="${ev.id}-reserve" ${ev.reserve ? 'checked' : ''} />
            <label for="${ev.id}-reserve">Reservation required</label>
          </div>
        </div>
        <div class="field full">
          <label>Description</label>
          <textarea id="${ev.id}-description">${escapeHtml(ev.description)}</textarea>
        </div>
        <div class="field full">
          <label>Reservation note</label>
          <textarea id="${ev.id}-note">${escapeHtml(ev.note)}</textarea>
        </div>
        <div class="field full">
          <label>Link (URL)</label>
          <input type="url" id="${ev.id}-link" value="${escapeHtml(ev.link)}" placeholder="https://…" />
        </div>
      </div>
      <div class="edit-save-row">
        <button class="primary-btn" onclick="saveEvent('${ev.id}')">Save changes</button>
      </div>
    </div>
  `).join('');
}

// ── Actions ───────────────────────────────────────────────────────────────────

async function saveEvent(id) {
  const get = field => document.getElementById(`${id}-${field}`);
  const fields = {
    day:        get('day').value.trim(),
    date:       get('date').value.trim(),
    title:      get('title').value.trim(),
    area:       get('area').value.trim(),
    restaurant: get('restaurant').value.trim(),
    event_type: get('event_type').value,
    sort_order: parseInt(get('sort_order').value, 10) || 0,
    reserve:    get('reserve').checked,
    description:get('description').value.trim(),
    note:       get('note').value.trim(),
    link:       get('link').value.trim(),
  };

  if (!fields.title) { showToast('Title is required.', 'error'); return; }

  const btn = document.querySelector(`#card-${id} .primary-btn`);
  btn.disabled = true; btn.textContent = 'Saving…';

  try {
    const updated = await db.updateEvent(id, fields);
    const idx = events.findIndex(e => e.id === id);
    if (idx !== -1) events[idx] = updated;
    showToast(`"${updated.title}" saved.`, 'success');
  } catch (err) {
    showToast('Save failed: ' + err.message, 'error');
  } finally {
    btn.disabled = false; btn.textContent = 'Save changes';
  }
}
window.saveEvent = saveEvent;

async function deleteEvent(id, title) {
  if (!confirm(`Delete "${title}"? This also removes all RSVPs for this event. This cannot be undone.`)) return;
  try {
    await db.deleteEvent(id);
    events = events.filter(e => e.id !== id);
    document.getElementById(`card-${id}`)?.remove();
    showToast(`"${title}" deleted.`, 'success');
  } catch (err) {
    showToast('Delete failed: ' + err.message, 'error');
  }
}
window.deleteEvent = deleteEvent;

async function addEvent() {
  const maxOrder = events.reduce((m, e) => Math.max(m, e.sort_order), 0);
  const fields = {
    day: 'Day ?', date: 'July ?', title: 'New event',
    area: '', event_type: 'dinner', reserve: false,
    restaurant: '', description: '', note: '', link: '',
    sort_order: maxOrder + 10
  };
  try {
    const ev = await db.createEvent(fields);
    events.push(ev);
    renderEvents();
    // Scroll to new card
    setTimeout(() => document.getElementById(`card-${ev.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    showToast('New event added — fill in the details and save.', 'success');
  } catch (err) {
    showToast('Could not add event: ' + err.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  checkAuth();
});

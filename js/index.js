// Landing page: select or create an attendee

let attendees = [];

async function init() {
  initThemeToggle();
  initPageI18n(onLangChange);

  await loadAttendees();

  db.subscribeToChanges(['attendees'], async () => {
    attendees = await db.getAttendees();
    renderAttendees();
  });

  document.getElementById('newAttendeeForm').addEventListener('submit', handleCreate);
}

function onLangChange() {
  renderAttendees();
  const btn = document.getElementById('createBtn');
  if (btn && !btn.disabled) btn.textContent = I18n.t('btnJoinTrip');
}

function showMigrationNotice(detail) {
  const list = document.getElementById('attendeeList');
  list.innerHTML = `
    <div class="migration-notice" role="alert">
      <strong>${escapeHtml(I18n.t('migrationTitle'))}</strong><p style="margin-top:8px"><strong>Your database still has the families table only.</strong> Run these in Supabase SQL Editor, in order:</p><ol style="margin:8px 0 0 18px;line-height:1.6"><li><code>supabase/migrate-to-attendees.sql</code></li><li><code>supabase/party-size-rsvp.sql</code></li><li><code>supabase/add-activity-fields.sql</code> (optional)</li></ol>
      <p>${escapeHtml(I18n.t('migrationBody'))}</p>
      ${detail ? `<p style="margin-top:var(--space-2);color:var(--color-text-muted)">${escapeHtml(detail)}</p>` : ''}
    </div>
  `;
}

async function loadAttendees() {
  try {
    attendees = await db.getAttendees();
    renderAttendees();
  } catch (err) {
    showMigrationNotice(err.message || String(err));
    showToast(I18n.t('toastMigrate'), 'error');
  }
}

function groupAttendees(list) {
  const groups = new Map();
  list.forEach(a => {
    const key = a.family_group || I18n.t('otherGroup');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(a);
  });
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function renderAttendees() {
  const list = document.getElementById('attendeeList');

  if (attendees.length === 0) {
    list.innerHTML = `<p class="empty-state">${escapeHtml(I18n.t('emptyNoAttendees'))}</p>`;
    return;
  }

  const grouped = groupAttendees(attendees);
  list.innerHTML = grouped.map(([familyGroup, members]) => `
    <div class="attendee-group">
      <h3 class="attendee-group-title">${escapeHtml(familyGroup)}</h3>
      <div class="family-grid">
        ${members.map(a => `
          <button class="family-option" type="button" onclick="selectAttendee('${a.id}')">
            <div>
              <div class="family-option-name">${escapeHtml(a.full_name)}</div>
              <div class="family-option-meta">${a.type === 'child' ? I18n.t('typeChild') : I18n.t('typeAdult')} · ${I18n.t('partyCapShort', { max: a.max_party_size || 1 })}</div>
            </div>
            <span class="chip-sm">${escapeHtml(I18n.t('btnSelect'))}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function selectAttendee(id) {
  window.location.href = `rsvp.html?attendee=${encodeURIComponent(id)}`;
}
window.selectAttendee = selectAttendee;

async function handleCreate(e) {
  e.preventDefault();
  const nameInput   = document.getElementById('newAttendeeName');
  const familyInput = document.getElementById('newAttendeeFamily');
  const typeInput   = document.getElementById('newAttendeeType');
  const btn         = document.getElementById('createBtn');

  const fullName    = nameInput.value.trim();
  const familyGroup = familyInput.value.trim();
  const type        = typeInput.value === 'child' ? 'child' : 'adult';
  const cfg = window.ATTENDEE_CONFIG || { defaultMaxPartyAdult: 4, defaultMaxPartyChild: 1 };
  const maxInput    = document.getElementById('newAttendeeMaxParty');
  let maxParty = parseInt(maxInput?.value, 10);
  if (Number.isNaN(maxParty)) maxParty = type === 'child' ? cfg.defaultMaxPartyChild : cfg.defaultMaxPartyAdult;
  maxParty = Math.min(20, Math.max(1, maxParty));
  if (!fullName || !familyGroup) return;

  btn.disabled = true;
  btn.textContent = I18n.t('btnAdding');

  try {
    const attendee = await db.createAttendee(fullName, familyGroup, type, maxParty);
    window.location.href = `rsvp.html?attendee=${encodeURIComponent(attendee.id)}`;
  } catch (err) {
    showToast(I18n.t('toastAddAttendeeError') + ' ' + err.message, 'error');
    btn.disabled = false;
    btn.textContent = I18n.t('btnJoinTrip');
  }
}

document.addEventListener('DOMContentLoaded', init);

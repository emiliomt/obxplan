// Landing page: select or create an attendee

let attendees = [];

async function init() {
  initThemeToggle();
  await loadAttendees();

  db.subscribeToChanges(['attendees'], async () => {
    attendees = await db.getAttendees();
    renderAttendees();
  });

  document.getElementById('newAttendeeForm').addEventListener('submit', handleCreate);
}

async function loadAttendees() {
  try {
    attendees = await db.getAttendees();
    renderAttendees();
  } catch (err) {
    showToast('Could not load attendees. Run supabase/migrate-to-attendees.sql in Supabase first.', 'error');
  }
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

function renderAttendees() {
  const list = document.getElementById('attendeeList');

  if (attendees.length === 0) {
    list.innerHTML = '<p class="empty-state">No attendees yet — add yourself below after running the database migration.</p>';
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
              <div class="family-option-meta">${a.type === 'child' ? 'Child' : 'Adult'}</div>
            </div>
            <span class="chip-sm">Select →</span>
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
  if (!fullName || !familyGroup) return;

  btn.disabled = true;
  btn.textContent = 'Adding…';

  try {
    const attendee = await db.createAttendee(fullName, familyGroup, type);
    window.location.href = `rsvp.html?attendee=${encodeURIComponent(attendee.id)}`;
  } catch (err) {
    showToast('Could not add attendee: ' + err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Join trip →';
  }
}

document.addEventListener('DOMContentLoaded', init);

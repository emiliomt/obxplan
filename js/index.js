// Landing page: display families, let user select or create one

let families = [];

async function init() {
  initThemeToggle();
  await loadFamilies();

  db.subscribeToChanges(['families'], async () => {
    families = await db.getFamilies();
    renderFamilies();
  });

  document.getElementById('newFamilyForm').addEventListener('submit', handleCreate);
}

async function loadFamilies() {
  try {
    families = await db.getFamilies();
    renderFamilies();
  } catch (err) {
    showToast('Could not load families — check your Supabase config.', 'error');
  }
}

function renderFamilies() {
  const list = document.getElementById('familyList');

  if (families.length === 0) {
    list.innerHTML = '<p class="empty-state">No families yet — add yours below.</p>';
    return;
  }

  list.innerHTML = families.map(f => `
    <button class="family-option" onclick="selectFamily('${f.id}')">
      <div>
        <div class="family-option-name">${escapeHtml(f.name)}</div>
        <div class="family-option-meta">${f.headcount} ${f.headcount === 1 ? 'person' : 'people'}</div>
      </div>
      <span class="chip-sm">Select →</span>
    </button>
  `).join('');
}

function selectFamily(id) {
  window.location.href = `rsvp.html?family=${encodeURIComponent(id)}`;
}
window.selectFamily = selectFamily;

async function handleCreate(e) {
  e.preventDefault();
  const nameInput  = document.getElementById('newFamilyName');
  const countInput = document.getElementById('newFamilyCount');
  const btn        = document.getElementById('createBtn');

  const name      = nameInput.value.trim();
  const headcount = Math.max(0, parseInt(countInput.value, 10) || 1);
  if (!name) { nameInput.focus(); return; }

  btn.disabled = true;
  btn.textContent = 'Adding…';

  try {
    const family = await db.createFamily(name, headcount);
    window.location.href = `rsvp.html?family=${encodeURIComponent(family.id)}`;
  } catch (err) {
    if (err.code === '23505') {
      showToast('A family with that name already exists — select it from the list above.', 'error');
    } else {
      showToast('Could not create family: ' + err.message, 'error');
    }
    btn.disabled = false;
    btn.textContent = 'Join trip';
  }
}

document.addEventListener('DOMContentLoaded', init);

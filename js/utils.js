// Shared utilities used by all pages

function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast' + (type === 'error' ? ' toast-error' : type === 'success' ? ' toast-success' : '');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function initThemeToggle() {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
  });
}

function getFamilyFromUrl() {
  return new URLSearchParams(window.location.search).get('family');
}

// Typical non-rush drive times from Corolla (home base); summer traffic can add 15+ min.
const DRIVE_FROM_COROLLA_MINUTES = {
  'Kill Devil Hills': 40,
  'Nags Head / soundside': 50,
  'Nags Head': 50,
  "Jockey's Ridge": 50,
  'Alligator River': 55,
  'Manteo area': 55,
  'Frisco / Hatteras': 90,
  'Corolla': 0,
};

function driveTimeFromCorolla(area) {
  const minutes = DRIVE_FROM_COROLLA_MINUTES[area];
  if (minutes == null || minutes === 0) return '';
  return `~${minutes} min drive from Corolla.`;
}

function eventDescriptionText(ev) {
  const drive = driveTimeFromCorolla(ev.area);
  if (!drive) return ev.description || '';
  const base = (ev.description || '').trim();
  return base ? `${base} ${drive}` : drive;
}

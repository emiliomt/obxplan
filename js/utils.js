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
  applyBuildStamp();
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
  });
}

function getAttendeeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('attendee') || params.get('family');
}

function getFamilyFromUrl() {
  return getAttendeeFromUrl();
}

function initPageI18n(rerender) {
  applyBuildStamp();
  if (!window.I18n) return;
  I18n.initLanguageSwitcher();
  if (typeof rerender === 'function') {
    I18n.onLanguageChange(() => rerender());
  }
}


function applyBuildStamp() {
  document.querySelectorAll('[data-build-stamp]').forEach(el => {
    el.textContent = (window.APP_BUILD || '915cd56');
  });
}

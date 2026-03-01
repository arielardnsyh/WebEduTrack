/* =====================================================
   EduTrack – auth.js
   Shared authentication utilities & helpers
   Diimport oleh SEMUA halaman
   ===================================================== */

// ─── Storage Keys ────────────────────────────────────
var KEYS = {
  SESSION:   'edutrack_user',
  USERS:     'edutrack_users',
  MAHASISWA: 'edutrack_mahasiswa'
};

// ─── DOM Helpers ─────────────────────────────────────
function qs(selector)  { return document.querySelector(selector); }
function qsa(selector) { return document.querySelectorAll(selector); }

// ─── Alert System ────────────────────────────────────
function showAlert(containerId, message, type) {
  type = type || 'error';
  var icons = { error: '⚠️', success: '✅', info: 'ℹ️', warning: '🔔' };
  var container = typeof containerId === 'string'
    ? qs('#' + containerId)
    : containerId;
  if (!container) return;
  var el = document.createElement('div');
  el.className = 'alert alert-' + type;
  el.innerHTML = '<span>' + (icons[type] || 'ℹ️') + '</span><span>' + message + '</span>';
  container.innerHTML = '';
  container.appendChild(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearAlert(containerId) {
  var el = typeof containerId === 'string' ? qs('#' + containerId) : containerId;
  if (el) el.innerHTML = '';
}

// ─── Field Validation Styling ─────────────────────────
function markInvalid(selector) {
  var el = qs(selector);
  if (el) {
    el.style.borderColor = 'rgba(239,68,68,0.7)';
    el.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.15)';
  }
}

function markValid(selector) {
  var el = qs(selector);
  if (el) {
    el.style.borderColor = 'rgba(16,185,129,0.6)';
    el.style.boxShadow   = '0 0 0 3px rgba(16,185,129,0.12)';
  }
}

function clearFieldStyle(selector) {
  var el = qs(selector);
  if (el) { el.style.borderColor = ''; el.style.boxShadow = ''; }
}

// ─── HTML Escape ──────────────────────────────────────
function escapeHtml(str) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}

// ─── Session (logged-in user) ─────────────────────────
function getSession() {
  var raw = localStorage.getItem(KEYS.SESSION);
  return raw ? JSON.parse(raw) : null;
}

function setSession(data) {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(data));
}

function clearSession() {
  localStorage.removeItem(KEYS.SESSION);
}

// ─── Users Registry ───────────────────────────────────
function getUsers() {
  var raw = localStorage.getItem(KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}

function setUsers(arr) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(arr));
}

function isUsernameTaken(username) {
  return getUsers().some(function(u) {
    return u.username.toLowerCase() === username.toLowerCase();
  });
}

function isEmailTaken(email) {
  return getUsers().some(function(u) {
    return u.email.toLowerCase() === email.toLowerCase();
  });
}

// ─── Mahasiswa Data ───────────────────────────────────
function getMahasiswa() {
  var raw = localStorage.getItem(KEYS.MAHASISWA);
  return raw ? JSON.parse(raw) : [];
}

function setMahasiswa(data) {
  localStorage.setItem(KEYS.MAHASISWA, JSON.stringify(data));
}

// ─── Route Guards ─────────────────────────────────────
function requireLogin() {
  if (!getSession()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function redirectIfLoggedIn() {
  if (getSession()) {
    window.location.href = 'dashboard.html';
    return true;
  }
  return false;
}

// ─── Logout ───────────────────────────────────────────
function logout() {
  if (confirm('Apakah Anda yakin ingin keluar dari EduTrack?')) {
    clearSession();
    window.location.href = 'login.html';
  }
}

// ─── Sidebar / Navbar Init ────────────────────────────
function initSidebar() {
  var session = getSession();

  // Set nama user
  var nameEl   = qs('#user-name');
  var avatarEl = qs('#user-avatar');
  if (session) {
    if (nameEl)   nameEl.textContent   = session.nama || session.username;
    if (avatarEl) avatarEl.textContent = (session.nama || session.username).charAt(0).toUpperCase();
  }

  // Active nav item
  var page = window.location.pathname.split('/').pop() || 'index.html';
  qsa('.nav-item[data-page]').forEach(function(item) {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === page) item.classList.add('active');
  });

  // Mahasiswa count badge
  updateMahasiswaBadge();

  // Mobile toggle
  var toggleBtn = qs('#mobile-menu-btn');
  var sidebar   = qs('#sidebar');
  var overlay   = qs('#sidebar-overlay');
  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }
}

function updateMahasiswaBadge() {
  var badge = qs('#mahasiswa-count');
  if (badge) {
    var count = getMahasiswa().length;
    badge.textContent    = count;
    badge.style.display  = count > 0 ? 'inline' : 'none';
  }
}

// ─── Toggle Password Visibility ───────────────────────
function initTogglePassword() {
  qsa('.toggle-password').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetId = btn.getAttribute('data-target');
      var input    = document.getElementById(targetId);
      if (!input) return;
      if (input.type === 'password') {
        input.type      = 'text';
        btn.textContent = '🙈';
      } else {
        input.type      = 'password';
        btn.textContent = '👁';
      }
    });
  });
}

// ─── Set Loading State on Button ─────────────────────
function setLoading(btnTextId, btnLoaderId, isLoading) {
  var t = qs('#' + btnTextId);
  var l = qs('#' + btnLoaderId);
  if (t) t.style.display = isLoading ? 'none'   : 'inline';
  if (l) l.style.display = isLoading ? 'inline' : 'none';
}

// Make globals available
window.KEYS              = KEYS;
window.qs                = qs;
window.qsa               = qsa;
window.showAlert         = showAlert;
window.clearAlert        = clearAlert;
window.markInvalid       = markInvalid;
window.markValid         = markValid;
window.clearFieldStyle   = clearFieldStyle;
window.escapeHtml        = escapeHtml;
window.getSession        = getSession;
window.setSession        = setSession;
window.clearSession      = clearSession;
window.getUsers          = getUsers;
window.setUsers          = setUsers;
window.isUsernameTaken   = isUsernameTaken;
window.isEmailTaken      = isEmailTaken;
window.getMahasiswa      = getMahasiswa;
window.setMahasiswa      = setMahasiswa;
window.requireLogin      = requireLogin;
window.redirectIfLoggedIn= redirectIfLoggedIn;
window.logout            = logout;
window.initSidebar       = initSidebar;
window.updateMahasiswaBadge = updateMahasiswaBadge;
window.initTogglePassword= initTogglePassword;
window.setLoading        = setLoading;

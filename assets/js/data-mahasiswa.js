
document.addEventListener('DOMContentLoaded', function () {

  // ─── Proteksi halaman ─────────────────────────────────
  if (!requireLogin()) return;

  // ─── Init sidebar ─────────────────────────────────────
  initSidebar();

  // ─── Render tabel pertama kali ────────────────────────
  renderTable('');

  // ─── Search real-time ─────────────────────────────────
  var searchInput = qs('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      renderTable(this.value.toLowerCase().trim());
    });
  }

});

// ─── Render Tabel ──────────────────────────────────────
function renderTable(query) {
  var tbody        = qs('#mahasiswa-tbody');
  var totalCountEl = qs('#total-count');
  var tableWrapper = qs('#table-wrapper');
  var emptyState   = qs('#empty-state');

  if (!tbody) return;

  var data = getMahasiswa();

  // Filter by search query
  if (query) {
    data = data.filter(function (m) {
      return (
        m.nim.toLowerCase().includes(query)      ||
        m.nama.toLowerCase().includes(query)     ||
        m.prodi.toLowerCase().includes(query)    ||
        m.angkatan.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query)
      );
    });
  }

  if (totalCountEl) totalCountEl.textContent = data.length;

  if (data.length === 0) {
    if (tableWrapper) tableWrapper.style.display = 'none';
    if (emptyState)   emptyState.style.display   = 'block';
    return;
  }

  if (tableWrapper) tableWrapper.style.display = 'block';
  if (emptyState)   emptyState.style.display   = 'none';

  tbody.innerHTML = data.map(function (m, idx) {
    return '<tr>' +
      '<td class="table-row-num">' + (idx + 1) + '</td>' +
      '<td><span class="table-nim">'       + escapeHtml(m.nim)      + '</span></td>' +
      '<td class="table-name">'            + escapeHtml(m.nama)     + '</td>' +
      '<td><span class="prodi-badge">'     + escapeHtml(m.prodi)    + '</span></td>' +
      '<td><span class="angkatan-chip">'   + escapeHtml(m.angkatan) + '</span></td>' +
      '<td class="td-email">'              + escapeHtml(m.email)    + '</td>' +
      '<td><div class="table-actions">' +
        '<button class="btn btn-danger" onclick="hapusMahasiswa(' + m.id + ')">🗑 Hapus</button>' +
      '</div></td>' +
      '</tr>';
  }).join('');
}

// ─── Hapus Mahasiswa ────────────────────────────────────
function hapusMahasiswa(id) {
  var data   = getMahasiswa();
  var target = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) { target = data[i]; break; }
  }
  if (!target) return;

  if (!confirm('Hapus mahasiswa "' + target.nama + '" (NIM: ' + target.nim + ')?\n\nTindakan ini tidak dapat dibatalkan.')) return;

  var updated = data.filter(function (m) { return m.id !== id; });
  setMahasiswa(updated);
  updateMahasiswaBadge();

  var sq = qs('#search-input') ? qs('#search-input').value.toLowerCase().trim() : '';
  renderTable(sq);

  var alertArea = qs('#delete-alert');
  if (alertArea) showAlert(alertArea, 'Data mahasiswa "' + target.nama + '" berhasil dihapus.', 'success');
}

// Expose globals
window.hapusMahasiswa = hapusMahasiswa;
window.logout = logout;

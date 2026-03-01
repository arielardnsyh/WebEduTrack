

document.addEventListener('DOMContentLoaded', function () {

  // ─── Proteksi halaman ─────────────────────────────────
  if (!requireLogin()) return;

  // ─── Init sidebar & navbar ────────────────────────────
  initSidebar();

  // ─── Tampilkan nama user ──────────────────────────────
  var session    = getSession();
  var welcomeEl  = qs('#welcome-name');
  if (welcomeEl && session) {
    welcomeEl.textContent = session.nama || session.username;
  }

  // ─── Ambil data ───────────────────────────────────────
  var mahasiswaData = getMahasiswa();
  var users         = getUsers();

  // ─── Isi statistik cards ──────────────────────────────
  var statMhs      = qs('#stat-total-mahasiswa');
  var statProdi    = qs('#stat-prodi');
  var statAngkatan = qs('#stat-angkatan');
  var statUsers    = qs('#stat-users');

  if (statMhs)      statMhs.textContent      = mahasiswaData.length;
  if (statProdi)    statProdi.textContent    = countUnique(mahasiswaData, 'prodi');
  if (statAngkatan) statAngkatan.textContent = countUnique(mahasiswaData, 'angkatan');
  if (statUsers)    statUsers.textContent    = users.length;

  function countUnique(arr, key) {
    var seen = {};
    arr.forEach(function (item) { seen[item[key]] = true; });
    return Object.keys(seen).length;
  }

  // ─── Tabel mahasiswa terbaru (3 terakhir) ─────────────
  var recentTbody = qs('#recent-tbody');
  if (recentTbody) {
    var recent = mahasiswaData.slice(-3).reverse();

    if (recent.length === 0) {
      recentTbody.innerHTML =
        '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:32px 20px;">' +
        'Belum ada data mahasiswa terdaftar</td></tr>';
    } else {
      recentTbody.innerHTML = recent.map(function (m) {
        return '<tr>' +
          '<td><span class="table-nim">' + escapeHtml(m.nim)  + '</span></td>' +
          '<td class="table-name">'       + escapeHtml(m.nama) + '</td>' +
          '<td><span class="prodi-badge">'    + escapeHtml(m.prodi)    + '</span></td>' +
          '<td><span class="angkatan-chip">'  + escapeHtml(m.angkatan) + '</span></td>' +
          '</tr>';
      }).join('');
    }
  }

});

// Expose logout globally (used in onclick attribute)
window.logout = logout;

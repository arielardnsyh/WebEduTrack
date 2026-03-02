
document.addEventListener('DOMContentLoaded', function () {

  // ─── Proteksi halaman ─────────────────────────────────
  if (!requireLogin()) return;

  // ─── Init sidebar ─────────────────────────────────────
  initSidebar();

  var form           = qs('#tambah-form');
  var alertContainer = qs('#alert-container');

  if (!form) return;

  // ─── Clear validation on input ────────────────────────
  qsa('.form-control').forEach(function (input) {
    input.addEventListener('input', function () {
      input.style.borderColor = '';
      input.style.boxShadow   = '';
    });
  });

  // ─── Form submit ──────────────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAlert(alertContainer);

    var nim      = qs('#nim').value.trim();
    var nama     = qs('#nama').value.trim();
    var prodi    = qs('#prodi').value.trim();
    var angkatan = qs('#angkatan').value.trim();
    var email    = qs('#email').value.trim();

    // ─── Validasi ─────────────────────────────────────────
    var firstError = null;
    function setErr(msg, sel) {
      if (!firstError) firstError = { msg: msg, sel: sel };
      markInvalid(sel);
    }

    // NIM
    if (!nim)
      setErr('NIM wajib diisi', '#nim');
    else if (!/^\d+$/.test(nim))
      setErr('NIM harus berupa angka', '#nim');
    else if (nim.length < 8)
      setErr('NIM minimal 8 digit', '#nim');
    else if (getMahasiswa().some(function (m) { return m.nim === nim; }))
      setErr('NIM ' + nim + ' sudah terdaftar', '#nim');

    // Nama
    if (!nama)           setErr('Nama wajib diisi', '#nama');
    else if (nama.length < 3) setErr('Nama minimal 3 karakter', '#nama');

    // Prodi
    if (!prodi) setErr('Program Studi wajib dipilih', '#prodi');

    // Angkatan
    var tahunSekarang = new Date().getFullYear();
    if (!angkatan)
      setErr('Angkatan wajib diisi', '#angkatan');
    else if (!/^\d+$/.test(angkatan))
      setErr('Angkatan harus berupa angka', '#angkatan');
    else if (parseInt(angkatan) < 2000 || parseInt(angkatan) > tahunSekarang)
      setErr('Angkatan tidak valid (2000 – ' + tahunSekarang + ')', '#angkatan');

    // Email
    if (!email)
      setErr('Email wajib diisi', '#email');
    else if (!email.includes('@'))
      setErr('Email harus mengandung karakter "@"', '#email');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      setErr('Format email tidak valid', '#email');

    // Jika ada error
    if (firstError) {
      showAlert(alertContainer, firstError.msg, 'error');
      var errEl = qs(firstError.sel);
      if (errEl) errEl.focus();
      return;
    }

    // ─── Simpan data ──────────────────────────────────────
    var newMahasiswa = {
      id:        Date.now(),
      nim:       nim,
      nama:      nama,
      prodi:     prodi,
      angkatan:  angkatan,
      email:     email,
      createdAt: new Date().toISOString()
    };

    var existing = getMahasiswa();
    existing.push(newMahasiswa);
    setMahasiswa(existing);

    // Reset invalid styling
    qsa('.form-control').forEach(function (el) {
      el.style.borderColor = '';
      el.style.boxShadow   = '';
    });

    showAlert(alertContainer, 'Mahasiswa "' + nama + '" berhasil ditambahkan!', 'success');

    setTimeout(function () {
      window.location.href = 'data-mahasiswa.html';
    }, 1200);
  });

});

// Expose logout globally
window.logout = logout;

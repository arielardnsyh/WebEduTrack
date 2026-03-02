
document.addEventListener('DOMContentLoaded', function () {

  // Jika sudah login, langsung ke dashboard
  redirectIfLoggedIn();

  var form           = qs('#login-form');
  var alertContainer = qs('#alert-container');

  if (!form) return;

  // ─── Clear validation style on input ─────────────────
  ['#username', '#password'].forEach(function (sel) {
    var el = qs(sel);
    if (el) el.addEventListener('input', function () { clearFieldStyle(sel); clearAlert(alertContainer); });
  });

  // ─── Toggle password visibility ───────────────────────
  initTogglePassword();

  // ─── Form submit ──────────────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAlert(alertContainer);

    var username = qs('#username').value.trim();
    var password = qs('#password').value;

    // Validasi tidak kosong
    if (!username) {
      showAlert(alertContainer, 'Username tidak boleh kosong!', 'error');
      markInvalid('#username');
      qs('#username').focus();
      return;
    }
    if (!password) {
      showAlert(alertContainer, 'Password tidak boleh kosong!', 'error');
      markInvalid('#password');
      qs('#password').focus();
      return;
    }

    // Cek apakah ada user terdaftar
    var users = getUsers();
    if (users.length === 0) {
      showAlert(alertContainer, 'Belum ada akun terdaftar. Silakan register terlebih dahulu.', 'warning');
      return;
    }

    // Loading state
    setLoading('btn-text', 'btn-loader', true);

    setTimeout(function () {
      // Cari user yang cocok
      var matched = null;
      for (var i = 0; i < users.length; i++) {
        if (
          users[i].username.toLowerCase() === username.toLowerCase() &&
          users[i].password === password
        ) {
          matched = users[i];
          break;
        }
      }

      if (!matched) {
        setLoading('btn-text', 'btn-loader', false);
        showAlert(alertContainer, 'Username atau password salah. Periksa kembali kredensial Anda.', 'error');
        markInvalid('#username');
        markInvalid('#password');
        return;
      }

      // Login sukses — simpan sesi
      setSession({
        id:        matched.id,
        nama:      matched.nama,
        username:  matched.username,
        email:     matched.email,
        loginTime: new Date().toISOString()
      });

      markValid('#username');
      markValid('#password');
      showAlert(alertContainer, 'Selamat datang, ' + matched.nama + '! Mengalihkan ke dashboard...', 'success');

      setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 1200);
    }, 700);
  });

});

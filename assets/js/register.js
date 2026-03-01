
document.addEventListener('DOMContentLoaded', function () {

  // Jika sudah login, langsung ke dashboard
  redirectIfLoggedIn();

  var form           = qs('#register-form');
  var alertContainer = qs('#alert-container');

  if (!form) return;

  // ─── Clear style on input ─────────────────────────────
  ['#nama', '#username', '#email', '#password', '#confirm-password'].forEach(function (sel) {
    var el = qs(sel);
    if (el) el.addEventListener('input', function () { clearFieldStyle(sel); });
  });

  // ─── Toggle password visibility ───────────────────────
  initTogglePassword();

  // ─── Password Strength Meter ──────────────────────────
  var passwordInput = qs('#password');
  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      updateStrengthMeter(passwordInput.value);
      // Re-check match if confirm has value
      var confirm = qs('#confirm-password');
      if (confirm && confirm.value) checkPasswordMatch();
    });
  }

  function updateStrengthMeter(val) {
    var container = qs('#strength-container');
    var fill      = qs('#strength-fill');
    var label     = qs('#strength-label');

    if (!val) {
      if (container) container.style.display = 'none';
      return;
    }
    if (container) container.style.display = 'flex';

    var score = 0;
    if (val.length >= 6)           score++;
    if (val.length >= 10)          score++;
    if (/[A-Z]/.test(val))         score++;
    if (/[0-9]/.test(val))         score++;
    if (/[^A-Za-z0-9]/.test(val))  score++;

    var levels = [
      { label: 'Sangat Lemah', color: '#ef4444', width: '20%' },
      { label: 'Lemah',        color: '#f97316', width: '40%' },
      { label: 'Cukup',        color: '#eab308', width: '60%' },
      { label: 'Kuat',         color: '#22c55e', width: '80%' },
      { label: 'Sangat Kuat',  color: '#10b981', width: '100%' }
    ];
    var idx = Math.max(0, Math.min(score - 1, 4));
    var lvl = levels[idx];

    if (fill)  { fill.style.width = lvl.width; fill.style.backgroundColor = lvl.color; }
    if (label) { label.textContent = lvl.label; label.style.color = lvl.color; }
  }

  // ─── Password Match Indicator ─────────────────────────
  var confirmInput = qs('#confirm-password');
  if (confirmInput) {
    confirmInput.addEventListener('input', checkPasswordMatch);
  }

  function checkPasswordMatch() {
    var indicator = qs('#match-indicator');
    var pw        = qs('#password');
    var cpw       = qs('#confirm-password');
    if (!indicator || !pw || !cpw) return;
    if (!cpw.value) { indicator.innerHTML = ''; return; }

    if (pw.value === cpw.value) {
      indicator.innerHTML = '<span style="color:#10b981;font-size:12px;">✅ Password cocok</span>';
      markValid('#confirm-password');
    } else {
      indicator.innerHTML = '<span style="color:#ef4444;font-size:12px;">❌ Password tidak cocok</span>';
      markInvalid('#confirm-password');
    }
  }

  // ─── Form submit ──────────────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAlert(alertContainer);

    var nama            = qs('#nama').value.trim();
    var username        = qs('#username').value.trim();
    var email           = qs('#email').value.trim();
    var password        = qs('#password').value;
    var confirmPassword = qs('#confirm-password').value;

    // ─── Validasi ────────────────────────────────────────
    var firstError = null;
    function setErr(msg, sel) {
      if (!firstError) firstError = { msg: msg, sel: sel };
      markInvalid(sel);
    }

    // Nama
    if (!nama)             setErr('Nama lengkap wajib diisi', '#nama');
    else if (nama.length < 3) setErr('Nama minimal 3 karakter', '#nama');

    // Username
    if (!username)              setErr('Username wajib diisi', '#username');
    else if (username.length < 4) setErr('Username minimal 4 karakter', '#username');
    else if (/\s/.test(username)) setErr('Username tidak boleh mengandung spasi', '#username');
    else if (isUsernameTaken(username)) setErr('Username "' + username + '" sudah digunakan', '#username');

    // Email
    if (!email)                          setErr('Email wajib diisi', '#email');
    else if (!email.includes('@'))       setErr('Email harus mengandung karakter "@"', '#email');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setErr('Format email tidak valid', '#email');
    else if (isEmailTaken(email))        setErr('Email ini sudah terdaftar, gunakan email lain', '#email');

    // Password
    if (!password)              setErr('Password wajib diisi', '#password');
    else if (password.length < 6) setErr('Password minimal 6 karakter', '#password');

    // Konfirmasi Password
    if (!confirmPassword)          setErr('Konfirmasi password wajib diisi', '#confirm-password');
    else if (password && password !== confirmPassword)
      setErr('Password dan konfirmasi password tidak sama', '#confirm-password');

    if (firstError) {
      showAlert(alertContainer, firstError.msg, 'error');
      var errEl = qs(firstError.sel);
      if (errEl) errEl.focus();
      return;
    }

    // ─── Loading state ────────────────────────────────────
    setLoading('btn-text', 'btn-loader', true);

    setTimeout(function () {
      // Simpan user baru ke localStorage
      var newUser = {
        id:           Date.now(),
        nama:         nama,
        username:     username,
        email:        email,
        password:     password,    // plain text — demo only
        registeredAt: new Date().toISOString()
      };

      var users = getUsers();
      users.push(newUser);
      setUsers(users);

      // Mark semua field valid
      ['#nama', '#username', '#email', '#password', '#confirm-password'].forEach(markValid);
      showAlert(alertContainer, 'Akun "' + username + '" berhasil dibuat! Mengalihkan ke halaman login...', 'success');

      setTimeout(function () {
        window.location.href = 'login.html';
      }, 1500);
    }, 700);
  });

});

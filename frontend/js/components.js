// ── Toast ────────────────────────────────────────────
function showToast(msg, type = 'success') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = `show ${type}`;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}

// ── Time ago ─────────────────────────────────────────
function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

// ── Avatar initials ───────────────────────────────────
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ── Score color ───────────────────────────────────────
function scoreColor(n) {
  if (n >= 80) return 'var(--accent)';
  if (n >= 60) return 'var(--amber)';
  return 'var(--red)';
}

// ── App shell (sidebar + header) ─────────────────────
function renderShell(container, title, pageContent) {
  const u = auth.user;
  const isTeacher = u.role === 'teacher';

  const studentNav = `
    <div class="nav-section">
      <div class="nav-section-title">Learning</div>
      <div class="nav-item ${router.current === 'dashboard' ? 'active' : ''}" onclick="router.go('dashboard')">
        <span class="nav-icon">🏠</span> Dashboard
      </div>
      <div class="nav-item ${router.current === 'quizzes' ? 'active' : ''}" onclick="router.go('quizzes')">
        <span class="nav-icon">📝</span> Quizzes
      </div>
      <div class="nav-item ${router.current === 'materials' ? 'active' : ''}" onclick="router.go('materials')">
        <span class="nav-icon">📚</span> Materials
      </div>
    </div>
    <div class="nav-section">
      <div class="nav-section-title">Account</div>
      <div class="nav-item ${router.current === 'profile' ? 'active' : ''}" onclick="router.go('profile')">
        <span class="nav-icon">👤</span> Profile
      </div>
    </div>
  `;

  const teacherNav = `
    <div class="nav-section">
      <div class="nav-section-title">Manage</div>
      <div class="nav-item ${router.current === 'dashboard' ? 'active' : ''}" onclick="router.go('dashboard')">
        <span class="nav-icon">📊</span> Overview
      </div>
      <div class="nav-item ${router.current === 'students' ? 'active' : ''}" onclick="router.go('students')">
        <span class="nav-icon">👥</span> Students
      </div>
      <div class="nav-item ${router.current === 'materials' ? 'active' : ''}" onclick="router.go('materials')">
        <span class="nav-icon">📚</span> Materials
      </div>
    </div>
    <div class="nav-section">
      <div class="nav-section-title">Account</div>
      <div class="nav-item ${router.current === 'profile' ? 'active' : ''}" onclick="router.go('profile')">
        <span class="nav-icon">👤</span> Profile
      </div>
    </div>
  `;

  container.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <div class="logo-icon">🎓</div>
            <span>Smart<b>-ED</b></span>
          </div>
        </div>
        <nav class="sidebar-nav">
          ${isTeacher ? teacherNav : studentNav}
        </nav>
        <div class="sidebar-footer">
          <div class="user-pill">
            <div class="avatar">${initials(u.name)}</div>
            <div class="user-pill-info">
              <div class="user-pill-name">${u.name}</div>
              <div class="user-pill-role">${u.role}</div>
            </div>
            <button class="logout-btn" onclick="auth.logout()" title="Logout">⇥</button>
          </div>
        </div>
      </aside>
      <div class="main-content">
        <header class="main-header">
          <h1>${title}</h1>
          <div class="header-actions" id="header-actions"></div>
        </header>
        <div class="page-body" id="page-body">
          <div class="loading"><div class="spinner"></div> Loading…</div>
        </div>
      </div>
    </div>
  `;

  // inject page
  setTimeout(() => {
    const body = document.getElementById('page-body');
    if (body) body.innerHTML = pageContent;
  }, 0);
}

const dashboard = {
  async render(container) {
    renderShell(container, 'Dashboard', '<div class="loading"><div class="spinner"></div> Loading…</div>');
    try {
      const data = await api.get('/dashboard');
      const body = document.getElementById('page-body');
      if (auth.user.role === 'teacher') {
        body.innerHTML = this.teacherView(data);
      } else {
        body.innerHTML = this.studentView(data);
        setTimeout(() => this.animateBars(), 100);
      }
    } catch (e) {
      document.getElementById('page-body').innerHTML = `<div class="empty">❌ Failed to load: ${e.message}</div>`;
    }
  },

  studentView(d) {
    const progressRows = d.progress.map(p => `
      <div class="progress-row">
        <div class="progress-meta">
          <span class="progress-name">${p.subject.icon} ${p.subject.name}</span>
          <span class="progress-pct">${p.pct}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" data-w="${p.pct}" style="width:0%;background:${p.subject.color}"></div>
        </div>
      </div>
    `).join('');

    const tagMap = { weak: 'tag-weak', strong: 'tag-strong', due: 'tag-due' };
    const tagLabel = { weak: 'Weak area', strong: 'Strong', due: 'Due soon' };
    const recCards = d.recommended.map(q => `
      <div class="quiz-card-item" onclick="router.go('quizPlay', {id: ${q.id}})">
        <div class="qc-header">
          <div class="qc-icon" style="background:${q.subjectId === 1 ? '#132236' : q.subjectId === 2 ? '#1a1635' : '#0d2318'}">
            ${['📐','⚡','⚗️','📖','💻'][q.subjectId - 1] || '📝'}
          </div>
          <span class="tag ${tagMap[q.tag] || 'tag-due'}">${tagLabel[q.tag] || q.tag}</span>
        </div>
        <div class="qc-title">${q.title}</div>
        <div class="qc-sub">${q.questionCount || q.questions?.length || 5} questions</div>
        <div class="qc-meta">
          <span>⏱ ${q.duration} min</span>
          <span class="tag tag-${q.difficulty}">${q.difficulty}</span>
        </div>
      </div>
    `).join('');

    const acts = d.activity.map(a => `
      <div class="act-item">
        <div class="act-dot" style="background:var(--accent)"></div>
        <div>
          <div class="act-text">${a.text}</div>
          <div class="act-time">${timeAgo(a.ts)}</div>
        </div>
      </div>
    `).join('') || '<div class="empty" style="padding:1rem;font-size:13px;">No activity yet</div>';

    const anns = d.announcements.map(a => `
      <div class="ann-item">
        <div class="ann-title">📢 ${a.title}</div>
        <div class="ann-body">${a.body}</div>
        <div class="ann-date">${a.createdAt}</div>
      </div>
    `).join('') || '<div class="empty" style="padding:1rem;font-size:13px;">No announcements</div>';

    return `
      <div class="hero-banner">
        <h2>Hey, <span>${d.user.name.split(' ')[0]}</span> 👋</h2>
        <p>You're on a ${d.user.streak}-day learning streak. Keep going!</p>
        <div class="hero-stats">
          <div class="hs-item"><div class="hs-num">${d.user.streak}</div><div class="hs-label">Day streak</div></div>
          <div class="hs-item"><div class="hs-num">${d.avgScore}%</div><div class="hs-label">Avg. score</div></div>
          <div class="hs-item"><div class="hs-num">${d.totalQuizzes}</div><div class="hs-label">Quizzes done</div></div>
          <div class="hs-item"><div class="hs-num">Lv.${d.user.level}</div><div class="hs-label">${d.user.xp} XP</div></div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">Subject Progress</div>
          ${progressRows}
        </div>
        <div class="card">
          <div class="card-title">Recent Activity</div>
          ${acts}
        </div>
      </div>

      <div class="card-title" style="margin-bottom:.75rem">🤖 AI Recommended for You</div>
      <div class="grid-3" style="margin-bottom:1.25rem">${recCards}</div>

      <div class="card">
        <div class="card-title">📢 Announcements</div>
        ${anns}
      </div>
    `;
  },

  teacherView(d) {
    const subjCards = d.subjectStats.map(s => `
      <div class="card stat-card">
        <div class="s-label">${s.subject.icon} ${s.subject.name}</div>
        <div class="s-num" style="color:${s.subject.color}">${s.avgScore}%</div>
        <div class="s-trend" style="color:var(--text2)">${s.studentCount} student${s.studentCount !== 1 ? 's' : ''}</div>
      </div>
    `).join('');

    const anns = d.announcements.map(a => `
      <div class="ann-item">
        <div class="ann-title">📢 ${a.title}</div>
        <div class="ann-body">${a.body}</div>
        <div class="ann-date">${a.createdAt}</div>
      </div>
    `).join('');

    return `
      <div class="hero-banner">
        <h2>Teacher Dashboard 👩‍🏫</h2>
        <p>Monitor student performance and manage your classroom.</p>
        <div class="hero-stats">
          <div class="hs-item"><div class="hs-num">${d.totalStudents}</div><div class="hs-label">Students</div></div>
          <div class="hs-item"><div class="hs-num">${d.totalQuizzes}</div><div class="hs-label">Quizzes taken</div></div>
          <div class="hs-item"><div class="hs-num">${d.announcements.length}</div><div class="hs-label">Announcements</div></div>
        </div>
      </div>

      <div class="card-title" style="margin-bottom:.75rem">Subject Averages</div>
      <div class="grid-${Math.min(d.subjectStats.length, 4)}" style="margin-bottom:1.25rem">${subjCards}</div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">📢 Announcements</div>
          ${anns || '<div class="empty" style="padding:1rem;font-size:13px">None yet</div>'}
          <div class="ann-form">
            <input id="ann-title" type="text" placeholder="Announcement title…" />
            <textarea id="ann-body" placeholder="Message body…"></textarea>
            <button class="btn-sm" onclick="dashboard.postAnnouncement()">Post Announcement</button>
          </div>
        </div>
        <div class="card">
          <div class="card-title">👥 Students</div>
          <button class="btn-sm" onclick="router.go('students')" style="margin-bottom:.75rem">View all students →</button>
          <div style="font-size:13px;color:var(--text2);line-height:1.8">
            Track individual performance, view quiz results, and identify students who need extra help.
          </div>
        </div>
      </div>
    `;
  },

  async postAnnouncement() {
    const title = document.getElementById('ann-title')?.value.trim();
    const body = document.getElementById('ann-body')?.value.trim();
    if (!title || !body) return showToast('Fill in both fields', 'error');
    try {
      await api.post('/announcements', { title, body });
      showToast('Announcement posted!');
      router.go('dashboard');
    } catch (e) { showToast(e.message, 'error'); }
  },

  animateBars() {
    document.querySelectorAll('.progress-fill[data-w]').forEach(el => {
      setTimeout(() => el.style.width = el.dataset.w + '%', 100);
    });
  }
};

const profile = {
  async render(container) {
    renderShell(container, 'My Profile', '<div class="loading"><div class="spinner"></div> Loading…</div>');
    try {
      const data = await api.get('/profile');
      const u = data.user;
      const results = data.quizResults || [];
      const activity = data.activity || [];

      const xpToNext = 500 - (u.xp % 500);
      const xpPct = Math.round(((u.xp % 500) / 500) * 100);

      const resultsHtml = results.slice(0, 8).map(r => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:.6rem 0;border-bottom:1px solid var(--border)">
          <div style="font-size:13px">Quiz #${r.quizId}</div>
          <div style="display:flex;align-items:center;gap:.75rem">
            <span style="font-size:11px;color:var(--text2)">${r.correct}/${r.total} correct</span>
            <span class="score-badge" style="background:${r.score>=80?'rgba(46,160,67,.12)':r.score>=60?'rgba(227,179,65,.12)':'rgba(248,81,73,.12)'};color:${scoreColor(r.score)}">
              ${r.score}%
            </span>
          </div>
        </div>
      `).join('') || '<div style="font-size:13px;color:var(--text2);padding:.75rem 0">No quizzes taken yet.</div>';

      const actHtml = activity.slice(0, 6).map(a => `
        <div class="act-item">
          <div class="act-dot" style="background:var(--accent)"></div>
          <div>
            <div class="act-text">${a.text}</div>
            <div class="act-time">${timeAgo(a.ts)}</div>
          </div>
        </div>
      `).join('') || '<div style="font-size:13px;color:var(--text2)">No activity yet.</div>';

      document.getElementById('page-body').innerHTML = `
        <div class="grid-2" style="margin-bottom:1.25rem">
          <div class="card">
            <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem">
              <div class="avatar" style="width:56px;height:56px;font-size:18px;border-radius:14px">${initials(u.name)}</div>
              <div>
                <div style="font-size:18px;font-weight:700">${u.name}</div>
                <div style="font-size:12px;color:var(--text2);margin-top:2px">${u.email}</div>
                <div style="margin-top:6px"><span class="chip chip-blue">${u.role}</span></div>
              </div>
            </div>

            ${u.role === 'student' ? `
              <div style="margin-bottom:1rem">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px">
                  <span style="color:var(--text2)">Level ${u.level} → ${u.level + 1}</span>
                  <span style="font-family:'DM Mono',monospace;color:var(--text2)">${u.xp % 500} / 500 XP</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${xpPct}%;background:var(--accent2)"></div>
                </div>
                <div style="font-size:11px;color:var(--text3);margin-top:4px">${xpToNext} XP to next level</div>
              </div>

              <div class="grid-3" style="margin-bottom:0">
                <div style="text-align:center">
                  <div style="font-family:'DM Mono',monospace;font-size:22px;color:var(--accent)">Lv.${u.level}</div>
                  <div style="font-size:11px;color:var(--text2);margin-top:2px">Level</div>
                </div>
                <div style="text-align:center">
                  <div style="font-family:'DM Mono',monospace;font-size:22px;color:var(--amber)">🔥${u.streak}</div>
                  <div style="font-size:11px;color:var(--text2);margin-top:2px">Day Streak</div>
                </div>
                <div style="text-align:center">
                  <div style="font-family:'DM Mono',monospace;font-size:22px;color:var(--accent2)">${u.xp}</div>
                  <div style="font-size:11px;color:var(--text2);margin-top:2px">Total XP</div>
                </div>
              </div>
            ` : `
              <div style="color:var(--text2);font-size:13px">Member since ${u.joinedAt}</div>
            `}
          </div>

          <div class="card">
            <div class="card-title">Recent Activity</div>
            ${actHtml}
          </div>
        </div>

        ${u.role === 'student' ? `
          <div class="card">
            <div class="card-title">Quiz History (${results.length} total)</div>
            ${resultsHtml}
            ${results.length > 8 ? `<div style="font-size:12px;color:var(--text2);margin-top:.75rem">Showing last 8 results</div>` : ''}
          </div>
        ` : ''}
      `;
    } catch (e) {
      document.getElementById('page-body').innerHTML = `<div class="empty">❌ ${e.message}</div>`;
    }
  }
};

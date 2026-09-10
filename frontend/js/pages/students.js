const students = {
  async render(container) {
    renderShell(container, 'Students', '<div class="loading"><div class="spinner"></div> Loading…</div>');
    try {
      const data = await api.get('/students');
      const rows = data.map(s => {
        const color = scoreColor(s.avgScore);
        const progressBars = (s.progress || []).map(p => `
          <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text2)">
            <div style="flex:1;height:4px;background:var(--bg3);border-radius:2px;overflow:hidden">
              <div style="width:${p.pct}%;height:100%;background:${color};border-radius:2px"></div>
            </div>
            <span style="width:30px;text-align:right;font-family:'DM Mono',monospace">${p.pct}%</span>
          </div>
        `).join('');

        return `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div class="avatar" style="width:32px;height:32px;font-size:11px">${initials(s.name)}</div>
                <div>
                  <div style="font-weight:500">${s.name}</div>
                  <div style="font-size:11px;color:var(--text2)">${s.email}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="score-badge" style="background:${s.avgScore >= 80 ? 'rgba(46,160,67,.12)' : s.avgScore >= 60 ? 'rgba(227,179,65,.12)' : 'rgba(248,81,73,.12)'};color:${color}">
                ${s.avgScore}%
              </span>
            </td>
            <td>
              <div style="display:flex;flex-direction:column;gap:3px;min-width:100px">
                ${progressBars}
              </div>
            </td>
            <td>
              <div style="display:flex;align-items:center;gap:6px">
                <span style="font-size:15px">🔥</span>
                <span style="font-family:'DM Mono',monospace">${s.streak}</span>
              </div>
            </td>
            <td>
              <div style="font-family:'DM Mono',monospace;font-size:12px">
                Lv.${s.level} · ${s.xp} XP
              </div>
            </td>
          </tr>
        `;
      }).join('');

      document.getElementById('page-body').innerHTML = `
        <div style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center">
          <div class="card-title" style="margin:0">👥 All Students (${data.length})</div>
        </div>
        <div class="card">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Avg. Score</th>
                  <th>Progress by Subject</th>
                  <th>Streak</th>
                  <th>Level / XP</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>

        <div class="card" style="margin-top:1.25rem">
          <div class="card-title">📊 Class Insights</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:.25rem">
            <div style="text-align:center">
              <div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:500;color:var(--accent)">
                ${Math.round(data.reduce((a,s) => a + s.avgScore, 0) / (data.length || 1))}%
              </div>
              <div style="font-size:12px;color:var(--text2);margin-top:4px">Class Average</div>
            </div>
            <div style="text-align:center">
              <div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:500;color:var(--accent2)">
                ${data.filter(s => s.avgScore >= 80).length}
              </div>
              <div style="font-size:12px;color:var(--text2);margin-top:4px">High Performers (≥80%)</div>
            </div>
            <div style="text-align:center">
              <div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:500;color:var(--red)">
                ${data.filter(s => s.avgScore < 60).length}
              </div>
              <div style="font-size:12px;color:var(--text2);margin-top:4px">Need Support (&lt;60%)</div>
            </div>
          </div>
        </div>
      `;
    } catch (e) {
      document.getElementById('page-body').innerHTML = `<div class="empty">❌ ${e.message}</div>`;
    }
  }
};

const materials = {
  async render(container) {
    renderShell(container, 'Study Materials', '<div class="loading"><div class="spinner"></div> Loading…</div>');
    try {
      const [mats, subjects] = await Promise.all([api.get('/materials'), api.get('/subjects')]);
      const subjMap = {};
      subjects.forEach(s => subjMap[s.id] = s);

      // Group by subject
      const grouped = {};
      mats.forEach(m => {
        const sid = m.subjectId;
        if (!grouped[sid]) grouped[sid] = [];
        grouped[sid].push(m);
      });

      const typeIcon = { pdf: '📄', doc: '📝', video: '🎬', image: '🖼️' };
      const bgColors = ['#132236', '#1a1635', '#0d2318', '#2a1a0d', '#0d2227'];

      const sections = Object.entries(grouped).map(([sid, items]) => {
        const subj = subjMap[sid] || {};
        const idx = parseInt(sid) - 1;
        const itemsHtml = items.map(m => `
          <div class="material-item">
            <div class="mat-icon" style="background:${bgColors[idx] || '#111'}">
              ${typeIcon[m.type] || '📄'}
            </div>
            <div>
              <div class="mat-title">${m.title}</div>
              <div class="mat-sub">${m.type?.toUpperCase()} · Uploaded ${m.uploadedAt}</div>
            </div>
            <div class="mat-size">${m.size}</div>
            <button class="btn-sec" style="padding:6px 12px;font-size:11px;white-space:nowrap"
              onclick="showToast('Download started for: ${m.title}')">
              ↓ Download
            </button>
          </div>
        `).join('');

        return `
          <div style="margin-bottom:1.5rem">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:.75rem">
              <span style="font-size:18px">${subj.icon || '📚'}</span>
              <span style="font-size:15px;font-weight:600">${subj.name || 'General'}</span>
              <span class="chip chip-blue">${items.length} file${items.length !== 1 ? 's' : ''}</span>
            </div>
            ${itemsHtml}
          </div>
        `;
      }).join('');

      document.getElementById('page-body').innerHTML = `
        <div class="card-title" style="margin-bottom:1rem">📚 Study Materials</div>
        ${sections || '<div class="empty">No materials available yet.</div>'}
      `;
    } catch (e) {
      document.getElementById('page-body').innerHTML = `<div class="empty">❌ ${e.message}</div>`;
    }
  }
};

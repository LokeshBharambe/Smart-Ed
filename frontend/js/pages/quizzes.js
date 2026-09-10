const quizzes = {
  async render(container) {
    renderShell(container, 'Quizzes', '<div class="loading"><div class="spinner"></div> Loading…</div>');
    try {
      const [allQuizzes, subjects] = await Promise.all([api.get('/quizzes'), api.get('/subjects')]);
      const subjMap = {};
      subjects.forEach(s => subjMap[s.id] = s);

      const tagMap = { weak: 'tag-weak', strong: 'tag-strong', due: 'tag-due' };
      const tagLabel = { weak: 'Weak area', strong: 'Strong', due: 'Due soon' };
      const icons = ['📐', '⚡', '⚗️', '📖', '💻'];
      const bgColors = ['#132236', '#1a1635', '#0d2318', '#2a1a0d', '#0d2227'];

      const cards = allQuizzes.map(q => {
        const subj = subjMap[q.subjectId] || {};
        const idx = q.subjectId - 1;
        return `
          <div class="quiz-card-item" onclick="router.go('quizPlay', {id: ${q.id}})">
            <div class="qc-header">
              <div class="qc-icon" style="background:${bgColors[idx] || '#111'}">${icons[idx] || '📝'}</div>
              <span class="tag ${tagMap[q.tag] || 'tag-easy'}">${tagLabel[q.tag] || q.tag}</span>
            </div>
            <div class="qc-title">${q.title}</div>
            <div class="qc-sub" style="color:${subj.color || 'var(--text2)'}">
              ${subj.icon || ''} ${subj.name || 'General'}
            </div>
            <div class="qc-meta">
              <span>⏱ ${q.duration} min</span>
              <span>📋 ${q.questionCount} questions</span>
              <span class="tag tag-${q.difficulty}">${q.difficulty}</span>
            </div>
          </div>
        `;
      }).join('');

      document.getElementById('page-body').innerHTML = `
        <div class="card-title" style="margin-bottom:1rem">📝 All Practice Quizzes</div>
        <div class="grid-auto">${cards}</div>
      `;
    } catch (e) {
      document.getElementById('page-body').innerHTML = `<div class="empty">❌ ${e.message}</div>`;
    }
  }
};

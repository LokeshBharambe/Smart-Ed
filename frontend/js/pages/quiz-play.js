const quizPlay = {
  quiz: null,
  current: 0,
  answers: [],
  submitted: false,
  timer: null,
  timeLeft: 0,

  async render(container, params) {
    renderShell(container, 'Quiz', '<div class="loading"><div class="spinner"></div> Loading quiz…</div>');
    try {
      const quiz = await api.get(`/quizzes/${params.id}`);
      this.quiz = quiz;
      this.current = 0;
      this.answers = new Array(quiz.questions.length).fill(null);
      this.submitted = false;
      this.timeLeft = quiz.duration * 60;
      this.renderQuestion();
      this.startTimer();
    } catch (e) {
      document.getElementById('page-body').innerHTML = `<div class="empty">❌ ${e.message}</div>`;
    }
  },

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft--;
      const el = document.getElementById('timer');
      if (el) {
        const m = Math.floor(this.timeLeft / 60);
        const s = this.timeLeft % 60;
        el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
        if (this.timeLeft <= 60) el.style.color = 'var(--red)';
      }
      if (this.timeLeft <= 0) { clearInterval(this.timer); this.submitQuiz(); }
    }, 1000);
  },

  renderQuestion() {
    const q = this.quiz.questions[this.current];
    const total = this.quiz.questions.length;
    const pct = ((this.current) / total) * 100;
    const letters = ['A', 'B', 'C', 'D'];
    const m = Math.floor(this.timeLeft / 60);
    const s = this.timeLeft % 60;

    const options = q.options.map((opt, i) => `
      <button class="option-btn ${this.answers[this.current] === i ? 'selected' : ''}"
        onclick="quizPlay.selectOption(${i})" ${this.submitted ? 'disabled' : ''}>
        <span class="option-letter">${letters[i]}</span>
        ${opt}
      </button>
    `).join('');

    const isLast = this.current === total - 1;
    const answered = this.answers.filter(a => a !== null).length;

    const body = document.getElementById('page-body');
    if (!body) return;

    body.innerHTML = `
      <div class="quiz-play-wrap">
        <div class="quiz-header-bar">
          <button class="btn-sec" onclick="quizPlay.quit()">← Back</button>
          <div style="flex:1;margin:0 1rem">
            <div style="font-size:12px;color:var(--text2);margin-bottom:4px">
              Question ${this.current + 1} of ${total} · ${answered} answered
            </div>
            <div class="quiz-progress-bar">
              <div class="quiz-progress-fill" style="width:${pct}%"></div>
            </div>
          </div>
          <div style="font-family:'DM Mono',monospace;font-size:14px;color:var(--text2)" id="timer">
            ${m}:${s.toString().padStart(2, '0')}
          </div>
        </div>

        <div class="question-card">
          <div class="q-num">QUESTION ${this.current + 1}</div>
          <div class="q-text">${q.q}</div>
          <div class="options-grid">${options}</div>
        </div>

        <div class="quiz-nav">
          ${this.current > 0 ? `<button class="btn-sec" onclick="quizPlay.prev()">← Prev</button>` : ''}
          ${!isLast
            ? `<button class="btn-sec" onclick="quizPlay.next()">Next →</button>`
            : `<button class="btn-submit" onclick="quizPlay.submitQuiz()">Submit Quiz ✓</button>`
          }
          ${answered > 0 && !isLast ? `<button class="btn-submit" onclick="quizPlay.submitQuiz()">Submit (${answered}/${total}) ✓</button>` : ''}
        </div>
      </div>
    `;
  },

  selectOption(i) {
    if (this.submitted) return;
    this.answers[this.current] = i;
    this.renderQuestion();
  },

  next() {
    if (this.current < this.quiz.questions.length - 1) {
      this.current++;
      this.renderQuestion();
    }
  },

  prev() {
    if (this.current > 0) {
      this.current--;
      this.renderQuestion();
    }
  },

  quit() {
    clearInterval(this.timer);
    router.go('quizzes');
  },

  async submitQuiz() {
    clearInterval(this.timer);
    try {
      const result = await api.post(`/quizzes/${this.quiz.id}/submit`, { answers: this.answers });
      this.showResults(result);
    } catch (e) { showToast(e.message, 'error'); }
  },

  showResults(result) {
    const isPassing = result.score >= 60;
    const emoji = result.score >= 90 ? '🏆' : result.score >= 70 ? '🎉' : result.score >= 50 ? '📚' : '💪';
    const msg = result.score >= 90 ? 'Outstanding!' : result.score >= 70 ? 'Great job!' : result.score >= 50 ? 'Keep practicing!' : 'Don\'t give up!';

    const details = result.details.map((d, i) => `
      <div class="rd-item">
        <div class="rd-icon">${d.isCorrect ? '✅' : '❌'}</div>
        <div>
          <div class="rd-q">Q${i + 1}: ${d.question}</div>
          <div class="rd-ans">
            ${d.isCorrect ? 'Correct!' : `Your answer: option ${d.selected + 1} · Correct: option ${d.correct + 1}`}
          </div>
        </div>
      </div>
    `).join('');

    const body = document.getElementById('page-body');
    body.innerHTML = `
      <div class="quiz-play-wrap">
        <div class="card" style="text-align:center;margin-bottom:1.25rem;padding:2rem">
          <div style="font-size:48px;margin-bottom:1rem">${emoji}</div>
          <div class="result-score-circle" style="border-color:${scoreColor(result.score)}">
            <div class="big-num" style="color:${scoreColor(result.score)}">${result.score}%</div>
            <div class="small-label">score</div>
          </div>
          <div style="font-size:20px;font-weight:700;margin-bottom:4px">${msg}</div>
          <div style="color:var(--text2);font-size:14px">${result.correct} correct out of ${result.total} questions</div>
          ${isPassing
            ? '<div style="color:var(--accent);font-size:12px;margin-top:8px">✓ Passed</div>'
            : '<div style="color:var(--red);font-size:12px;margin-top:8px">✗ Below passing mark (60%)</div>'}
        </div>

        <div class="card" style="margin-bottom:1.25rem">
          <div class="card-title">Answer Review</div>
          <div class="result-detail">${details}</div>
        </div>

        <div style="display:flex;gap:.75rem;justify-content:center">
          <button class="btn-sec" onclick="router.go('quizzes')">← All Quizzes</button>
          <button class="btn-submit" onclick="router.go('dashboard')">Dashboard →</button>
        </div>
      </div>
    `;
  }
};

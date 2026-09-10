const router = {
  current: null,
  params: {},

  go(page, params = {}) {
    this.current = page;
    this.params = params;
    this.render();
  },

  render() {
    if (!auth.isLoggedIn() && this.current !== 'login' && this.current !== 'register') {
      this.current = 'login';
    }
    const app = document.getElementById('app');
    const pages = { login, register: login, dashboard, quizzes, quizPlay, materials, students, profile };
    const page = pages[this.current] || dashboard;
    app.innerHTML = '';
    page.render(app, this.params);
  }
};

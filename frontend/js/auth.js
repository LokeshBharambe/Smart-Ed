const auth = {
  user: null,
  token: null,

  init() {
    this.token = localStorage.getItem('sed_token');
    const u = localStorage.getItem('sed_user');
    if (u) this.user = JSON.parse(u);
  },

  isLoggedIn() { return !!this.token; },

  login(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('sed_token', token);
    localStorage.setItem('sed_user', JSON.stringify(user));
  },

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('sed_token');
    localStorage.removeItem('sed_user');
    router.go('login');
  }
};

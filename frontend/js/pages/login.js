const login = {
  render(container, params) {
    const isRegister = router.current === 'register';
    container.innerHTML = `
      <div class="auth-wrap">
        <div class="auth-card">
          <div class="auth-logo">
            <div class="logo-icon">🎓</div>
            <span>Smart<b>-ED</b></span>
          </div>
          <h2>${isRegister ? 'Create account' : 'Welcome back'}</h2>
          <p class="sub">${isRegister ? 'Join Smart-ED and start learning smarter.' : 'Sign in to your learning dashboard.'}</p>
          <div id="err" class="err-msg" style="display:none"></div>

          ${isRegister ? `
            <div class="form-group">
              <label>Full Name</label>
              <input id="f-name" type="text" placeholder="Rohan Sharma" />
            </div>
            <div class="form-group">
              <label>Role</label>
              <select id="f-role">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          ` : ''}

          <div class="form-group">
            <label>Email</label>
            <input id="f-email" type="email" placeholder="you@email.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input id="f-pass" type="password" placeholder="••••••••" />
          </div>
          <button class="btn-primary" id="submit-btn">${isRegister ? 'Create account' : 'Sign in'}</button>
          <div class="auth-switch">
            ${isRegister
              ? `Already have an account? <a onclick="router.go('login')">Sign in</a>`
              : `New to Smart-ED? <a onclick="router.go('register')">Create account</a>`}
          </div>
          ${!isRegister ? `
            <div class="demo-creds">
              <div>🎓 Student — student@demo.com / demo123</div>
              <div>👩‍🏫 Teacher — teacher@demo.com / demo123</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    document.getElementById('submit-btn').addEventListener('click', async () => {
      const email = document.getElementById('f-email').value.trim();
      const password = document.getElementById('f-pass').value;
      const errEl = document.getElementById('err');
      errEl.style.display = 'none';

      try {
        let data;
        if (isRegister) {
          const name = document.getElementById('f-name').value.trim();
          const role = document.getElementById('f-role').value;
          if (!name) { errEl.textContent = 'Name is required'; errEl.style.display = 'block'; return; }
          data = await api.post('/auth/register', { name, email, password, role });
        } else {
          data = await api.post('/auth/login', { email, password });
        }
        auth.login(data.token, data.user);
        showToast(`Welcome, ${data.user.name}! 🎉`);
        router.go('dashboard');
      } catch (e) {
        errEl.textContent = e.message;
        errEl.style.display = 'block';
      }
    });

    // Enter key support
    container.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('submit-btn').click();
    });
  }
};

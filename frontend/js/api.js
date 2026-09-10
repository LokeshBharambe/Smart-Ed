// Bootstrap Smart-ED
auth.init();

if (auth.isLoggedIn()) {
  router.go('dashboard');
} else {
  router.go('login');
}

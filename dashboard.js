document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Redireciona para o painel principal após o login
  window.location.href = 'dashboard.html';
});

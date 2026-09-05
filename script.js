const loginForm = document.getElementById('loginForm');
const welcomeText = document.querySelector('.welcome-text');
const submitBtn = document.querySelector('.btn-login');
const forgotPass = document.querySelector('.forgot-pass');
const signupPrompt = document.querySelector('.signup-prompt');

// 1. Redirecionamento ao enviar o Formulário de Login
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Redireciona para o painel após o login
    window.location.href = 'dashboard.html';
  });
}

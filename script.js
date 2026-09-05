const loginForm = document.getElementById('loginForm');
const signupBtn = document.getElementById('signupBtn');
const welcomeText = document.querySelector('.welcome-text');
const submitBtn = document.querySelector('.btn-login');
const forgotPass = document.querySelector('.forgot-pass');
const signupPrompt = document.querySelector('.signup-prompt');

let isSignUp = false;

signupBtn.addEventListener('click', function(e) {
  e.preventDefault();
  isSignUp = !isSignUp;

  if (isSignUp) {
    welcomeText.textContent = 'Create Account';
    submitBtn.textContent = 'Sign Up';
    forgotPass.style.display = 'none';
    signupPrompt.childNodes[0].nodeValue = 'Already a member ? ';
    signupBtn.textContent = 'Login';
  } else {
    welcomeText.textContent = 'Welcome Back, Rahul';
    submitBtn.textContent = 'Login';
    forgotPass.style.display = 'block';
    signupPrompt.childNodes[0].nodeValue = 'Are You New Member ? ';
    signupBtn.textContent = 'Sign UP';
  }
});

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  window.location.href = 'dashboard.html';
});

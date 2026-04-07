const API_URL = 'http://localhost:5000/api/auth';

// Toggle between login and register forms
function toggleForms() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  loginForm.classList.toggle('active');
  registerForm.classList.toggle('active');
  
  // Clear messages
  clearMessages();
}

// Clear all messages
function clearMessages() {
  document.getElementById('login-message').textContent = '';
  document.getElementById('login-message').className = 'message';
  document.getElementById('register-message').textContent = '';
  document.getElementById('register-message').className = 'message';
}

// Show message
function showMessage(formType, message, type) {
  const messageElement = document.getElementById(`${formType}-message`);
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
}

// Register form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const passwordConfirm = document.getElementById('register-password-confirm').value;

  // Validation
  if (!name || !email || !password || !passwordConfirm) {
    showMessage('register', 'All fields are required', 'error');
    return;
  }

  if (password !== passwordConfirm) {
    showMessage('register', 'Passwords do not match', 'error');
    return;
  }

  if (password.length < 8) {
    showMessage('register', 'Password must be at least 8 characters', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, passwordConfirm })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('register', 'Registration successful! Redirecting...', 'success');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setTimeout(() => {
        showDashboard(data.user);
      }, 1500);
    } else {
      showMessage('register', data.message || 'Registration failed', 'error');
    }
  } catch (error) {
    showMessage('register', 'Server error: ' + error.message, 'error');
  }
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  // Validation
  if (!email || !password) {
    showMessage('login', 'Please provide email and password', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('login', 'Login successful! Redirecting...', 'success');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setTimeout(() => {
        showDashboard(data.user);
      }, 1500);
    } else {
      showMessage('login', data.message || 'Login failed', 'error');
    }
  } catch (error) {
    showMessage('login', 'Server error: ' + error.message, 'error');
  }
});

// Show dashboard
function showDashboard(user) {
  document.querySelector('.form-container').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-email').textContent = user.email;
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.querySelector('.form-container').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('loginForm').reset();
  document.getElementById('registerForm').reset();
  document.getElementById('login-form').classList.add('active');
  document.getElementById('register-form').classList.remove('active');
  clearMessages();
}

// Check if user is already logged in
window.addEventListener('load', () => {
  const user = localStorage.getItem('user');
  if (user) {
    showDashboard(JSON.parse(user));
  }
});

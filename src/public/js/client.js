// Simple client-side logic for authentication and page actions

const API = '/api';

// Initialize Materialize
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
});

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// Sign In
const signInForm = document.getElementById('signInForm');
if (signInForm) {
  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const result = await postJSON(API + '/auth/signIn', { email, password });
      if (result && result.token) {
        sessionStorage.setItem('token', result.token);
        // decode token to get roles (simple parsing)
        const payload = JSON.parse(atob(result.token.split('.')[1]));
        const roles = payload.roles || [];
        M.toast({ html: 'Login exitoso. Redirigiendo...' });
        setTimeout(() => {
          if (roles.includes('admin')) location.href = '/admin';
          else location.href = '/dashboard';
        }, 1000);
      }
    } catch (err) {
      M.toast({ html: err.message || 'Error en login' });
    }
  });
}

// Sign Up
const signUpForm = document.getElementById('signUpForm');
if (signUpForm) {
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: document.getElementById('name').value,
        lastName: document.getElementById('lastName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        birthdate: document.getElementById('birthdate').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      };
      const result = await postJSON(API + '/auth/signUp', body);
      if (result && result.email) {
        M.toast({ html: 'Usuario creado exitosamente. Redirigiendo a login...' });
        setTimeout(() => location.href = '/signIn', 1500);
      }
    } catch (err) {
      M.toast({ html: err.message || 'Error en registro' });
    }
  });
}

// Helper to get token and redirect to signIn if missing
function requireAuth(redirect = true) {
  const token = sessionStorage.getItem('token');
  if (!token && redirect) location.href = '/signIn';
  return token;
}

// Profile page
if (document.getElementById('profileContainer')) {
  (async () => {
    const token = requireAuth();
    const res = await fetch(API + '/users/me', { headers: { Authorization: 'Bearer ' + token } });
    if (res.status === 401) return location.href = '/signIn';
    const user = await res.json();
    const container = document.getElementById('profileContainer');
    container.innerHTML = `<pre>${JSON.stringify(user, null, 2)}</pre>`;
  })();
}

// Dashboard user
if (document.getElementById('userInfo')) {
  (async () => {
    const token = requireAuth();
    const res = await fetch(API + '/users/me', { headers: { Authorization: 'Bearer ' + token } });
    if (res.status === 401) return location.href = '/signIn';
    const user = await res.json();
    document.getElementById('userInfo').innerHTML = `<p>Bienvenido, ${user.name || user.email}</p><pre>${JSON.stringify(user, null, 2)}</pre>`;
  })();
}

// Admin page
if (document.getElementById('usersTable')) {
  (async () => {
    try {
      const token = requireAuth();
      const res = await fetch(API + '/users', { headers: { Authorization: 'Bearer ' + token } });
      if (res.status === 403) return location.href = '/403';
      if (res.status === 401) return location.href = '/signIn';
      const users = await res.json();
      const tbody = document.getElementById('usersTable');
      tbody.innerHTML = users.map(u => `
        <tr>
          <td>${(u.name || '') + ' ' + (u.lastName || '')}</td>
          <td>${u.email}</td>
          <td>${u.phoneNumber || '-'}</td>
          <td>${new Date(u.createdAt).toLocaleDateString()}</td>
          <td><button class="btn btn-small" onclick="viewUser('${u._id}', '${u.name} ${u.lastName}')">Ver</button></td>
        </tr>
      `).join('');
    } catch (err) {
      console.error(err);
      M.toast({ html: 'Error al cargar usuarios' });
    }
  })();
}

function viewUser(userId, userName) {
  M.toast({ html: `Información de ${userName}` });
}

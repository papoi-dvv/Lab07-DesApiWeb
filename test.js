#!/usr/bin/env node
/**
 * Script de prueba simple para validar que el servidor funciona
 * Uso: node test.js
 */

const BASE_URL = 'https://express-auth-santoss.onrender.com';
let adminToken = '';
let userToken = '';

async function testAPI(method, path, body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };

  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    const data = await res.json();
    console.log(`✅ ${method} ${path} -> ${res.status}`);
    return { status: res.status, data };
  } catch (err) {
    console.error(`❌ ${method} ${path} -> ${err.message}`);
    return { status: 0, data: null };
  }
}

async function runTests() {
  console.log('\n🧪 Iniciando pruebas...\n');

  // 1. Health check
  console.log('📍 1. Health Check');
  await testAPI('GET', '/health');

  // 2. Sign Up - Nuevo usuario
  console.log('\n📍 2. Sign Up - Nuevo usuario');
  const signUpRes = await testAPI('POST', '/api/auth/signUp', {
    name: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'Test#1234',
    phoneNumber: '555-1234',
    birthdate: '1995-06-15'
  });

  // 3. Sign In - Admin
  console.log('\n📍 3. Sign In - Admin');
  const adminLoginRes = await testAPI('POST', '/api/auth/signIn', {
    email: 'admin@example.com',
    password: 'Admin#123'
  });
  if (adminLoginRes.data?.token) {
    adminToken = adminLoginRes.data.token;
    console.log('   ✓ Token admin guardado');
  }

  // 4. Get Me
  console.log('\n📍 4. Get User Me');
  if (adminToken) {
    await testAPI('GET', '/api/users/me', null, adminToken);
  }

  // 5. Get All Users (Admin only)
  console.log('\n📍 5. Get All Users (Admin)');
  if (adminToken) {
    const usersRes = await testAPI('GET', '/api/users', null, adminToken);
    if (usersRes.data && Array.isArray(usersRes.data)) {
      console.log(`   ✓ Total usuarios: ${usersRes.data.length}`);
    }
  }

  // 6. Test pages accessibility
  console.log('\n📍 6. Test Web Pages');
  const pages = ['/signIn', '/signUp', '/dashboard', '/admin', '/profile', '/403', '/404'];
  for (const page of pages) {
    try {
      const res = await fetch(`${BASE_URL}${page}`);
      console.log(`   ${res.ok ? '✅' : '⚠️'} ${page} -> ${res.status}`);
    } catch (err) {
      console.error(`   ❌ ${page} -> ${err.message}`);
    }
  }

  console.log('\n✨ Pruebas completadas!\n');
}

console.log(`🚀 Iniciando pruebas contra ${BASE_URL}`);
console.log('Asegúrate de que el servidor está corriendo: npm run dev\n');

// Esperar 2 segundos para asegurar que el servidor esté listo
setTimeout(runTests, 2000);

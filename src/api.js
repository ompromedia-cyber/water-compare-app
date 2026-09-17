// src/api.js
const API_BASE = process.env.REACT_APP_API_URL || 'https://ваш-api.vercel.app/api';

function getToken() {
  try {
    return localStorage.getItem('admin_token');
  } catch (e) {
    return null;
  }
}

// Получить все воды
export async function fetchWaters() {
  const res = await fetch(`${API_BASE}/waters`);
  if (!res.ok) throw new Error('Failed to fetch waters');
  return res.json();
}

// Добавить воду
export async function createWater(water) {
  const res = await fetch(`${API_BASE}/waters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(water)
  });
  if (!res.ok) throw new Error('Failed to create water');
  return res.json();
}

// Обновить воду
export async function updateWater(id, water) {
  const res = await fetch(`${API_BASE}/waters/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(water)
  });
  if (!res.ok) throw new Error('Failed to update water');
  return res.json();
}

// Удалить воду
export async function deleteWater(id) {
  const res = await fetch(`${API_BASE}/waters/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  if (!res.ok) throw new Error('Failed to delete water');
  return res.json();
}

// Импорт массива вод
export async function importWaters(waters) {
  const res = await fetch(`${API_BASE}/waters/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ waters })
  });
  if (!res.ok) throw new Error('Failed to import');
  return res.json();
}

// Авторизация
export async function login(login, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password })
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  localStorage.setItem('admin_token', data.token);
  return data;
}

export function logout() {
  localStorage.removeItem('admin_token');
}

export function isAuthenticated() {
  return !!getToken();
}

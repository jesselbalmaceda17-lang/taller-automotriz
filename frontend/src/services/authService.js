import { request } from './api';

export async function login(email, password) {
  const data = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('permissions', JSON.stringify(data.permissions || []));

  return data;
}

export async function logout() {
  const token = getToken();

  try {
    if (token) {
      await request('/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } finally {
    clearSession();
  }
}

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('permissions');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getPermissions() {
  const permissions = localStorage.getItem('permissions');
  return permissions ? JSON.parse(permissions) : [];
}

export function hasPermission(permission) {
  return getPermissions().includes(permission);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

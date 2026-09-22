import { request } from './api';

function authHeaders() {
  const token = localStorage.getItem('token');

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function getItems() {
  return request('/items', {
    headers: authHeaders(),
  });
}

export function getItem(id) {
  return request(`/items/${id}`, {
    headers: authHeaders(),
  });
}

export function createItem(item) {
  return request('/items', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(item),
  });
}

export function updateItem(id, item) {
  return request(`/items/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(item),
  });
}

export function deleteItem(id) {
  return request(`/items/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

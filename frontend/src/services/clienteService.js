import { request } from './api';

export function getClientes() {
  const token = localStorage.getItem('token');

  return request('/clientes', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

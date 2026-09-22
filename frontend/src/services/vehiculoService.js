import { request } from './api';

function authHeaders() {
  const token = localStorage.getItem('token');

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function getVehiculos() {
  return request('/vehiculos', {
    headers: authHeaders(),
  });
}

export function getVehiculo(id) {
  return request(`/vehiculos/${id}`, {
    headers: authHeaders(),
  });
}

export function createVehiculo(vehiculo) {
  return request('/vehiculos', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(prepareVehiculoPayload(vehiculo)),
  });
}

export function updateVehiculo(id, vehiculo) {
  return request(`/vehiculos/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(prepareVehiculoPayload(vehiculo)),
  });
}

export function deleteVehiculo(id) {
  return request(`/vehiculos/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

function prepareVehiculoPayload({ cliente: _cliente, ...vehiculo }) {
  return vehiculo;
}

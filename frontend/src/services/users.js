import api from './api'

export function getUsers() {
  return api.get('/usuarios/')
}

export function createUser(payload) {
  return api.post('/usuarios/', payload)
}

export function updateUser(id, payload) {
  return api.put(`/usuarios/${id}/`, payload)
}

export function toggleUserStatus(id, activo) {
  return api.patch(`/usuarios/${id}/`, { activo })
}

export function getRoles() {
  return api.get('/roles/')
}

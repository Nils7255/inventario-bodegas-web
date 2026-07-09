import api from './api'

export function getSuppliers() {
  return api.get('/proveedores/')
}

export function createSupplier(payload) {
  return api.post('/proveedores/', payload)
}

export function updateSupplier(id, payload) {
  return api.put(`/proveedores/${id}/`, payload)
}

export function deactivateSupplier(id) {
  return api.patch(`/proveedores/${id}/`, { activo: false })
}

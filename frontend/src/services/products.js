import api from './api'

export function getCategories() {
  return api.get('/categorias/')
}

export function getProducts() {
  return api.get('/productos/')
}

export function createProduct(payload) {
  return api.post('/productos/', payload)
}

export function updateProduct(id, payload) {
  return api.put(`/productos/${id}/`, payload)
}

export function deactivateProduct(id) {
  return api.delete(`/productos/${id}/`)
}

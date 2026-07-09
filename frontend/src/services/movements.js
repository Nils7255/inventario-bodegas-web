import api from './api'

export function getMovements() {
  return api.get('/inventario/movimientos/')
}

export function createMovement(payload) {
  return api.post('/inventario/movimientos/', payload)
}

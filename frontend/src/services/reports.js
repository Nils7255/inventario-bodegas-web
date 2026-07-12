import api from './api'

export function getInventorySummary() {
  return api.get('/reportes/resumen/')
}

export function getReportProducts() {
  return api.get('/productos/')
}

export function getReportMovements() {
  return api.get('/inventario/movimientos/')
}

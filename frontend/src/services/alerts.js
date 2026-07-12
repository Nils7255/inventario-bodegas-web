import api from './api'

export function getAlerts() {
  return api.get('/alertas/')
}

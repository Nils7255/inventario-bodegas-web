import { defineStore } from 'pinia'

import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken),
  },
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const { data } = await api.post('/auth/login/', credentials)

        this.accessToken = data.access
        this.refreshToken = data.refresh
        this.user = data.usuario

        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        localStorage.setItem('auth_user', JSON.stringify(data.usuario))
      } catch (error) {
        this.logout()
        this.error = 'Credenciales invalidas'
        throw error
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.error = null

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('auth_user')
    },
  },
})

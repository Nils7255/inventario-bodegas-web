// Store de autenticación (Pinia)
// Maneja el estado global del usuario logueado y su token de sesión.

import { defineStore } from 'pinia'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const { user, token } = await authService.login(credentials)

        this.user = user
        this.token = token
        localStorage.setItem('auth_token', token)

        return user
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        if (this.token) {
          await authService.logout(this.token)
        }
      } finally {
        this.user = null
        this.token = null
        localStorage.removeItem('auth_token')
      }
    },
  },
})

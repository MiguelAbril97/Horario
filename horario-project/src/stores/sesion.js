import { defineStore } from 'pinia'

export const useSesionStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('access_token'),
  }),
  actions: {
    login() {
      this.isAuthenticated = true
    },
    logout() {
      this.isAuthenticated = false
    },
    checkSesion() {
      this.isAuthenticated = !!localStorage.getItem('access_token')
    },
  }
})

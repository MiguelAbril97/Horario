import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    usuario: localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")) : null
  }),
  actions: {
    setUser(user) {
      this.usuario = user;
      localStorage.setItem("usuario", JSON.stringify(user));
    },
    clearUser() {
      this.usuario = null;
      localStorage.removeItem("usuario");
    },
    getUser() {
      return this.usuario;
    }
  }
})
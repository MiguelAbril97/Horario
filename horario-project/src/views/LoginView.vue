<script setup>
import { obtenerToken, login } from '@/api/peticiones';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useSesionStore } from '@/stores/sesion';
import { useUserStore } from '@/stores/usuario';



const sesion = useSesionStore();
const userStore = useUserStore();
const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref(null);

const iniciarSesion = async () => {
  error.value = null;
  try {
    const token = await obtenerToken(username.value, password.value);
    if (token) {
      // (Opcional) Obtener el usuario y guardarlo en Vuex o localStorage
      const usuario = await login(token);
      userStore.setUser(usuario);
      sesion.login()
      router.push('/');
    } else {
      error.value = 'Usuario o contraseña incorrectos';
    }
  } catch (err) {
    console.error('❌ Error en iniciarSesion:', err);
    error.value = 'Usuario o contraseña incorrectos';
  }
}
</script>

<template>
    <div class="card shadow-sm mt-3">
      <div class="card-body">
      <h2 class="card-title">Iniciar sesión</h2>
      <form @submit.prevent="iniciarSesion">
        <div class="mb-3">
          <label for="username" class="form-label">Usuario</label>
          <input v-model="username" type="text" class="form-control" id="username" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input v-model="password" type="password" class="form-control" id="password" required />
        </div>
        <button type="submit" class="btn btn-dark w-100">Entrar</button>
        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
      </form>
      </div>
    </div>
    <div class="text-center mt-3">
      <router-link to="/recuperar-password">¿Olvidaste tu contraseña?</router-link>
    </div>
</template>
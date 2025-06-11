<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { confirmarResetPassword } from '@/api/peticiones'

const route = useRoute()
const router = useRouter()
const token = route.query.token || route.params.token || ''
const password = ref('')
const password2 = ref('')
const mensaje = ref('')
const error = ref('')

const enviar = async () => {
  mensaje.value = ''
  error.value = ''
  if (!password.value || password.value !== password2.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  try {
    await confirmarResetPassword(token, password.value)
    mensaje.value = 'Contraseña restablecida correctamente. Ahora puedes iniciar sesión.'
    setTimeout(() => router.push('/login'), 2000)
  } catch (e) {
    error.value = 'No se pudo restablecer la contraseña. El enlace puede haber expirado.'
  }
}
</script>

<template>
  <div class="container mt-5">
    <h2>Establecer nueva contraseña</h2>
    <form @submit.prevent="enviar">
      <div class="mb-3">
        <label class="form-label">Nueva contraseña</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Repite la contraseña</label>
        <input v-model="password2" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Guardar</button>
    </form>
    <div v-if="mensaje" class="alert alert-success mt-3">{{ mensaje }}</div>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>
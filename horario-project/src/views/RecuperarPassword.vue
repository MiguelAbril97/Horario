<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-body">
        <h2 class="card-title">Recuperar contraseña</h2>
        <form @submit.prevent="enviarRecuperacion">
          <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico</label>
            <input v-model="email" type="email" class="form-control" id="email" required>
          </div>
          <button type="submit" class="btn btn-primary">Enviar enlace de recuperación</button>
        </form>
        <div v-if="mensaje" class="alert alert-info mt-3">{{ mensaje }}</div>
        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { recuperarPassword } from '@/api/peticiones'

const email = ref('')
const mensaje = ref('')
const error = ref('')

async function enviarRecuperacion() {
  mensaje.value = ''
  error.value = ''
  try {
    await recuperarPassword(email.value)
    mensaje.value = 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.'
  } catch (e) {
    error.value = 'No se pudo enviar el correo. Intenta de nuevo.'
  }
}
</script>
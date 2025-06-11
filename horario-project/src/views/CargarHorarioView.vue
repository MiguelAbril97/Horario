<script setup>
import { ref } from 'vue'
import { subirHorario } from '@/api/peticiones'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useSesionStore } from '@/stores/sesion'
import { useRouter } from 'vue-router'

const errorArchivo = ref(null)
const showModal = ref(false)
const selectedFile = ref(null)
const cargando = ref(false)
const exito = ref(false)
const mensajeCargando = ref('')
const sesion = useSesionStore()
const router = useRouter()

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    showModal.value = true
  }
}

const confirmarSubida = async () => {
  errorArchivo.value = null
  showModal.value = false
  cargando.value = true
  mensajeCargando.value = 'Cargando nuevos datos en la base de datos...'
  try {
    await subirHorario(selectedFile.value)
    cargando.value = false
    exito.value = true
    mensajeCargando.value = '¡Datos cargados correctamente! Cerrando sesión...'
    setTimeout(() => {
      sesion.logout()
      router.push('/login')
    }, 2000)
  } catch (err) {
    cargando.value = false
    errorArchivo.value = err.message || 'Error al subir el archivo'
  }
}

const cancelarSubida = () => {
  showModal.value = false
  selectedFile.value = null
}
</script>

<template>
  <!-- Overlay de bloqueo cuando cargando o exito -->
  <div
    v-if="cargando || exito"
    class="overlay-loading"
    tabindex="0"
    aria-modal="true"
    role="dialog"
  >
    <div class="d-flex flex-column align-items-center justify-content-center h-100 w-100">
      <div v-if="cargando" class="text-center my-4">
        <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <div class="mt-3 fs-5">{{ mensajeCargando }}</div>
      </div>
      <div v-if="exito" class="alert alert-success text-center mt-4">
        {{ mensajeCargando }}
      </div>
    </div>
  </div>

  <!-- Todo lo demás solo si NO está cargando ni en éxito -->
  <div v-if="!cargando && !exito" class="card mt-4">
    <div class="card-header bg-warning text-dark text-center">
      <strong class="fs-3">¡Atención!</strong>
    </div>
    <div class="card-body">
      <p class="fs-5">
        Al subir un nuevo horario se perderán todos los datos actuales (usuarios, horarios, ausencias...) y se reemplazarán por los nuevos.
      </p>
      <div class="input-group mb-3 justify-content-center">
        <input
          type="file"
          class="form-control form-control-lg w-auto custom-file-input-estilizado"
          id="inputGroupFile01"
          @change="onFileChange"
          accept=".csv,.txt"
        >
      </div>
      <small class="form-text text-muted fs-6">
        Solo se aceptan archivos <strong>.txt</strong> o <strong>.csv</strong>
      </small>
      <p v-if="errorArchivo" class="text-danger fs-5 text-center">Error: {{ errorArchivo }}</p>
    </div>
  </div>
  <ConfirmModal
    :visible="showModal"
    title="Confirmar subida"
    message="¿Estás seguro de que deseas subir este archivo? Se perderán todos los datos actuales."
    @close="cancelarSubida"
    @confirm="confirmarSubida"
  />
</template>

<style scoped>
.overlay-loading {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 2000;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}
</style>

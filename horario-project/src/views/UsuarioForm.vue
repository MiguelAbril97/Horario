<script setup>
import { ref, watch, onMounted } from 'vue'
import { crearUsuario, getProfe, editarUsuario, eliminarUsuario } from '@/api/peticiones'
import { useRouter } from 'vue-router'
import ConfirmModal from '@/components/ConfirmModal.vue'

const props = defineProps({
  id: String
})

const id = props.id

const username = ref('')
const nombre = ref('')
const apellidos = ref('')
const email = ref('')
const rol = ref('2')
const password = ref('')

const respuesta = ref(null)
const modoEdicion = ref(false)

const mostrarModal = ref(false)
const router = useRouter()

async function eliminarYRedirigir() {
  try {
    await eliminarUsuario(id)
    mostrarModal.value = false
    router.push('/')
  } catch (error) {
    alert('Error al eliminar el usuario')
    mostrarModal.value = false
  }
}

// Función para generar el email automáticamente
function generarEmail() {
  if (nombre.value && apellidos.value) {
    let primerApellido = apellidos.value.split(' ')[0] || ''
    primerApellido = apellidos.value.split(' ')[0] || ''
    email.value = `${nombre.value.trim().toLowerCase()}.${primerApellido.trim().toLowerCase()}@iespoligonosur.org`
  }
}

onMounted(async () => {
  if (id) {
    modoEdicion.value = true
    const profe = await getProfe(id)
    username.value = profe.username
    nombre.value = profe.first_name
    apellidos.value = profe.last_name
    email.value = profe.email
    rol.value = String(profe.rol)
  }
})

if(!modoEdicion){
  watch([nombre, apellidos], generarEmail)
}

const nuevoUsuario = async () => {
  respuesta.value = null
  if (!username.value || !nombre.value || !apellidos.value || !email.value || !rol.value) {
    respuesta.value = 'Todos los campos son obligatorios.'
    return
  }

try {
    const serverResponse = await crearUsuario({ 
        username: username.value, 
        first_name: nombre.value, 
        last_name: apellidos.value, 
        email: email.value, 
        rol: rol.value,
        password: password.value
    })
    respuesta.value = 'Usuario creado correctamente.'
    username.value = ''
    nombre.value = ''
    apellidos.value = ''
    email.value = ''
    rol.value = '2'
} catch (error) {
    respuesta.value = error.response?.data?.message || 'Ocurrió un error al crear el usuario.'
}
}

const cambiarUsuario = async() => {
  respuesta.value = null
  if (!username.value || !nombre.value || !apellidos.value || !email.value || !rol.value) {
    respuesta.value = 'Todos los campos son obligatorios.'
    return
  }

  try {
      const serverResponse = await editarUsuario(
        { 
          username: username.value, 
          first_name: nombre.value, 
          last_name: apellidos.value, 
          email: email.value, 
          rol: rol.value,

      }, id
    )
      respuesta.value = 'Usuario creado correctamente.'
      username.value = ''
      nombre.value = ''
      apellidos.value = ''
      email.value = ''
      rol.value = '2'
  } catch (error) {
      respuesta.value = error.response?.data?.message || 'Ocurrió un error al crear el usuario.'
  }
}
</script>

<template>
  <div class="container mt-5">
    <h3>{{ modoEdicion ? 'Editar Usuario' : 'Crear Usuario' }}</h3>
    <div v-if="respuesta=='Usuario creado correctamente.'" class="alert alert-success">{{ respuesta }}</div>
    <div v-else-if="respuesta" class="alert alert-danger">{{ respuesta }}</div>

    <form @submit.prevent="nuevoUsuario">
      <div class="mb-3">
        <label class="form-label">Nombre de usuario</label>
        <input v-model="username" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input v-model="nombre" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Apellidos</label>
        <input v-model="apellidos" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>
      <div v-if="!modoEdicion" class="mb-3">
        <label class="form-label">Contraseña</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Rol</label>
        <div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="director" value="1" v-model="rol" />
            <label class="form-check-label" for="director">Director</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="profesor" value="2" v-model="rol" />
            <label class="form-check-label" for="profesor">Profesor</label>
          </div>
        </div>
      </div>
      <button v-if="modoEdicion" type="button" class="btn btn-dark w-100" @click.prevent="cambiarUsuario()"
      >
      Guardar Cambios
    </button>
    <button v-else type="button" class="btn btn-dark w-100" @click.prevent="nuevoUsuario()">
      Crear Usuario
    </button>
    </form>
    <button v-if="modoEdicion" class="btn btn-danger ms-2" @click="mostrarModal = true" title="Eliminar usuario">
      <i class="bi bi-trash"></i>
    </button>
  </div>

  <ConfirmModal
    :visible="mostrarModal"
    title="Confirmar eliminación"
    message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
    @close="mostrarModal = false"
    @confirm="eliminarYRedirigir"
  />

</template>
<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useUserStore } from '@/stores/usuario' 
import { getHorarioProfe, getProfe, getAusenciasProfe, justificarAusencia as apiJustificarAusencia, 
  deleteAusencia as deleteAusenciaAPI, getAusencia } from '@/api/peticiones'
import { useRoute } from 'vue-router';
import HorarioTable from '@/components/HorarioTable.vue'
import AusenciasUsuario from '@/components/AusenciasUsuario.vue'
import AusenciaDetails from '@/components/AusenciaDetails.vue'


const userStore = useUserStore();
const usuario = computed(() => userStore.usuario);
const route = useRoute();
const id_profe = route.params.id;
const profesor = ref(null);
const horarios = ref([]);
const error = ref(null);
const ausencias = ref([]);
const dias = ['L', 'M', 'X', 'J', 'V']
const horas = Array.from({ length: 13 }, (_, i) => i + 1) // 1 a 13

// Modal de detalle
const showDetalle = ref(false)
const detalleAusencia = ref(null)

async function verDetalleAusencia(id) {
  showDetalle.value = true
  detalleAusencia.value = null
  try {
    detalleAusencia.value = await getAusencia(id)
  } catch (err) {
    detalleAusencia.value = { fecha: '', justificada: false, motivo: 'Error al cargar' }
  }
}
function cerrarDetalle() {
  showDetalle.value = false
  detalleAusencia.value = null
}


const cargarHorario = async (id_profe) => {
  try {
    error.value = null
    horarios.value = await getHorarioProfe(id_profe)
  } catch (err) {
    error.value = err.message
  }
}

const cargarProfe = async (id_profe) => {
  try {
    error.value = null
    profesor.value = await getProfe(id_profe)
  } catch (err) {
    error.value = err.message
  }
}

const cargarAusencias = async (id_profe) => {
  try {
    error.value = null
    ausencias.value = await getAusenciasProfe(id_profe)
  } catch (err) {
    error.value = err.message
  }
}

// Cambia aquí: espera la respuesta del servidor antes de marcar como justificada
async function justificarAusencia(id) {
  try {
    await apiJustificarAusencia(id); // espera respuesta OK del servidor
    // Solo si fue OK, actualiza el array local
    const ausencia = ausencias.value.find(a => a.id === id);
    if (ausencia) {
      ausencia.justificada = true;
    }
  } catch (err) {
    error.value = 'No se pudo justificar la ausencia. Intenta de nuevo.';
  }
}

async function deleteAusencia(id) {
  try {
    await deleteAusenciaAPI(id); // espera respuesta OK del servidor
    // Solo si fue OK, elimina del array local
    ausencias.value = ausencias.value.filter(a => a.id !== id);
  } catch (err) {
    error.value = 'No se pudo eliminar la ausencia. Intenta de nuevo.';
  }
}

onMounted(async () => {
  cargarHorario(id_profe);
  cargarProfe(id_profe);
  cargarAusencias(id_profe);
  usuario.value = userStore.getUser();
})

watch(
  () => route.params.profesorId,
  (nuevoId) => {
    cargarHorario(nuevoId);
    cargarProfe(nuevoId);
  }
)
</script>

<template>
  <div class="container mt-5">
    <div v-if="profesor">
      <h2>
        Datos del profesor
        <router-link :to="`/usuario/editar/${id_profe}`" class="ms-2">
          <i class="bi bi-pencil"></i>
        </router-link>
      </h2>
      <p><strong>Nombre:</strong> {{ profesor.first_name }} {{ profesor.last_name }}</p>
      <p><strong>Email:</strong> {{ profesor.email }}</p>
    </div>
    <AusenciasUsuario
      :misAusencias="ausencias"
      :profesor="usuario"
      @justificar="justificarAusencia"
      @eliminar="deleteAusencia"
      @ver-detalle="verDetalleAusencia"
    />
    <AusenciaDetails
      :visible="showDetalle"
      :ausencia="detalleAusencia"
      @close="cerrarDetalle"
    />
    <div class="d-flex flex-column">
      <h2 v-if="profesor" class="my-4">Horario de {{ profesor.first_name }} {{ profesor.last_name }}</h2>
      <HorarioTable :horarios="horarios" :dias="dias" :horas="horas" />
    </div>

  </div>
</template>
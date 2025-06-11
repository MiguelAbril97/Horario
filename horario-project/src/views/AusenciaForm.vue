<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { createAusencia, getHorarioProfeDia } from '@/api/peticiones'
import { useUserStore } from '@/stores/usuario'

const userStore = useUserStore();
const profesor = computed(() => userStore.usuario);
const fecha = ref('')
const motivo = ref('')
const horariosDia = ref([])
const horasSeleccionadas = ref([]) // IDs de los horarios seleccionados
const error = ref(null)
const exito = ref(null)
const prohibido = ref(false)

onMounted(() => {
  profesor.value = userStore.getUser();
});

// Calcular el día de la semana (L, M, X, J, V) a partir de la fecha seleccionada
function getDiaSemanaLetra(fechaStr) {
  const dias = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
  const jsDate = new Date(fechaStr)
  return dias[jsDate.getDay()]
}

// Cuando cambia la fecha, carga los horarios del profesor para ese día
watch(fecha, async (nuevaFecha) => {
  horasSeleccionadas.value = []
  horariosDia.value = []
  exito.value = null
  error.value = null
  if (nuevaFecha && profesor.value.id) {
    const diaLetra = getDiaSemanaLetra(nuevaFecha)
    try {
      horariosDia.value = await getHorarioProfeDia(profesor.value.id, diaLetra)
    } catch (err) {
      error.value = 'No se pudieron cargar los horarios.'
    }
  }
})

// Enviar el formulario
const enviarAusencia = async () => {
  error.value = null
  exito.value = null
  if (!fecha.value || !horasSeleccionadas.value.length) {
    error.value = 'Debes seleccionar una fecha y al menos una hora.'
    return
  }
  try {
    // Crea una ausencia por cada horario seleccionado
    for (const horarioId of horasSeleccionadas.value) {
      await createAusencia({
        profesor: profesor.value.id,
        fecha: fecha.value,
        motivo: motivo.value,
        horario: horarioId
      })
    }
    exito.value = 'Ausencia(s) reportada(s) correctamente.'
    motivo.value = ''
    horasSeleccionadas.value = []
  } catch (err) {
    error.value = 'Error al reportar la ausencia.'
  }
}
</script>

<template>
  <div v-if="prohibido === false" class="container mt-5" style="max-width: 500px;">
    <h3>Reportar Ausencia</h3>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="exito" class="alert alert-success">{{ exito }}</div>
    <form @submit.prevent="enviarAusencia">
      <div class="mb-3">
        <label class="form-label">Profesor</label>
        <input type="text" class="form-control" :value="profesor ? profesor.first_name + ' ' + profesor.last_name : ''" disabled>
      </div>
      <div class="mb-3">
        <label for="fecha" class="form-label">Fecha</label>
        <input v-model="fecha" id="fecha" type="date" class="form-control" required>
      </div>
      <div class="mb-3" v-if="fecha && horariosDia.length">
        <label for="horas" class="form-label">Horas (puedes seleccionar varias)</label>
        <select id="horas" v-model="horasSeleccionadas" class="form-select" multiple required>
          <option v-for="h in horariosDia" :key="h.id" :value="h.id">
            {{ h.hora }} - {{ h.asignatura.nombre }} ({{ h.grupo.nombre }}, Aula {{ h.aula.numero }})
          </option>
        </select>
        <div class="form-text">Mantén pulsada Ctrl (o Cmd en Mac) para seleccionar varias horas.</div>
      </div>
      <div class="mb-3">
        <label for="motivo" class="form-label">Motivo</label>
        <input v-model="motivo" id="motivo" type="text" class="form-control" maxlength="200" placeholder="Motivo (opcional)">
      </div>
      <button type="submit" class="btn btn-dark w-100">Reportar Ausencia</button>
    </form>
  </div>

  <div v-else class="container mt-5" style="max-width: 500px;">
    <h3>Acceso Prohibido</h3>
    <p>No tienes permiso para acceder a esta página.</p>
  </div>
</template>
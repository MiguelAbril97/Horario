<script setup>
import { onMounted, ref, computed } from 'vue'
import { getHorarioProfe, getProfesores, getListaAulas, getListaGrupos  } from '@/api/peticiones'
import { useRouter } from 'vue-router';
import HorarioTable from '@/components/HorarioTable.vue'
import { useUserStore } from '@/stores/usuario';

const userStore = useUserStore();
const usuarioActual = computed(() => userStore.usuario);

const router = useRouter();
const profesor = ref(null)
const horario = ref([])
const errorHorario = ref(null)
const errorProfesores = ref(null)
const profesores = ref([])
const dias = ['L', 'M', 'X', 'J', 'V']
const horas = Array.from({ length: 13 }, (_, i) => i + 1) 
const mostrarBusqueda = ref(false)

const grupos = ref([])
const grupoInput = ref('')
const showGrupoResults = ref(false)
const grupoSeleccionado = ref('')


const errorAulaGrupo = ref(null)
const loading = ref(false);

const aulas = ref([])
const aulaInput = ref('')
const showAulaResults = ref(false)
const aulaSeleccionada = ref('')

// Filtrado para profesores

onMounted(async () => {
  loading.value = true;
  const usuarioGuardado = localStorage.getItem('usuario')
  if (usuarioGuardado) {
    profesor.value = JSON.parse(usuarioGuardado)
  }
  try {
    horario.value = await getHorarioProfe(profesor.value.id)
  } catch (err) {
    errorHorario.value = err.message
  }  
  try {
    profesores.value = await getProfesores()
  } catch (err) {
    errorProfesores.value = err.message
  }
  try{
    aulas.value = await getListaAulas()
    grupos.value = await getListaGrupos()
    console.log(grupos.value)
    }catch(err){
      errorAulaGrupo.value = err.message
    }
    loading.value = false;
  })

const profesorInput = ref('')
const showProfesorResults = ref(false)
const profesorSeleccionado = ref(null)

const profesoresFiltrados = computed(() =>
  profesores.value.filter(p =>
    (p.first_name + ' ' + p.last_name).toLowerCase().includes(profesorInput.value.toLowerCase()) ||
    (p.last_name + ' ' + p.first_name).toLowerCase().includes(profesorInput.value.toLowerCase())
  )
)

const onProfesorInput = () => {
  showProfesorResults.value = profesorInput.value.length > 0 && profesoresFiltrados.value.length > 0
}

const seleccionarProfesor = (prof) => {
  profesorInput.value = `${prof.last_name}, ${prof.first_name}`
  profesorSeleccionado.value = prof
  showProfesorResults.value = false
}

const onProfesorBlur = () => {
  setTimeout(() => {
    showProfesorResults.value = false
  }, 200)
}

const verProfeSeleccionado = () => {
  const prof = profesorSeleccionado.value || profesoresFiltrados.value[0]
  if (prof && prof.id) {
    router.push(`/profesor/${prof.id}`)
  }
}

const aulasFiltradas = computed(() =>
  aulas.value.filter(a => a.toLowerCase().startsWith(aulaInput.value.toLowerCase()))
)

const seleccionarAula = (aula) => {
  aulaInput.value = aula
  aulaSeleccionada.value = aula
  showAulaResults.value = false
}

const onAulaInput = () => {
  showAulaResults.value = aulaInput.value.length > 0 && aulasFiltradas.value.length > 0
}

const verAula = () => {
  const valor = aulaSeleccionada.value || aulaInput.value;
  if (valor && valor.trim() !== '') {
    router.push(`/horario/aula/${encodeURIComponent(valor.trim())}`)
  }
}

const onAulaBlur = () => {
  setTimeout(() => {
    showAulaResults.value = false
  }, 200)
}

const gruposFiltrados = computed(() =>
  grupos.value.filter(g => g.toLowerCase().includes(grupoInput.value.toLowerCase()))
)

const seleccionarGrupo = (grupo) => {
  grupoInput.value = grupo
  grupoSeleccionado.value = grupo
  showGrupoResults.value = false
}

const onGrupoInput = () => {
  showGrupoResults.value = grupoInput.value.length > 0 && gruposFiltrados.value.length > 0
}

const onGrupoBlur = () => {
  setTimeout(() => {
    showGrupoResults.value = false
  }, 200)
}

const verGrupo = () => {
  const valor = grupoSeleccionado.value || grupoInput.value;
  if (valor && valor.trim() !== '') {
    router.push(`/horario/grupo/${encodeURIComponent(valor.trim())}`)
  }
}

</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else class="container-fluid mt-5">
    <div>
      <button
        class="btn btn-outline-dark mb-3"
        @click="mostrarBusqueda = !mostrarBusqueda"
        aria-expanded="mostrarBusqueda"
      >
        {{ mostrarBusqueda ? 'Ocultar menú de búsqueda' : 'Mostrar menú de búsqueda' }}
      </button>
      <transition name="fade">
        <div v-if="mostrarBusqueda" class="card p-4 mb-4 shadow">
          <div class="mb-3 position-relative">
            <label for="buscarProfesor" class="form-label">Busca un profesor:</label>
            <input
              type="text"
              id="buscarProfesor"
              v-model="profesorInput"
              @input="onProfesorInput"
              @focus="onProfesorInput"
              @blur="onProfesorBlur"
              class="form-control"
              autocomplete="off"
              placeholder="Escribe el nombre o apellido"
            />
            <ul
              v-if="showProfesorResults"
              class="list-group position-absolute w-100"
              style="z-index: 2000; max-height: 200px; overflow-y: auto;"
            >
              <li
                v-for="prof in profesoresFiltrados"
                :key="prof.id"
                class="list-group-item list-group-item-action"
                @mousedown.prevent="seleccionarProfesor(prof)"
                style="cursor:pointer"
              >
                {{ prof.last_name }}, {{ prof.first_name }}
              </li>
            </ul>
            <button class="btn btn-primary mt-2" @click="verProfeSeleccionado">Buscar</button>
          </div>
          
          <div class="mb-3 position-relative">
            <label for="buscarAula" class="form-label">Busca un aula:</label>
            <input
              type="text"
              id="buscarAula"
              v-model="aulaInput"
              @input="onAulaInput"
              @focus="onAulaInput"
              @blur="onAulaBlur"
              class="form-control"
              autocomplete="off"
              placeholder="Escribe el número o nombre del aula"
            />
            <ul
              v-if="showAulaResults"
              class="list-group position-absolute w-100"
              style="z-index: 2000; max-height: 200px; overflow-y: auto;"
            >
              <li
                v-for="aula in aulasFiltradas"
                :key="aula"
                class="list-group-item list-group-item-action"
                @mousedown.prevent="seleccionarAula(aula)"
              >
                {{ aula }}
              </li>
            </ul>
            <button class="btn btn-primary mt-2" @click="verAula">Buscar</button>
          </div>
          <div class="mb-3 position-relative">
            <label for="buscarGrupo" class="form-label">Busca un grupo:</label>
            <input
              type="text"
              id="buscarGrupo"
              v-model="grupoInput"
              @input="onGrupoInput"
              @focus="onGrupoInput"
              @blur="onGrupoBlur"
              class="form-control"
              autocomplete="off"
              placeholder="Escribe el nombre del grupo"
            />
            <ul
              v-if="showGrupoResults"
              class="list-group position-absolute w-100 overflow-auto"
              style="z-index: 2000; max-height: 200px;"
            >
              <li
                v-for="grupo in gruposFiltrados"
                :key="grupo"
                class="list-group-item list-group-item-action"
                @mousedown.prevent="seleccionarGrupo(grupo)"
                style="cursor: pointer;"
              >
                {{ grupo }}
              </li>
            </ul>
            <button class="btn btn-primary mt-2" @click="verGrupo">Buscar</button>
          </div>
        </div>
      </transition>
    </div>
    
    <div v-if="usuarioActual.rol == 1 || usuarioActual.is_superuser == true">
      <p v-if="errorAulaGrupo" class="text-danger">Error al obtener aulas y grupos: {{ errorAulaGrupo }}</p>
      <p v-if="errorProfesores" class="text-danger">Error al obtener profesores: {{ errorProfesores }}</p>
      <p v-if="errorHorario" class="text-danger">Error al obtener tu horario: {{ errorHorario }}</p>

    </div>

    <h2>Tu horario</h2>
    <HorarioTable :horarios="horario" :dias="dias" :horas="horas" />
  </div>

</template>
<style scoped>
.card {
  position: relative;
  z-index: 1;
  overflow: visible !important;
}
.form-select {
  position: relative;
  z-index: 1050;
}
</style>
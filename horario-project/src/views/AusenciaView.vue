<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAusenciasFecha, getAusenciasProfe, getHorariosDia, 
  deleteAusencia, getGuardias, enviarParteAusencias, justificarAusencia } from '@/api/peticiones'
import { useUserStore } from '@/stores/usuario' 
import html2pdf from 'html2pdf.js';
import AusenciasUsuario from '@/components/AusenciasUsuario.vue';

function getDiaSemanaLetra(fecha) {
  const dias = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const jsDate = new Date(fecha);
  return dias[jsDate.getDay()];
}

function getFechaHoy() {
  const hoy = new Date()
  return hoy.toISOString().slice(0, 10)
}
function onFechaChange() {
  dia.value = getDiaSemanaLetra(fecha.value)
  cargarDatos()
}

const fecha = ref(getFechaHoy());
const dia = ref(getDiaSemanaLetra(fecha.value));
const horas = Array.from({ length: 14 }, (_, i) => i + 1)

const userStore = useUserStore();
const profesor = computed(() => userStore.usuario);

const guardias = ref([]);
const ausencias = ref([]);
const horarios = ref([]);
const error = ref(null);
const misAusencias = ref([]);
const pdfError = ref(null);
const loading = ref(false);

const cargarDatos = async () => {
  loading.value = true;
  
  try {
    profesor.value = userStore.getUser();
    ausencias.value = await getAusenciasFecha(fecha.value);
    if (profesor.value && profesor.value.id) {
      misAusencias.value = await getAusenciasProfe(profesor.value.id);
    } else {
      misAusencias.value = [];
    }
    horarios.value = await getHorariosDia(dia.value);
    guardias.value = await getGuardias(dia.value);
    misAusencias.value = [...misAusencias.value].sort((a,b)=> a.fecha - b.fecha)
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(cargarDatos)

// --- FUNCIONES PARA LA TABLA ---

function getProfesoresAusentesPorHora(hora) {
  // Devuelve los nombres de profesores ausentes en esa hora
  return ausencias.value
    .filter(a => a.horario && a.horario.hora == hora)
    .map(a => `${a.profesor.first_name} ${a.profesor.last_name}`)
    .filter((v, i, arr) => arr.indexOf(v) === i) // Únicos
    .join(', ');
}

function getProfesoresGuardiaPorHora(hora) {
  return guardias.value
    .filter(g => g.hora === hora)
    .map(g => `${g.profesor.first_name} ${g.profesor.last_name}`)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join(', ');
}

function getGruposSinProfesorPorHora(hora) {
  // Devuelve los nombres de grupos sin profesor en esa hora
  return ausencias.value
    .filter(a => a.horario && a.horario.hora === hora && a.horario.grupo)
    .map(a => a.horario.grupo.nombre)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join(', ');
}

function getAulasSinProfesorPorHora(hora) {
  // Devuelve los nombres de aulas sin profesor en esa hora
  return ausencias.value
    .filter(a => a.horario && a.horario.hora === hora && a.horario.aula)
    .map(a => a.horario.aula.numero)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join(', ');
}

// --- PDF y correo igual que antes ---

function descargarPDF() {
  const tabla = document.getElementById('tabla-ausencias');
  if (tabla) {
    html2pdf().from(tabla).set({
      margin: 0.5,
      filename: `parte_ausencias_${fecha.value}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    }).save();
  }
}

async function enviarPartePorCorreo() {
  const tabla = document.getElementById('tabla-ausencias');
  if (tabla) {
    const opt = {
      margin: 0.5,
      filename: `parte_ausencias_${fecha.value}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    const pdfBlob = await html2pdf().from(tabla).set(opt).outputPdf('blob');
    try{
      await enviarParteAusencias(pdfBlob);
    }catch (err){
      pdfError.value = 'Error al enviar el parte por correo.'
    }
  }
}
</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else>
    <div class="container mt-5">
      <h2>Parte de ausencias del {{ fecha }}</h2>
      <form class="d-flex align-items-center mb-3" @submit.prevent="onFechaChange">
        <label for="fecha" class="form-label me-2 mb-0">Selecciona fecha:</label>
        <div class="input-group" style="max-width: 220px;">
          <span class="input-group-text">
            <i class="bi bi-calendar"></i>
          </span>
          <input
            id="fecha"
            type="date"
            class="form-control"
            v-model="fecha"
          />
        </div>
        <button class="btn btn-primary ms-2" type="submit">Buscar</button>
      </form>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="['L','M','X','J','V'].includes(dia)">
        <h4>
          {{ dia === 'L' ? 'Lunes' : dia === 'M' ? 'Martes' : dia === 'X' ? 'Miércoles' : dia === 'J' ? 'Jueves' : 'Viernes' }}
          ({{ fecha }})
        </h4>
        <div class="table-responsive" id="tabla-ausencias">
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th class="bg-dark text-white text-center">Hora</th>
                <th class="bg-dark text-white text-center">Profesores Ausentes</th>
                <th class="bg-dark text-white text-center">Profesores de Guardia</th>
                <th class="bg-dark text-white text-center">Grupos sin Profesor</th>
                <th class="bg-dark text-white text-center">Aulas sin Profesor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="hora in horas" :key="hora">
                <td>{{ hora }}</td>
                <td>{{ getProfesoresAusentesPorHora(hora) || '-' }}</td>
                <td>{{ getProfesoresGuardiaPorHora(hora) || '-' }}</td>
                <td>{{ getGruposSinProfesorPorHora(hora) || '-' }}</td>
                <td>{{ getAulasSinProfesorPorHora(hora) || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="input-group">
          <button class="btn btn-primary mb-3" @click="descargarPDF">
            Descargar PDF
          </button>
          <button v-if="profesor.rol == 1 || profesor.is_superuser" class="btn btn-secondary mb-3 ms-2" @click="enviarPartePorCorreo">
            Enviar por correo
          </button>
        </div>
        <p v-if="pdfError" class="alert alert-danger">{{ pdfError }}</p>
      </div>
      <div v-else>
        <div class="alert alert-info">No hay parte de ausencias para hoy ({{ fecha }}).</div>
      </div>
    </div>
    <div class="container mt-5">
      <h2>Ausencias del usuario</h2>
      <div v-if="misAusencias.length > 0">
        <AusenciasUsuario
          :misAusencias="misAusencias"
          :profesor="profesor"
          @justificar="justificarAusencia"
          @eliminar="deleteAusencia"
        />
      </div>
      <div v-else>
        <div class="alert alert-info"><span class="text-dark">No hay ausencias registradas.</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-bordered > tbody > tr {
  border-bottom: 2px solid #dee2e6;
}
.table-bordered > tbody > tr > td {
  border-bottom: 2px solid #dee2e6;
}
</style>
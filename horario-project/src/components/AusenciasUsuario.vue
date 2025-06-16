<template>
  <div class="container mt-5">
    <h2>Ausencias del usuario</h2>
    <ul class="list-group" v-if="misAusencias.length > 0">
      <li
        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        v-for="ausencia in misAusencias"
        :key="ausencia.id"
        :class="{'bg-success bg-opacity-25': ausencia.justificada}"
        @click="$emit('ver-detalle', ausencia.id)"
        style="cursor:pointer"
      >
        {{ ausencia.fecha }} / {{ ausencia.horario?.hora || '-' }}
        <div v-if="profesor && (profesor.rol == 1 || profesor.is_superuser)">
          <button
            type="button"
            class="btn btn-outline-success btn-sm mx-2"
            @click.stop="$emit('justificar', ausencia.id)"
            :disabled="ausencia.justificada"
          >
            {{ ausencia.justificada ? 'Justificada' : 'Justificar' }}
          </button>
          <button
            type="button"
            class="btn btn-outline-danger btn-sm"
            @click.stop="pedirConfirmacion(ausencia.id)"
            >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
    <div v-else>
      <div class="alert alert-info"><span class="text-dark">No hay ausencias registradas.</span></div>
    </div>
    <ConfirmModal
      :visible="showModal"
      title="Confirmar eliminación"
      message="¿Estás seguro de que deseas eliminar esta ausencia?"
      @close="cancelarEliminacion"
      @confirm="confirmarEliminacion"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import ConfirmModal from './ConfirmModal.vue';

defineProps({
  misAusencias: Array,
  profesor: Object
})
const emit = defineEmits(['justificar', 'eliminar', 'ver-detalle'])

const showModal = ref(false);
const ausenciaAEliminar = ref(null);

function pedirConfirmacion(id) {
  ausenciaAEliminar.value = id;
  showModal.value = true;
}
function cancelarEliminacion() {
  showModal.value = false;
  ausenciaAEliminar.value = null;
}
function confirmarEliminacion() {
  emit('eliminar', ausenciaAEliminar.value);
  showModal.value = false;
  ausenciaAEliminar.value = null;
}
</script>
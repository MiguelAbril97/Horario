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
            @click.stop="$emit('eliminar', ausencia.id)"
            >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
    <div v-else>
      <div class="alert alert-info"><span class="text-dark">No hay ausencias registradas.</span></div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  misAusencias: Array,
  profesor: Object
})
defineEmits(['justificar', 'eliminar'])
</script>
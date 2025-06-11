<template>
  <div v-if="visible">
    <div class="modal-backdrop fade show"></div>
    <div class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalle de Ausencia</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body" v-if="ausencia">
            <p><strong>Fecha: </strong> {{ ausencia.fecha }}</p>
            <p><strong>Hora: </strong> {{ ausencia.horario.hora }}</p>
            <p>
              <strong>Justificada:</strong>
              <span :class="{'text-success': ausencia.justificada, 'text-danger': !ausencia.justificada}">
                {{ ausencia.justificada ? ' Sí' : ' No' }}
              </span>
            </p>
            <p><strong>Motivo: </strong> {{ ausencia.motivo || 'Sin especificar' }}</p>
          </div>
          <div class="modal-body" v-else>
            <div class="text-center">
              <div class="spinner-border text-primary" role="status"></div>
              <span class="ms-2">Cargando...</span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="$emit('close')">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  ausencia: Object
})
defineEmits(['close'])
</script>
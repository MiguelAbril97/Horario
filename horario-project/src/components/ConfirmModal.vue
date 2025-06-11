<!-- filepath: /horario-project/src/components/ConfirmModal.vue -->
<template>
    <teleport to="body">
      <div v-if="visible">
        <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5); z-index:1050;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ title }}</h5>
                <button type="button" class="btn-close" @click="$emit('close')"></button>
              </div>
              <div class="modal-body">
                <p>{{ message }}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancelar</button>
                <button type="button" class="btn btn-danger" @click="$emit('confirm')">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" style="z-index:1040;"></div>
      </div>
    </teleport>
  </template>
  
  <script setup>
  defineProps({
    visible: Boolean,
    title: String,
    message: String
  })
  </script>
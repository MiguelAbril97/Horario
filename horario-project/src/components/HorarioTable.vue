<template>
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead>
            <tr>
              <th class="bg-dark text-white text-center">Hora</th>
              <th v-for="dia in dias" :key="dia" class="bg-dark text-white text-center">{{ dia }}</th>
            </tr>
        </thead>
        <tbody>
          <tr v-for="hora in horas" :key="hora">
            <td>{{ hora }}</td>
            <template v-for="dia in dias" :key="dia">
              <td>
                <template v-for="h in horarios" :key="h.id">
                  <div v-if="h.hora === hora && h.dia === dia" class="d-flex flex-column">
                  <strong v-if="h.asignatura && h.asignatura.nombre" class="mb-1">{{ h.asignatura.nombre }}</strong>
                  <div v-if="h.aula && h.aula.numero" class="small">
                    <span class="fw-semibold">Aula:</span> 
                    <a :href="`/horario/aula/${h.aula.numero}`">
                      {{ h.aula.numero }}
                    </a>  
                  </div>
                  <div v-if="h.grupo && h.grupo.nombre" class="small">
                    <span class="fw-semibold">Grupo:</span>
                    <a :href="`/horario/grupo/${h.grupo.nombre}`">
                      {{ h.grupo.nombre }}
                    </a> 
                  </div>
                  <div v-if="h.profesor" class="small">
                    <span class="fw-semibold">Prof:</span>
                    <a :href="`/profesor/${h.profesor.id}`">
                      {{ h.profesor.first_name }} {{ h.profesor.last_name }}
                    </a>
                  </div>
                  <div v-if="h.hora" class="small">
                    <span class="fw-semibold">Hora:</span> {{ h.hora }}
                  </div>
                  </div>
                </template>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  defineProps({
    horarios: Array,
    dias: Array,
    horas: Array
  })
  </script>
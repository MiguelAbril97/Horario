import { createRouter, createWebHistory } from 'vue-router'
import HorarioView from '@/views/HorarioView.vue'
import Inicio from '@/views/Inicio.vue'
import LoginView from '@/views/LoginView.vue'
import AusenciaForm from '@/views/AusenciaForm.vue'
import AusenciaView from '@/views/AusenciaView.vue'
import { logout } from '@/api/peticiones.js'
import UsuarioForm from '@/views/UsuarioForm.vue'
import AboutView from '@/views/AboutView.vue'
import CargarHorarioView from '@/views/CargarHorarioView.vue'
import Aula_Grupo_View from '@/views/Aula_Grupo_View.vue'
import { useSesionStore } from '@/stores/sesion'
import RecuperarPassword from '@/views/RecuperarPassword.vue'
import ResetPassword from '@/views/ResetPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Inicio,
    },
    {
      path: '/profesor/:profesorId',
      name: 'profesor',
      component: HorarioView,
     
    },
    {
      path:'/login',
      name:'login',
      component: LoginView
    },
    {
      path: '/logout',
      name: 'logout',
      // Antes de entrar, revocamos tokens y vamos a login
      beforeEnter: (to, from, next) => {
        logout()                       
        next({ name: 'login' })       
      }
    },
    {
      path: '/ausencias',
      name:'ausencias',
      component:AusenciaView,
    },
    {
      path: '/ausencias/crear',
      name:'ausencia-crear',
      component:AusenciaForm,
    },
    {
      path:'/usuario/crear',
      name:'usuario-crear',
      component:UsuarioForm,
    },
    {
      path: '/usuario/ver/:id',
      name: 'usuario-ver',
      component: AboutView,
      props: true
    },
    {
      path: '/usuario/editar/:id',
      name: 'usuario-editar',
      component: UsuarioForm,
      props: true
    },
    {
      path: '/horario/subir',
      name: 'horario-subir',
      component: CargarHorarioView,
    },
    {
      path: '/horario/:tipo/:nombre',      
      name: 'aula-grupo-horario',
      component: Aula_Grupo_View,
    },
    {
      path: '/recuperar-password',      
      name: 'recuperar-password',
      component: RecuperarPassword,
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPassword,
      props: route => ({ token: route.query.token })  // recibimos el token de la URL
    },

  ],
})

router.beforeEach((to, from, next) => {
  const sesionStore = useSesionStore()
  const publicPages = ['login', 'password_reset']
  if (!publicPages.includes(to.name) && !sesionStore.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router

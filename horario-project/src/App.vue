<script setup>
import { RouterView } from 'vue-router'
import Menu from "./components/Menu.vue";
import { watch } from 'vue'
import { useSesionStore } from '@/stores/sesion'
import { useUserStore } from '@/stores/usuario'


const sesion = useSesionStore()
const userStore = useUserStore()

function loadChatbase() {
  if (document.getElementById('9pVXnzsBmOSXFU0PaGI80')) return
  const script = document.createElement('script')
  script.src = 'https://www.chatbase.co/embed.min.js'
  script.id = '9pVXnzsBmOSXFU0PaGI80'
  script.domain = 'www.chatbase.co'
  script.onload = () => {
    // Solo identifica al usuario una vez, cuando el script está listo
    if (window.chatbase) {
      const usuario = userStore.usuario
      window.chatbase("identify", {
        user_id: usuario.id,
        metadata: {
          name: usuario.nombre,
          email: userStore.usuario.email
        }
      })
    }
  }
  document.body.appendChild(script)
}

// Cargar solo si está autenticado
watch(
  () => sesion.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      loadChatbase()
    } else {
      // Eliminar el script
      const s = document.getElementById('9pVXnzsBmOSXFU0PaGI80')
      if (s) s.remove()

      // Función para eliminar burbuja e iframe de Chatbase
      function removeChatbaseElements() {
        // Elimina todos los iframes de Chatbase
        document.querySelectorAll('iframe').forEach(el => {
          if (el.src && el.src.includes('chatbase')) el.remove()
        })

        // Elimina cualquier div con id o clase que contenga 'chatbase'
        document.querySelectorAll('div, span').forEach(el => {
          if (
            (el.id && el.id.toLowerCase().includes('chatbase')) ||
            (el.className && el.className.toLowerCase().includes('chatbase'))
          ) {
            el.remove()
          }
        })
      }

      removeChatbaseElements()
      removeChatbaseElements()
      setTimeout(removeChatbaseElements, 200)
      setTimeout(removeChatbaseElements, 500)
      setTimeout(removeChatbaseElements, 1000)
      
    }
  },
  { immediate: true }
)
</script>

<template>
    <div id="app">
        <Menu/>
        <main class="container my-4">
        <RouterView />
        </main>

    </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>

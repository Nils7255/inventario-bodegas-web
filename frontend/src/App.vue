<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  AlertTriangle,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Package,
  Repeat,
  Truck,
  Users,
} from '@lucide/vue'

import { useAuthStore } from './stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const showShell = computed(() => route.name !== 'login' && auth.isAuthenticated)

const navigation = [
  { name: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { name: 'products', label: 'Productos', icon: Package },
  { name: 'suppliers', label: 'Proveedores', icon: Truck },
  { name: 'movements', label: 'Movimientos', icon: Repeat },
  { name: 'alerts', label: 'Alertas', icon: AlertTriangle },
  { name: 'users', label: 'Usuarios', icon: Users },
  { name: 'reports', label: 'Reportes', icon: BarChart3 },
]

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div v-if="showShell" class="app-shell">
    <aside class="app-sidebar">
      <div class="sidebar-brand">
        <span>IB</span>
        <div>
          <strong>Inventario</strong>
          <small>Bodegas Web</small>
        </div>
      </div>

      <nav class="sidebar-nav">
        <RouterLink v-for="item in navigation" :key="item.name" :to="{ name: item.name }">
          <component :is="item.icon" :size="17" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="sidebar-user">
        <div>
          <strong>{{ auth.user?.nombre || 'Usuario' }}</strong>
          <small>{{ auth.user?.rol || 'Sesion activa' }}</small>
        </div>
        <button type="button" title="Cerrar sesion" @click="logout">
          <LogOut :size="16" />
        </button>
      </div>
    </aside>

    <section class="app-content">
      <RouterView />
    </section>
  </div>

  <RouterView v-else />
</template>

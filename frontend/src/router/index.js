import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import AlertsView from '../views/AlertsView.vue'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import MovementsView from '../views/MovementsView.vue'
import ProductsView from '../views/ProductsView.vue'
import ReportsView from '../views/ReportsView.vue'
import SuppliersView from '../views/SuppliersView.vue'
import UsersView from '../views/UsersView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'dashboard' },
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/productos',
    name: 'products',
    component: ProductsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/proveedores',
    name: 'suppliers',
    component: SuppliersView,
    meta: { requiresAuth: true },
  },
  {
    path: '/movimientos',
    name: 'movements',
    component: MovementsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/alertas',
    name: 'alerts',
    component: AlertsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/usuarios',
    name: 'users',
    component: UsersView,
    meta: { requiresAuth: true },
  },
  {
    path: '/reportes',
    name: 'reports',
    component: ReportsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'home' }
  }

  return true
})

export default router

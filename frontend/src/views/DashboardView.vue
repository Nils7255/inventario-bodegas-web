<script setup>
import { computed, onMounted, ref } from 'vue'
import { AlertTriangle, ArrowDown, ArrowLeftRight, ArrowUp, Package, Truck } from '@lucide/vue'

import { getMovements } from '../services/movements'
import { getProducts } from '../services/products'
import { getSuppliers } from '../services/suppliers'

const products = ref([])
const suppliers = ref([])
const movements = ref([])
const loading = ref(false)
const error = ref('')

const criticalProducts = computed(() =>
  products.value.filter((product) => product.stock_actual <= product.stock_minimo)
)

const latestMovements = computed(() =>
  [...movements.value]
    .sort((first, second) => new Date(second.fecha) - new Date(first.fecha))
    .slice(0, 6)
)

const cards = computed(() => [
  {
    title: 'Total Productos',
    value: products.value.length,
    sub: 'Productos registrados',
    icon: Package,
    className: 'products',
  },
  {
    title: 'Total Proveedores',
    value: suppliers.value.length,
    sub: 'Proveedores registrados',
    icon: Truck,
    className: 'suppliers',
  },
  {
    title: 'Stock Critico',
    value: criticalProducts.value.length,
    sub: 'Requieren atencion',
    icon: AlertTriangle,
    className: 'critical',
  },
  {
    title: 'Movimientos',
    value: movements.value.length,
    sub: 'Movimientos registrados',
    icon: ArrowLeftRight,
    className: 'movements',
  },
])

async function loadDashboard() {
  loading.value = true
  error.value = ''

  try {
    const [productsResponse, suppliersResponse, movementsResponse] = await Promise.all([
      getProducts(),
      getSuppliers(),
      getMovements(),
    ])

    products.value = productsResponse.data
    suppliers.value = suppliersResponse.data
    movements.value = movementsResponse.data
  } catch (requestError) {
    error.value = 'No se pudo cargar el dashboard.'
  } finally {
    loading.value = false
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function formatTime(value) {
  return new Intl.DateTimeFormat('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

onMounted(loadDashboard)
</script>

<template>
  <main class="dashboard-page">
    <header class="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p>Resumen general del inventario</p>
      </div>
    </header>

    <p v-if="error" class="page-error">{{ error }}</p>

    <section class="kpi-grid">
      <article
        v-for="card in cards"
        :key="card.title"
        class="kpi-card"
        :class="card.className"
      >
        <div class="card-top">
          <span class="card-icon">
            <component :is="card.icon" :size="22" />
          </span>
        </div>
        <strong>{{ loading ? '-' : card.value }}</strong>
        <p>{{ card.title }}</p>
        <small>{{ card.sub }}</small>
      </article>
    </section>

    <section class="dashboard-panel">
      <header class="panel-header">
        <h2>Ultimos Movimientos</h2>
        <span>{{ latestMovements.length }} registros</span>
      </header>

      <div v-if="loading" class="empty-state">Cargando movimientos...</div>

      <table v-else>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movement in latestMovements" :key="movement.id">
            <td>
              <span class="type-pill" :class="movement.tipo">
                <ArrowDown v-if="movement.tipo === 'entrada'" :size="12" />
                <ArrowUp v-else :size="12" />
                {{ movement.tipo === 'entrada' ? 'Entrada' : 'Salida' }}
              </span>
            </td>
            <td>{{ movement.producto_nombre }}</td>
            <td>
              <strong>{{ movement.cantidad }}</strong>
            </td>
            <td>{{ movement.tipo === 'entrada' ? movement.proveedor_nombre || '-' : '-' }}</td>
            <td>{{ formatDate(movement.fecha) }}</td>
            <td>{{ formatTime(movement.fecha) }}</td>
            <td>{{ movement.usuario_nombre }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && latestMovements.length === 0" class="empty-state">
        No hay movimientos registrados
      </div>
    </section>
  </main>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding: 24px;
  color: #1f2937;
  background: #f8fafc;
  font-family: Inter, system-ui, sans-serif;
}

.dashboard-header {
  margin-bottom: 20px;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  color: #1f2937;
  font-size: 22px;
  font-weight: 600;
}

.dashboard-header p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
}

.page-error {
  margin-bottom: 12px;
  color: #dc2626;
  font-size: 14px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.kpi-card {
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #ffffff;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.card-top {
  display: flex;
  justify-content: space-between;
}

.card-icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 10px;
  color: #ffffff;
}

.kpi-card.products .card-icon {
  background: #1a3c5e;
}

.kpi-card.suppliers .card-icon {
  background: #2e7d5e;
}

.kpi-card.critical .card-icon {
  background: #e8861a;
}

.kpi-card.movements .card-icon {
  background: #5b3ead;
}

.kpi-card strong {
  display: block;
  margin-top: 14px;
  color: #1f2937;
  font-size: 26px;
  line-height: 1.1;
}

.kpi-card p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
}

.kpi-card small {
  display: block;
  margin-top: 4px;
  color: #9ca3af;
  font-size: 12px;
}

.dashboard-panel {
  overflow: hidden;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

h2 {
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
}

.panel-header span {
  border-radius: 999px;
  padding: 4px 10px;
  color: #1a3c5e;
  background: #eff6ff;
  font-size: 12px;
  font-weight: 600;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead tr {
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
}

th {
  padding: 12px 16px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
}

td {
  padding: 12px 16px;
  border-top: 1px solid #f9fafb;
  color: #6b7280;
  font-size: 13px;
}

tbody tr:hover {
  background: #f9fafb;
}

.type-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
}

.type-pill.entrada {
  color: #059669;
  background: #ecfdf5;
}

.type-pill.salida {
  color: #e8861a;
  background: #fff7ed;
}

.empty-state {
  padding: 48px 20px;
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
}
</style>

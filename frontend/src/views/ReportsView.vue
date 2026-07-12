<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { BarChart3, CalendarDays, Filter, Package, TriangleAlert } from '@lucide/vue'

import {
  getInventorySummary,
  getReportMovements,
  getReportProducts,
} from '../services/reports'

const summary = ref(null)
const products = ref([])
const movements = ref([])
const loading = ref(false)
const error = ref('')
const generated = ref(false)

const filters = reactive({
  startDate: '',
  endDate: '',
  type: 'todos',
})

const inventoryValue = computed(() =>
  products.value.reduce((total, product) => {
    return total + Number(product.stock_actual || 0) * Number(product.precio_compra || 0)
  }, 0)
)

const criticalProducts = computed(() =>
  summary.value?.productos_stock_bajo ??
  products.value.filter((product) => product.stock_actual <= product.stock_minimo).length
)

const filteredMovements = computed(() => {
  return movements.value.filter((movement) => {
    const movementDate = movement.fecha.slice(0, 10)
    const matchesStart = !filters.startDate || movementDate >= filters.startDate
    const matchesEnd = !filters.endDate || movementDate <= filters.endDate
    const matchesType = filters.type === 'todos' || movement.tipo === filters.type

    return matchesStart && matchesEnd && matchesType
  })
})

async function loadReports() {
  loading.value = true
  error.value = ''

  try {
    const [summaryResponse, productsResponse, movementsResponse] = await Promise.all([
      getInventorySummary(),
      getReportProducts(),
      getReportMovements(),
    ])

    summary.value = summaryResponse.data
    products.value = productsResponse.data
    movements.value = movementsResponse.data
    generated.value = true
  } catch (requestError) {
    error.value = 'No se pudo cargar reportes.'
  } finally {
    loading.value = false
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(value)
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

onMounted(loadReports)
</script>

<template>
  <main class="reports-page">
    <header class="reports-header">
      <div>
        <h1>Reportes</h1>
        <p>Resumen de inventario y movimientos del sistema</p>
      </div>
    </header>

    <section class="summary-grid">
      <article class="summary-card">
        <span class="summary-icon products">
          <Package :size="22" />
        </span>
        <div>
          <strong>{{ loading ? '-' : summary?.productos || products.length }}</strong>
          <p>Total de productos</p>
        </div>
      </article>

      <article class="summary-card">
        <span class="summary-icon value">
          <BarChart3 :size="22" />
        </span>
        <div>
          <strong>{{ loading ? '-' : formatCurrency(inventoryValue) }}</strong>
          <p>Valor total del inventario</p>
        </div>
      </article>

      <article class="summary-card">
        <span class="summary-icon critical">
          <TriangleAlert :size="22" />
        </span>
        <div>
          <strong>{{ loading ? '-' : criticalProducts }}</strong>
          <p>Productos con stock critico</p>
        </div>
      </article>
    </section>

    <section class="filters-panel">
      <div class="filter-title">
        <Filter :size="15" />
        <span>Filtros</span>
      </div>

      <label>
        Desde
        <span class="date-field">
          <CalendarDays :size="15" />
          <input v-model="filters.startDate" type="date" />
        </span>
      </label>

      <label>
        Hasta
        <span class="date-field">
          <CalendarDays :size="15" />
          <input v-model="filters.endDate" type="date" />
        </span>
      </label>

      <label>
        Tipo
        <select v-model="filters.type">
          <option value="todos">Todos</option>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>
      </label>

      <button class="primary-button" type="button" @click="loadReports">
        Generar
      </button>
    </section>

    <p v-if="error" class="page-error">{{ error }}</p>

    <section class="reports-table-card">
      <header class="table-header">
        <h2>Reporte de movimientos</h2>
        <span>{{ filteredMovements.length }} registros</span>
      </header>

      <div v-if="loading" class="empty-state">Generando reporte...</div>

      <table v-else>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movement in filteredMovements" :key="movement.id">
            <td>{{ formatDate(movement.fecha) }}</td>
            <td>{{ movement.producto_nombre }}</td>
            <td>
              <span class="type-pill" :class="movement.tipo">
                {{ movement.tipo === 'entrada' ? 'Entrada' : 'Salida' }}
              </span>
            </td>
            <td>
              <strong>{{ movement.cantidad }}</strong>
            </td>
            <td>{{ movement.usuario_nombre }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && generated && filteredMovements.length === 0" class="empty-state">
        No se encontraron movimientos
      </div>
    </section>
  </main>
</template>

<style scoped>
.reports-page {
  min-height: 100vh;
  padding: 24px;
  color: #1f2937;
  background: #f8fafc;
  font-family: Inter, system-ui, sans-serif;
}

.reports-header {
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

.reports-header p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #ffffff;
  padding: 18px 20px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.summary-icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 10px;
  color: #ffffff;
}

.summary-icon.products {
  background: #1a3c5e;
}

.summary-icon.value {
  background: #2e7d5e;
}

.summary-icon.critical {
  background: #e8861a;
}

.summary-card strong {
  display: block;
  color: #1f2937;
  font-size: 24px;
  line-height: 1.1;
}

.summary-card p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
}

.filters-panel {
  display: flex;
  align-items: end;
  gap: 12px;
  margin-bottom: 20px;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #ffffff;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
}

.filters-panel label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
}

.date-field {
  position: relative;
  display: block;
}

.date-field svg {
  position: absolute;
  top: 50%;
  left: 10px;
  color: #9ca3af;
  transform: translateY(-50%);
}

.filters-panel input,
.filters-panel select {
  width: 180px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  color: #374151;
  background: #ffffff;
  outline: none;
  font-size: 14px;
}

.date-field input {
  padding-left: 34px;
}

.filters-panel input:focus,
.filters-panel select:focus {
  border-color: #1a3c5e;
}

button {
  border: 0;
  cursor: pointer;
  font: inherit;
}

.primary-button {
  min-height: 38px;
  border-radius: 8px;
  padding: 10px 16px;
  color: #ffffff;
  background: #1a3c5e;
  font-size: 14px;
  font-weight: 600;
}

.primary-button:hover {
  opacity: 0.9;
}

.page-error {
  margin-bottom: 12px;
  color: #dc2626;
  font-size: 14px;
}

.reports-table-card {
  overflow: hidden;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.table-header {
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

.table-header span {
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
  padding: 12px 20px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
}

td {
  padding: 12px 20px;
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

<script setup>
import { computed, onMounted, ref } from 'vue'
import { AlertTriangle, Search } from '@lucide/vue'

import { getAlerts } from '../services/alerts'

const alerts = ref([])
const loading = ref(false)
const error = ref('')
const search = ref('')

const filteredAlerts = computed(() => {
  const text = search.value.trim().toLowerCase()

  if (!text) return alerts.value

  return alerts.value.filter((alert) =>
    alert.producto_nombre.toLowerCase().includes(text)
  )
})

const pendingAlerts = computed(() =>
  alerts.value.filter((alert) => !alert.atendida).length
)

async function loadAlerts() {
  loading.value = true
  error.value = ''

  try {
    const { data } = await getAlerts()
    alerts.value = data
  } catch (requestError) {
    error.value = 'No se pudo cargar alertas.'
  } finally {
    loading.value = false
  }
}

function alertStatus(alert) {
  if (alert.atendida) {
    return { label: 'Atendida', className: 'status-ok' }
  }

  if (alert.stock_actual <= alert.stock_minimo * 0.5) {
    return { label: 'Critico', className: 'status-critical' }
  }

  return { label: 'Bajo', className: 'status-low' }
}

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

onMounted(loadAlerts)
</script>

<template>
  <main class="alerts-page">
    <header class="alerts-header">
      <div>
        <h1>Alertas</h1>
        <p>Productos con stock critico</p>
      </div>
    </header>

    <section class="summary-grid">
      <article class="summary-card">
        <span class="summary-icon">
          <AlertTriangle :size="22" />
        </span>
        <div>
          <strong>{{ loading ? '-' : alerts.length }}</strong>
          <p>Total alertas</p>
        </div>
      </article>

      <article class="summary-card warning">
        <span class="summary-icon">
          <AlertTriangle :size="22" />
        </span>
        <div>
          <strong>{{ loading ? '-' : pendingAlerts }}</strong>
          <p>Pendientes</p>
        </div>
      </article>
    </section>

    <section class="filters-row">
      <div class="search-box">
        <Search :size="15" />
        <input v-model="search" type="search" placeholder="Buscar producto..." />
      </div>
    </section>

    <p v-if="error" class="page-error">{{ error }}</p>

    <section class="alerts-table-card">
      <div v-if="loading" class="empty-state">Cargando alertas...</div>

      <table v-else>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Stock Actual</th>
            <th>Stock Minimo</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alert in filteredAlerts" :key="alert.id">
            <td>
              <div class="product-cell">
                <span class="product-icon">
                  <AlertTriangle :size="14" />
                </span>
                <strong>{{ alert.producto_nombre }}</strong>
              </div>
            </td>
            <td>
              <strong :class="alertStatus(alert).className">{{ alert.stock_actual }}</strong>
            </td>
            <td>{{ alert.stock_minimo }}</td>
            <td>
              <span class="status-pill" :class="alertStatus(alert).className">
                {{ alertStatus(alert).label }}
              </span>
            </td>
            <td>{{ formatDate(alert.fecha) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && filteredAlerts.length === 0" class="empty-state">
        No se encontraron alertas
      </div>
    </section>
  </main>
</template>

<style scoped>
.alerts-page {
  min-height: 100vh;
  padding: 24px;
  color: #1f2937;
  background: #f8fafc;
  font-family: Inter, system-ui, sans-serif;
}

.alerts-header {
  margin-bottom: 20px;
}

h1,
p {
  margin: 0;
}

h1 {
  color: #1f2937;
  font-size: 22px;
  font-weight: 600;
}

.alerts-header p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  background: #1a3c5e;
}

.summary-card.warning .summary-icon {
  background: #e8861a;
}

.summary-card strong {
  display: block;
  color: #1f2937;
  font-size: 26px;
  line-height: 1.1;
}

.summary-card p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
}

.filters-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-box {
  position: relative;
  width: 320px;
}

.search-box svg {
  position: absolute;
  top: 50%;
  left: 12px;
  color: #9ca3af;
  transform: translateY(-50%);
}

.search-box input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px 10px 36px;
  color: #374151;
  background: #ffffff;
  outline: none;
  font-size: 14px;
}

.search-box input:focus {
  border-color: #1a3c5e;
}

.page-error {
  margin-bottom: 12px;
  color: #dc2626;
  font-size: 14px;
}

.alerts-table-card {
  overflow: hidden;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
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

.product-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-icon {
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  place-items: center;
  border-radius: 8px;
  color: #e8861a;
  background: #fff7ed;
}

.product-cell strong {
  color: #1f2937;
  font-size: 13px;
  font-weight: 600;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
}

.status-ok {
  color: #059669;
}

.status-pill.status-ok {
  background: #ecfdf5;
}

.status-low {
  color: #e8861a;
}

.status-pill.status-low {
  background: #fff3e0;
}

.status-critical {
  color: #dc2626;
}

.status-pill.status-critical {
  background: #fee2e2;
}

.empty-state {
  padding: 48px 20px;
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
}
</style>

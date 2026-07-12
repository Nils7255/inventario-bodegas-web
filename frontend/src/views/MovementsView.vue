<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ArrowDown, ArrowUp, Filter, Plus, X } from '@lucide/vue'

import { createMovement, getMovements } from '../services/movements'
import { getProducts } from '../services/products'
import { getSuppliers } from '../services/suppliers'

const movements = ref([])
const products = ref([])
const suppliers = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')
const formError = ref('')
const showForm = ref(false)
const typeFilter = ref('todos')
const notesByMovement = ref(loadStoredNotes())

const form = reactive({
  tipo: 'entrada',
  producto: '',
  proveedor: '',
  cantidad: '',
  fecha: new Date().toISOString().slice(0, 10),
  costo_unitario: '',
  observaciones: '',
})

const filteredMovements = computed(() => {
  if (typeFilter.value === 'todos') return movements.value
  return movements.value.filter((movement) => movement.tipo === typeFilter.value)
})

const totalEntradas = computed(() =>
  movements.value
    .filter((movement) => movement.tipo === 'entrada')
    .reduce((total, movement) => total + Number(movement.cantidad), 0)
)

const totalSalidas = computed(() =>
  movements.value
    .filter((movement) => movement.tipo === 'salida')
    .reduce((total, movement) => total + Number(movement.cantidad), 0)
)

function loadStoredNotes() {
  return JSON.parse(localStorage.getItem('movement_notes') || '{}')
}

function storeNote(movementId, note) {
  if (!note.trim()) return

  notesByMovement.value = {
    ...notesByMovement.value,
    [movementId]: note.trim(),
  }
  localStorage.setItem('movement_notes', JSON.stringify(notesByMovement.value))
}

async function loadData() {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const [movementsResponse, productsResponse, suppliersResponse] = await Promise.all([
      getMovements(),
      getProducts(),
      getSuppliers(),
    ])

    movements.value = movementsResponse.data
    products.value = productsResponse.data
    suppliers.value = suppliersResponse.data.filter((supplier) => supplier.activo)
  } catch (requestError) {
    error.value = 'No se pudo cargar movimientos de inventario.'
  } finally {
    loading.value = false
  }
}

function openCreate(type = 'entrada') {
  form.tipo = type
  form.producto = products.value[0]?.id || ''
  form.proveedor = suppliers.value[0]?.id || ''
  form.cantidad = ''
  form.fecha = new Date().toISOString().slice(0, 10)
  form.costo_unitario = ''
  form.observaciones = ''
  formError.value = ''
  showForm.value = true
}

function validateForm() {
  if (!form.producto) return 'Selecciona un producto.'
  if (!form.cantidad || Number(form.cantidad) <= 0) return 'La cantidad debe ser mayor a cero.'
  if (!form.fecha) return 'Selecciona una fecha.'
  if (form.tipo === 'entrada' && !form.proveedor) return 'Selecciona un proveedor.'
  if (form.tipo === 'entrada' && Number(form.costo_unitario) < 0) {
    return 'El costo unitario no puede ser negativo.'
  }
  return ''
}

async function submitMovement() {
  const validationMessage = validateForm()

  if (validationMessage) {
    formError.value = validationMessage
    return
  }

  saving.value = true
  formError.value = ''
  success.value = ''

  const payload = {
    producto: form.producto,
    proveedor: form.tipo === 'entrada' ? form.proveedor : null,
    tipo: form.tipo,
    cantidad: Number(form.cantidad),
    fecha: `${form.fecha}T00:00:00-05:00`,
    costo_unitario: form.tipo === 'entrada' && form.costo_unitario !== ''
      ? form.costo_unitario
      : null,
  }

  try {
    const { data } = await createMovement(payload)
    storeNote(data.id, form.observaciones)
    movements.value = [data, ...movements.value]
    showForm.value = false
    success.value = 'Movimiento registrado correctamente.'
  } catch (requestError) {
    formError.value = 'No se pudo registrar el movimiento. Verifica el stock disponible.'
  } finally {
    saving.value = false
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function movementNote(movementId) {
  return notesByMovement.value[movementId] || 'Sin observaciones'
}

onMounted(loadData)
</script>

<template>
  <main class="movements-page">
    <header class="movements-header">
      <div>
        <h1>Movimientos</h1>
        <p>Registro de entradas y salidas de inventario</p>
      </div>

      <div class="header-actions">
        <button class="primary-button" type="button" @click="openCreate('entrada')">
          <Plus :size="16" />
          Nueva Entrada
        </button>
        <button class="secondary-action" type="button" @click="openCreate('salida')">
          <Plus :size="16" />
          Nueva Salida
        </button>
      </div>
    </header>

    <section class="summary-grid">
      <article class="summary-card">
        <p>Total Movimientos</p>
        <strong>{{ movements.length }}</strong>
      </article>
      <article class="summary-card success">
        <p>Total Entradas</p>
        <strong>{{ totalEntradas }} unidades</strong>
      </article>
      <article class="summary-card warning">
        <p>Total Salidas</p>
        <strong>{{ totalSalidas }} unidades</strong>
      </article>
    </section>

    <section class="filter-row">
      <Filter :size="14" />
      <button
        v-for="filter in [
          { label: 'Todos', value: 'todos' },
          { label: 'Entrada', value: 'entrada' },
          { label: 'Salida', value: 'salida' },
        ]"
        :key="filter.value"
        type="button"
        :class="{ active: typeFilter === filter.value }"
        @click="typeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </section>

    <p v-if="error" class="page-error">{{ error }}</p>
    <p v-if="success" class="page-success">{{ success }}</p>

    <section class="movements-table-card">
      <div v-if="loading" class="empty-state">Cargando movimientos...</div>

      <table v-else>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Costo Unit.</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Usuario</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movement in filteredMovements" :key="movement.id">
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
            <td>
              <span v-if="movement.tipo === 'entrada'">
                S/ {{ Number(movement.costo_unitario || 0).toFixed(2) }}
              </span>
              <span v-else>-</span>
            </td>
            <td>{{ movement.tipo === 'entrada' ? movement.proveedor_nombre || '-' : '-' }}</td>
            <td>{{ formatDate(movement.fecha) }}</td>
            <td>{{ movement.usuario_nombre }}</td>
            <td>{{ movementNote(movement.id) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && filteredMovements.length === 0" class="empty-state">
        No se encontraron movimientos
      </div>
    </section>

    <div v-if="showForm" class="modal-backdrop">
      <section class="modal-panel" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h2>{{ form.tipo === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida' }}</h2>
          <button type="button" title="Cerrar formulario" @click="showForm = false">
            <X :size="18" />
          </button>
        </header>

        <form class="movement-form" @submit.prevent="submitMovement">
          <label>
            Tipo
            <select v-model="form.tipo">
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </label>

          <label>
            Producto
            <select v-model="form.producto" required>
              <option value="" disabled>Seleccionar</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.nombre }}
              </option>
            </select>
          </label>

          <label>
            Cantidad
            <input v-model="form.cantidad" type="number" min="1" step="1" required />
          </label>

          <label>
            Fecha
            <input v-model="form.fecha" type="date" required />
          </label>

          <label v-if="form.tipo === 'entrada'">
            Proveedor
            <select v-model="form.proveedor" required>
              <option value="" disabled>Seleccionar</option>
              <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                {{ supplier.nombre }}
              </option>
            </select>
          </label>

          <label v-if="form.tipo === 'entrada'">
            Costo Unitario (S/)
            <input v-model="form.costo_unitario" type="number" min="0" step="0.01" />
          </label>

          <label class="span-2">
            Observaciones
            <input v-model="form.observaciones" type="text" />
          </label>

          <p v-if="formError" class="form-error span-2">{{ formError }}</p>

          <footer class="form-actions span-2">
            <button class="secondary-button" type="button" @click="showForm = false">
              Cancelar
            </button>
            <button class="primary-button" type="submit" :disabled="saving">
              {{ saving ? 'Registrando...' : 'Registrar Movimiento' }}
            </button>
          </footer>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.movements-page {
  min-height: 100vh;
  padding: 24px;
  color: #1f2937;
  background: #f8fafc;
  font-family: Inter, system-ui, sans-serif;
}

.movements-header,
.header-actions,
.filter-row,
.form-actions {
  display: flex;
  align-items: center;
}

.movements-header {
  justify-content: space-between;
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

.movements-header p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
}

.header-actions {
  gap: 10px;
}

button {
  border: 0;
  cursor: pointer;
  font: inherit;
}

.primary-button,
.secondary-button,
.secondary-action {
  border-radius: 8px;
  transition: opacity 0.2s ease, background-color 0.2s ease;
}

.primary-button,
.secondary-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
}

.primary-button {
  color: #ffffff;
  background: #1a3c5e;
}

.secondary-action {
  color: #1a3c5e;
  background: #eff6ff;
}

.primary-button:hover,
.secondary-action:hover {
  opacity: 0.9;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.secondary-button {
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  background: #ffffff;
  font-size: 14px;
}

.secondary-button:hover,
.modal-header button:hover {
  background: #f3f4f6;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #ffffff;
  padding: 16px 20px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.summary-card p {
  color: #6b7280;
  font-size: 13px;
}

.summary-card strong {
  display: block;
  margin-top: 4px;
  color: #1a3c5e;
  font-size: 22px;
  line-height: 1.2;
}

.summary-card.success strong {
  color: #059669;
}

.summary-card.warning strong {
  color: #e8861a;
}

.filter-row {
  gap: 8px;
  margin-bottom: 20px;
  color: #9ca3af;
}

.filter-row button {
  padding: 7px 12px;
  border-radius: 8px;
  color: #6b7280;
  background: #f3f4f6;
  font-size: 13px;
}

.filter-row button.active {
  color: #ffffff;
  background: #1a3c5e;
}

.page-error,
.form-error {
  color: #dc2626;
  font-size: 14px;
}

.page-error {
  margin-bottom: 12px;
}

.movements-table-card {
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

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.45);
}

.modal-panel {
  width: min(100% - 32px, 560px);
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.modal-header button {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 8px;
  color: #9ca3af;
  background: transparent;
}

h2 {
  color: #1f2937;
  font-size: 17px;
  font-weight: 600;
}

.movement-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px 24px 24px;
}

.movement-form label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
}

.movement-form input,
.movement-form select {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  color: #374151;
  background: #ffffff;
  outline: none;
  font-size: 14px;
}

.movement-form input:focus,
.movement-form select:focus {
  border-color: #1a3c5e;
}

.span-2 {
  grid-column: span 2;
}

.form-actions {
  justify-content: flex-end;
  gap: 12px;
  padding-top: 4px;
}
</style>

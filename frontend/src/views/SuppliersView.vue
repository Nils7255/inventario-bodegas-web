<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Edit2, LogOut, Mail, MapPin, Phone, Plus, Trash2, Truck, X } from '@lucide/vue'

import {
  createSupplier,
  deactivateSupplier,
  getSuppliers,
  updateSupplier,
} from '../services/suppliers'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const suppliers = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const formError = ref('')
const showForm = ref(false)
const editingSupplier = ref(null)

const form = reactive({
  nombre: '',
  contacto: '',
  telefono: '',
  correo: '',
  direccion: '',
  condiciones_pago: '',
  activo: true,
})

const activeSuppliers = computed(() =>
  suppliers.value.filter((supplier) => supplier.activo).length
)

const inactiveSuppliers = computed(() =>
  suppliers.value.filter((supplier) => !supplier.activo).length
)

async function loadSuppliers() {
  loading.value = true
  error.value = ''

  try {
    const { data } = await getSuppliers()
    suppliers.value = data
  } catch (requestError) {
    error.value = 'No se pudo cargar proveedores.'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.nombre = ''
  form.contacto = ''
  form.telefono = ''
  form.correo = ''
  form.direccion = ''
  form.condiciones_pago = ''
  form.activo = true
  formError.value = ''
  editingSupplier.value = null
}

function openCreate() {
  resetForm()
  showForm.value = true
}

function openEdit(supplier) {
  editingSupplier.value = supplier
  form.nombre = supplier.nombre
  form.contacto = supplier.contacto
  form.telefono = supplier.telefono
  form.correo = supplier.correo
  form.direccion = supplier.direccion
  form.condiciones_pago = supplier.condiciones_pago
  form.activo = supplier.activo
  formError.value = ''
  showForm.value = true
}

function validateForm() {
  if (!form.nombre.trim()) return 'El nombre es obligatorio.'
  if (form.correo && !form.correo.includes('@')) return 'Ingresa un correo valido.'
  return ''
}

async function submitSupplier() {
  const validationMessage = validateForm()

  if (validationMessage) {
    formError.value = validationMessage
    return
  }

  saving.value = true
  formError.value = ''

  const payload = {
    nombre: form.nombre.trim(),
    contacto: form.contacto.trim(),
    telefono: form.telefono.trim(),
    correo: form.correo.trim(),
    direccion: form.direccion.trim(),
    condiciones_pago: form.condiciones_pago.trim(),
    activo: form.activo,
  }

  try {
    if (editingSupplier.value) {
      const { data } = await updateSupplier(editingSupplier.value.id, payload)
      suppliers.value = suppliers.value.map((supplier) =>
        supplier.id === data.id ? data : supplier
      )
    } else {
      const { data } = await createSupplier(payload)
      suppliers.value = [...suppliers.value, data]
    }

    showForm.value = false
  } catch (requestError) {
    formError.value = 'No se pudo guardar el proveedor. Revisa los datos ingresados.'
  } finally {
    saving.value = false
  }
}

async function handleDeactivate(supplier) {
  const confirmed = window.confirm(`Desactivar ${supplier.nombre}?`)

  if (!confirmed) return

  error.value = ''

  try {
    const { data } = await deactivateSupplier(supplier.id)
    suppliers.value = suppliers.value.map((item) =>
      item.id === data.id ? data : item
    )
  } catch (requestError) {
    error.value = 'No se pudo desactivar el proveedor.'
  }
}

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}

onMounted(loadSuppliers)
</script>

<template>
  <main class="suppliers-page">
    <header class="suppliers-header">
      <div>
        <h1>Proveedores</h1>
        <p>{{ suppliers.length }} proveedores registrados</p>
      </div>

      <div class="header-actions">
        <nav class="module-nav">
          <RouterLink :to="{ name: 'products' }">Productos</RouterLink>
          <RouterLink :to="{ name: 'suppliers' }">Proveedores</RouterLink>
        </nav>
        <button class="logout-button" type="button" title="Cerrar sesion" @click="logout">
          <LogOut :size="16" />
        </button>
        <button class="primary-button" type="button" @click="openCreate">
          <Plus :size="16" />
          Nuevo Proveedor
        </button>
      </div>
    </header>

    <section class="summary-grid">
      <article class="summary-card">
        <p>Total Proveedores</p>
        <strong>{{ suppliers.length }}</strong>
      </article>
      <article class="summary-card success">
        <p>Activos</p>
        <strong>{{ activeSuppliers }}</strong>
      </article>
      <article class="summary-card warning">
        <p>Inactivos</p>
        <strong>{{ inactiveSuppliers }}</strong>
      </article>
    </section>

    <p v-if="error" class="page-error">{{ error }}</p>

    <section class="suppliers-table-card">
      <div v-if="loading" class="empty-state">Cargando proveedores...</div>

      <table v-else>
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Contacto</th>
            <th>Direccion</th>
            <th>Condiciones</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supplier in suppliers" :key="supplier.id">
            <td>
              <div class="supplier-cell">
                <span class="supplier-icon">
                  <Truck :size="14" />
                </span>
                <div>
                  <strong>{{ supplier.nombre }}</strong>
                  <small>{{ supplier.contacto || 'Sin contacto' }}</small>
                </div>
              </div>
            </td>
            <td>
              <div class="contact-lines">
                <span>
                  <Phone :size="12" />
                  {{ supplier.telefono || 'Sin telefono' }}
                </span>
                <span>
                  <Mail :size="12" />
                  {{ supplier.correo || 'Sin correo' }}
                </span>
              </div>
            </td>
            <td>
              <span class="address-line">
                <MapPin :size="13" />
                {{ supplier.direccion || 'Sin direccion' }}
              </span>
            </td>
            <td>{{ supplier.condiciones_pago || 'No registradas' }}</td>
            <td>
              <span class="status-pill" :class="supplier.activo ? 'status-ok' : 'status-inactive'">
                {{ supplier.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="row-actions">
                <button type="button" title="Editar proveedor" @click="openEdit(supplier)">
                  <Edit2 :size="14" />
                </button>
                <button
                  type="button"
                  title="Desactivar proveedor"
                  :disabled="!supplier.activo"
                  @click="handleDeactivate(supplier)"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && suppliers.length === 0" class="empty-state">
        No se encontraron proveedores
      </div>
    </section>

    <div v-if="showForm" class="modal-backdrop">
      <section class="modal-panel" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h2>{{ editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor' }}</h2>
          <button type="button" title="Cerrar formulario" @click="showForm = false">
            <X :size="18" />
          </button>
        </header>

        <form class="supplier-form" @submit.prevent="submitSupplier">
          <label class="span-2">
            Nombre / Razon Social
            <input v-model="form.nombre" type="text" required />
          </label>

          <label>
            Contacto
            <input v-model="form.contacto" type="text" />
          </label>

          <label>
            Telefono
            <input v-model="form.telefono" type="text" />
          </label>

          <label>
            Correo Electronico
            <input v-model="form.correo" type="email" />
          </label>

          <label>
            Estado
            <select v-model="form.activo">
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </label>

          <label class="span-2">
            Direccion
            <input v-model="form.direccion" type="text" />
          </label>

          <label class="span-2">
            Condiciones de Pago
            <input v-model="form.condiciones_pago" type="text" />
          </label>

          <p v-if="formError" class="form-error span-2">{{ formError }}</p>

          <footer class="form-actions span-2">
            <button class="secondary-button" type="button" @click="showForm = false">
              Cancelar
            </button>
            <button class="primary-button" type="submit" :disabled="saving">
              {{ saving ? 'Guardando...' : editingSupplier ? 'Guardar Cambios' : 'Registrar Proveedor' }}
            </button>
          </footer>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.suppliers-page {
  min-height: 100vh;
  padding: 24px;
  color: #1f2937;
  background: #f8fafc;
  font-family: Inter, system-ui, sans-serif;
}

.suppliers-header,
.header-actions,
.module-nav,
.supplier-cell,
.row-actions,
.form-actions,
.address-line,
.contact-lines span {
  display: flex;
  align-items: center;
}

.suppliers-header {
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

.suppliers-header p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
}

.header-actions {
  gap: 10px;
}

.module-nav {
  gap: 6px;
}

.module-nav a {
  padding: 9px 12px;
  border-radius: 8px;
  color: #6b7280;
  background: #f3f4f6;
  font-size: 13px;
  text-decoration: none;
}

.module-nav a.router-link-active {
  color: #ffffff;
  background: #1a3c5e;
}

button {
  border: 0;
  cursor: pointer;
  font: inherit;
}

.primary-button,
.secondary-button,
.logout-button {
  border-radius: 8px;
  transition: opacity 0.2s ease, background-color 0.2s ease;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: #ffffff;
  background: #1a3c5e;
  font-size: 14px;
  font-weight: 600;
}

.primary-button:hover {
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
.logout-button:hover,
.row-actions button:hover,
.modal-header button:hover {
  background: #f3f4f6;
}

.logout-button {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  color: #6b7280;
  background: #ffffff;
  border: 1px solid #e5e7eb;
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
  font-size: 26px;
  line-height: 1.2;
}

.summary-card.success strong {
  color: #059669;
}

.summary-card.warning strong {
  color: #e8861a;
}

.page-error,
.form-error {
  color: #dc2626;
  font-size: 14px;
}

.page-error {
  margin-bottom: 12px;
}

.suppliers-table-card {
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

.supplier-cell {
  gap: 10px;
}

.supplier-icon {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  border-radius: 8px;
  color: #1a3c5e;
  background: #eff6ff;
}

.supplier-cell strong {
  display: block;
  color: #1f2937;
  font-size: 13px;
  font-weight: 600;
}

.supplier-cell small {
  display: block;
  margin-top: 3px;
  color: #9ca3af;
  font-size: 11px;
}

.contact-lines {
  display: grid;
  gap: 4px;
}

.contact-lines span,
.address-line {
  gap: 6px;
}

.contact-lines svg,
.address-line svg {
  flex: 0 0 auto;
  color: #9ca3af;
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

.status-inactive {
  color: #6b7280;
}

.status-pill.status-inactive {
  background: #f3f4f6;
}

.row-actions {
  gap: 4px;
}

.row-actions button,
.modal-header button {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 8px;
  color: #9ca3af;
  background: transparent;
}

.row-actions button:last-child:hover {
  color: #dc2626;
  background: #fef2f2;
}

.row-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
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

h2 {
  color: #1f2937;
  font-size: 17px;
  font-weight: 600;
}

.supplier-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px 24px 24px;
}

.supplier-form label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
}

.supplier-form input,
.supplier-form select {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  color: #374151;
  background: #ffffff;
  outline: none;
  font-size: 14px;
}

.supplier-form input:focus,
.supplier-form select:focus {
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

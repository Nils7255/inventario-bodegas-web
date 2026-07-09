<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Edit2, LogOut, Package, Plus, Search, Trash2, X } from '@lucide/vue'

import {
  createProduct,
  deactivateProduct,
  getCategories,
  getProducts,
  updateProduct,
} from '../services/products'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const products = ref([])
const categories = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const formError = ref('')
const search = ref('')
const categoryFilter = ref('Todas')
const showForm = ref(false)
const editingProduct = ref(null)

const form = reactive({
  nombre: '',
  categoria: '',
  unidad_medida: '',
  precio_compra: '',
  precio_venta: '',
  stock_minimo: '',
})

const visibleCategories = computed(() => [
  'Todas',
  ...categories.value.map((category) => category.nombre),
])

const filteredProducts = computed(() => {
  const text = search.value.trim().toLowerCase()

  return products.value.filter((product) => {
    const matchesSearch = product.nombre.toLowerCase().includes(text)
    const matchesCategory =
      categoryFilter.value === 'Todas' || product.categoria_nombre === categoryFilter.value

    return matchesSearch && matchesCategory
  })
})

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [categoriesResponse, productsResponse] = await Promise.all([
      getCategories(),
      getProducts(),
    ])

    categories.value = categoriesResponse.data
    products.value = productsResponse.data
  } catch (requestError) {
    error.value = 'No se pudo cargar categorias y productos.'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.nombre = ''
  form.categoria = categories.value[0]?.id || ''
  form.unidad_medida = ''
  form.precio_compra = ''
  form.precio_venta = ''
  form.stock_minimo = ''
  formError.value = ''
  editingProduct.value = null
}

function openCreate() {
  resetForm()
  showForm.value = true
}

function openEdit(product) {
  editingProduct.value = product
  form.nombre = product.nombre
  form.categoria = product.categoria
  form.unidad_medida = product.unidad_medida
  form.precio_compra = product.precio_compra
  form.precio_venta = product.precio_venta
  form.stock_minimo = product.stock_minimo
  formError.value = ''
  showForm.value = true
}

function validateForm() {
  if (!form.nombre.trim()) return 'El nombre es obligatorio.'
  if (!form.categoria) return 'La categoria es obligatoria.'
  if (!form.unidad_medida.trim()) return 'La unidad de medida es obligatoria.'
  if (Number(form.precio_compra) < 0) return 'El precio de compra no puede ser negativo.'
  if (Number(form.precio_venta) < 0) return 'El precio de venta no puede ser negativo.'
  if (Number(form.stock_minimo) < 0) return 'El stock minimo no puede ser negativo.'
  return ''
}

async function submitProduct() {
  const validationMessage = validateForm()

  if (validationMessage) {
    formError.value = validationMessage
    return
  }

  saving.value = true
  formError.value = ''

  const payload = {
    nombre: form.nombre.trim(),
    categoria: form.categoria,
    unidad_medida: form.unidad_medida.trim(),
    precio_compra: form.precio_compra,
    precio_venta: form.precio_venta,
    stock_minimo: form.stock_minimo,
  }

  try {
    if (editingProduct.value) {
      const { data } = await updateProduct(editingProduct.value.id, payload)
      products.value = products.value.map((product) =>
        product.id === data.id ? data : product
      )
    } else {
      const { data } = await createProduct(payload)
      products.value = [...products.value, data]
    }

    showForm.value = false
  } catch (requestError) {
    formError.value = 'No se pudo guardar el producto. Revisa los datos ingresados.'
  } finally {
    saving.value = false
  }
}

async function handleDeactivate(product) {
  const confirmed = window.confirm(`Desactivar ${product.nombre}?`)

  if (!confirmed) return

  error.value = ''

  try {
    await deactivateProduct(product.id)
    products.value = products.value.filter((item) => item.id !== product.id)
  } catch (requestError) {
    error.value = 'No se pudo desactivar el producto.'
  }
}

function stockStatus(product) {
  if (product.stock_actual <= product.stock_minimo * 0.5) {
    return { label: 'Critico', className: 'status-critical' }
  }

  if (product.stock_actual < product.stock_minimo) {
    return { label: 'Bajo', className: 'status-low' }
  }

  return { label: 'Normal', className: 'status-ok' }
}

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}

onMounted(loadData)
</script>

<template>
  <main class="products-page">
    <header class="products-header">
      <div>
        <h1>Productos</h1>
        <p>{{ products.length }} productos registrados</p>
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
          Nuevo Producto
        </button>
      </div>
    </header>

    <section class="filters-row">
      <div class="search-box">
        <Search :size="15" />
        <input v-model="search" type="search" placeholder="Buscar producto..." />
      </div>

      <div class="category-tabs">
        <button
          v-for="category in visibleCategories"
          :key="category"
          type="button"
          :class="{ active: categoryFilter === category }"
          @click="categoryFilter = category"
        >
          {{ category }}
        </button>
      </div>
    </section>

    <p v-if="error" class="page-error">{{ error }}</p>

    <section class="products-table-card">
      <div v-if="loading" class="empty-state">Cargando productos...</div>

      <table v-else>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Stock Actual</th>
            <th>Stock Minimo</th>
            <th>Precio Venta</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>
              <div class="product-cell">
                <span class="product-icon">
                  <Package :size="14" />
                </span>
                <div>
                  <strong>{{ product.nombre }}</strong>
                  <small>{{ product.unidad_medida }}</small>
                </div>
              </div>
            </td>
            <td>{{ product.categoria_nombre }}</td>
            <td>
              <strong :class="stockStatus(product).className">{{ product.stock_actual }}</strong>
            </td>
            <td>{{ product.stock_minimo }}</td>
            <td>S/ {{ Number(product.precio_venta).toFixed(2) }}</td>
            <td>
              <span class="status-pill" :class="stockStatus(product).className">
                {{ stockStatus(product).label }}
              </span>
            </td>
            <td>
              <div class="row-actions">
                <button type="button" title="Editar producto" @click="openEdit(product)">
                  <Edit2 :size="14" />
                </button>
                <button type="button" title="Desactivar producto" @click="handleDeactivate(product)">
                  <Trash2 :size="14" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && filteredProducts.length === 0" class="empty-state">
        No se encontraron productos
      </div>
    </section>

    <div v-if="showForm" class="modal-backdrop">
      <section class="modal-panel" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h2>{{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
          <button type="button" title="Cerrar formulario" @click="showForm = false">
            <X :size="18" />
          </button>
        </header>

        <form class="product-form" @submit.prevent="submitProduct">
          <label class="span-2">
            Nombre del Producto
            <input v-model="form.nombre" type="text" required />
          </label>

          <label>
            Categoria
            <select v-model="form.categoria" required>
              <option value="" disabled>Seleccionar</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.nombre }}
              </option>
            </select>
          </label>

          <label>
            Unidad de Medida
            <input v-model="form.unidad_medida" type="text" required placeholder="Ej: Caja, Bolsa" />
          </label>

          <label>
            Precio Compra (S/)
            <input v-model="form.precio_compra" type="number" min="0" step="0.01" required />
          </label>

          <label>
            Precio Venta (S/)
            <input v-model="form.precio_venta" type="number" min="0" step="0.01" required />
          </label>

          <label>
            Stock Minimo
            <input v-model="form.stock_minimo" type="number" min="0" step="1" required />
          </label>

          <p v-if="editingProduct" class="stock-note">
            Stock actual: {{ editingProduct.stock_actual }}
          </p>

          <p v-if="formError" class="form-error span-2">{{ formError }}</p>

          <footer class="form-actions span-2">
            <button class="secondary-button" type="button" @click="showForm = false">
              Cancelar
            </button>
            <button class="primary-button" type="submit" :disabled="saving">
              {{ saving ? 'Guardando...' : editingProduct ? 'Guardar Cambios' : 'Crear Producto' }}
            </button>
          </footer>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.products-page {
  min-height: 100vh;
  padding: 24px;
  color: #1f2937;
  background: #f8fafc;
  font-family: Inter, system-ui, sans-serif;
}

.products-header,
.filters-row,
.header-actions,
.row-actions,
.product-cell,
.form-actions {
  display: flex;
  align-items: center;
}

.products-header {
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

.products-header p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
}

.header-actions {
  gap: 10px;
}

.module-nav {
  display: flex;
  align-items: center;
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

.filters-row {
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

.search-box input,
.product-form input,
.product-form select {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  background: #ffffff;
  outline: none;
}

.search-box input {
  padding: 10px 12px 10px 36px;
  font-size: 14px;
}

.search-box input:focus,
.product-form input:focus,
.product-form select:focus {
  border-color: #1a3c5e;
}

.category-tabs {
  display: flex;
  gap: 6px;
}

.category-tabs button {
  padding: 9px 12px;
  border-radius: 8px;
  color: #6b7280;
  background: #f3f4f6;
  font-size: 13px;
}

.category-tabs button.active {
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

.products-table-card {
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
  gap: 10px;
}

.product-icon {
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  place-items: center;
  border-radius: 8px;
  color: #1a3c5e;
  background: #eff6ff;
}

.product-cell strong {
  display: block;
  color: #1f2937;
  font-size: 13px;
  font-weight: 600;
}

.product-cell small {
  display: block;
  margin-top: 3px;
  color: #9ca3af;
  font-size: 11px;
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

.product-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px 24px 24px;
}

.product-form label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
}

.product-form input,
.product-form select {
  padding: 10px 12px;
  font-size: 14px;
}

.span-2 {
  grid-column: span 2;
}

.stock-note {
  align-self: end;
  color: #6b7280;
  font-size: 13px;
}

.form-actions {
  justify-content: flex-end;
  gap: 12px;
  padding-top: 4px;
}
</style>

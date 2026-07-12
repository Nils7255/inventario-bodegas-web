<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Edit2, Plus, Search, UserRound, X } from '@lucide/vue'

import {
  createUser,
  getRoles,
  getUsers,
  toggleUserStatus,
  updateUser,
} from '../services/users'

const users = ref([])
const roles = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')
const formError = ref('')
const search = ref('')
const showForm = ref(false)
const editingUser = ref(null)

const fallbackRoles = [
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Vendedor' },
]

const form = reactive({
  nombre: '',
  correo: '',
  password: '',
  rol: '',
  activo: true,
})

const visibleRoles = computed(() => (roles.value.length ? roles.value : fallbackRoles))

const filteredUsers = computed(() => {
  const text = search.value.trim().toLowerCase()

  if (!text) return users.value

  return users.value.filter((user) =>
    [user.nombre, user.correo, user.rol_nombre || user.rol]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(text))
  )
})

async function loadUsers() {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const [usersResponse, rolesResponse] = await Promise.all([
      getUsers(),
      getRoles(),
    ])

    users.value = usersResponse.data
    roles.value = rolesResponse.data
  } catch (requestError) {
    error.value = 'No se pudo cargar usuarios y roles.'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.nombre = ''
  form.correo = ''
  form.password = ''
  form.rol = visibleRoles.value[0]?.id || ''
  form.activo = true
  formError.value = ''
  editingUser.value = null
}

function openCreate() {
  resetForm()
  showForm.value = true
}

function openEdit(user) {
  editingUser.value = user
  form.nombre = user.nombre
  form.correo = user.correo
  form.password = ''
  form.rol = user.rol
  form.activo = user.activo
  formError.value = ''
  showForm.value = true
}

function validateForm() {
  if (!form.nombre.trim()) return 'El nombre es obligatorio.'
  if (!form.correo.trim()) return 'El correo es obligatorio.'
  if (!form.correo.includes('@')) return 'Ingresa un correo valido.'
  if (!editingUser.value && !form.password.trim()) return 'La contrasena es obligatoria.'
  if (!form.rol) return 'Selecciona un rol.'
  return ''
}

async function submitUser() {
  const validationMessage = validateForm()

  if (validationMessage) {
    formError.value = validationMessage
    return
  }

  saving.value = true
  formError.value = ''
  success.value = ''

  const payload = {
    nombre: form.nombre.trim(),
    correo: form.correo.trim(),
    rol: form.rol,
    activo: form.activo,
  }

  if (form.password.trim()) {
    payload.password = form.password
  }

  try {
    if (editingUser.value) {
      const { data } = await updateUser(editingUser.value.id, payload)
      users.value = users.value.map((user) => (user.id === data.id ? data : user))
    } else {
      const { data } = await createUser(payload)
      users.value = [...users.value, data]
    }

    showForm.value = false
    success.value = editingUser.value
      ? 'Usuario actualizado correctamente.'
      : 'Usuario creado correctamente.'
  } catch (requestError) {
    formError.value = 'No se pudo guardar el usuario. Revisa los datos ingresados.'
  } finally {
    saving.value = false
  }
}

async function handleToggleStatus(user) {
  error.value = ''
  success.value = ''

  try {
    const { data } = await toggleUserStatus(user.id, !user.activo)
    users.value = users.value.map((item) => (item.id === data.id ? data : item))
    success.value = data.activo
      ? 'Usuario activado correctamente.'
      : 'Usuario desactivado correctamente.'
  } catch (requestError) {
    error.value = 'No se pudo actualizar el estado del usuario.'
  }
}

function roleName(user) {
  if (user.rol_nombre) return user.rol_nombre
  if (typeof user.rol === 'string') return user.rol
  return visibleRoles.value.find((role) => role.id === user.rol)?.nombre || '-'
}

onMounted(loadUsers)
</script>

<template>
  <main class="users-page">
    <header class="users-header">
      <div>
        <h1>Usuarios</h1>
        <p>Administracion de usuarios y roles</p>
      </div>

      <button class="primary-button" type="button" @click="openCreate">
        <Plus :size="16" />
        Nuevo Usuario
      </button>
    </header>

    <section class="filters-row">
      <div class="search-box">
        <Search :size="15" />
        <input v-model="search" type="search" placeholder="Buscar usuario..." />
      </div>
    </section>

    <p v-if="error" class="page-error">{{ error }}</p>
    <p v-if="success" class="page-success">{{ success }}</p>

    <section class="users-table-card">
      <div v-if="loading" class="empty-state">Cargando usuarios...</div>

      <table v-else>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="user-cell">
                <span class="user-icon">
                  <UserRound :size="14" />
                </span>
                <strong>{{ user.nombre }}</strong>
              </div>
            </td>
            <td>{{ user.correo }}</td>
            <td>{{ roleName(user) }}</td>
            <td>
              <span class="status-pill" :class="user.activo ? 'status-ok' : 'status-inactive'">
                {{ user.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="row-actions">
                <button type="button" title="Editar usuario" @click="openEdit(user)">
                  <Edit2 :size="14" />
                </button>
                <button type="button" @click="handleToggleStatus(user)">
                  {{ user.activo ? 'Desactivar' : 'Activar' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && filteredUsers.length === 0" class="empty-state">
        No se encontraron usuarios
      </div>
    </section>

    <div v-if="showForm" class="modal-backdrop">
      <section class="modal-panel" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h2>{{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
          <button type="button" title="Cerrar formulario" @click="showForm = false">
            <X :size="18" />
          </button>
        </header>

        <form class="user-form" @submit.prevent="submitUser">
          <label>
            Nombre
            <input v-model="form.nombre" type="text" required />
          </label>

          <label>
            Correo
            <input v-model="form.correo" type="email" required />
          </label>

          <label>
            Contrasena
            <input
              v-model="form.password"
              type="password"
              :required="!editingUser"
              autocomplete="new-password"
            />
          </label>

          <label>
            Rol
            <select v-model="form.rol" required>
              <option value="" disabled>Seleccionar</option>
              <option v-for="role in visibleRoles" :key="role.id" :value="role.id">
                {{ role.nombre }}
              </option>
            </select>
          </label>

          <label>
            Estado
            <select v-model="form.activo">
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </label>

          <p v-if="formError" class="form-error span-2">{{ formError }}</p>

          <footer class="form-actions span-2">
            <button class="secondary-button" type="button" @click="showForm = false">
              Cancelar
            </button>
            <button class="primary-button" type="submit" :disabled="saving">
              {{ saving ? 'Guardando...' : editingUser ? 'Guardar Cambios' : 'Crear Usuario' }}
            </button>
          </footer>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.users-page {
  min-height: 100vh;
  padding: 24px;
  color: #1f2937;
  background: #f8fafc;
  font-family: Inter, system-ui, sans-serif;
}

.users-header,
.filters-row,
.user-cell,
.row-actions,
.form-actions {
  display: flex;
  align-items: center;
}

.users-header {
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

.users-header p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
}

button {
  border: 0;
  cursor: pointer;
  font: inherit;
}

.primary-button,
.secondary-button {
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
.row-actions button:hover,
.modal-header button:hover {
  background: #f3f4f6;
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
.user-form input,
.user-form select {
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
.user-form input:focus,
.user-form select:focus {
  border-color: #1a3c5e;
}

.page-error,
.form-error {
  color: #dc2626;
  font-size: 14px;
}

.page-error {
  margin-bottom: 12px;
}

.users-table-card {
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

.user-cell {
  gap: 10px;
}

.user-icon {
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  place-items: center;
  border-radius: 8px;
  color: #1a3c5e;
  background: #eff6ff;
}

.user-cell strong {
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

.status-inactive {
  color: #6b7280;
}

.status-pill.status-inactive {
  background: #f3f4f6;
}

.row-actions {
  justify-content: flex-end;
  gap: 8px;
}

.row-actions button {
  min-height: 30px;
  border-radius: 8px;
  padding: 6px 10px;
  color: #6b7280;
  background: transparent;
  font-size: 12px;
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

.user-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px 24px 24px;
}

.user-form label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
}

.user-form input,
.user-form select {
  padding: 10px 12px;
  font-size: 14px;
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

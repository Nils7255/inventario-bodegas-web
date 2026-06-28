<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const formError = ref('')

function validate() {
  if (!email.value || !password.value) {
    formError.value = 'Completa correo y contraseña.'
    return false
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email.value)) {
    formError.value = 'Ingresa un correo válido.'
    return false
  }
  formError.value = ''
  return true
}

async function handleSubmit() {
  if (!validate()) return

  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch (err) {
    formError.value = err.message || 'No se pudo iniciar sesión.'
  }
}
</script>

<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="handleSubmit">
      <h1>Iniciar sesión</h1>
      <p class="subtitle">Sistema de Inventario de Bodegas</p>

      <label for="email">Correo electrónico</label>
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="usuario@empresa.com"
        autocomplete="username"
      />

      <label for="password">Contraseña</label>
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="••••••••"
        autocomplete="current-password"
      />

      <p v-if="formError" class="error">{{ formError }}</p>

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f6f8;
}

.login-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 320px;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

h1 {
  margin: 0;
  font-size: 1.4rem;
}

.subtitle {
  margin: 0 0 1rem;
  color: #6b7280;
  font-size: 0.85rem;
}

label {
  font-size: 0.85rem;
  color: #374151;
}

input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.95rem;
}

button {
  margin-top: 1rem;
  padding: 0.6rem;
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  font-size: 0.8rem;
  margin: 0.25rem 0 0;
}
</style>

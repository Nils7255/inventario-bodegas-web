<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  correo: '',
  password: '',
})

async function submitLogin() {
  await auth.login(form)
  router.push({ name: 'home' })
}
</script>

<template>
  <main class="auth-page">
    <form class="auth-panel" @submit.prevent="submitLogin">
      <p class="auth-kicker">Inventario Bodegas Web</p>
      <h1>Iniciar sesion</h1>

      <label>
        Correo
        <input v-model="form.correo" type="email" autocomplete="email" required />
      </label>

      <label>
        Contrasena
        <input v-model="form.password" type="password" autocomplete="current-password" required />
      </label>

      <p v-if="auth.error" class="auth-error">{{ auth.error }}</p>

      <button type="submit" :disabled="auth.loading">
        {{ auth.loading ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.auth-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
}

.auth-panel {
  width: min(100%, 380px);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.auth-kicker {
  margin: 0 0 8px;
  color: #1a3c5e;
  font-size: 14px;
  font-weight: 700;
}

h1 {
  margin: 0 0 24px;
  color: #0f172a;
  font-size: 26px;
  line-height: 1.2;
}

label {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 11px 12px;
  color: #0f172a;
  background: #ffffff;
}

input:focus {
  border-color: #1a3c5e;
  outline: 3px solid rgba(26, 60, 94, 0.12);
}

button {
  width: 100%;
  border: 0;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  background: #1a3c5e;
  cursor: pointer;
  font-weight: 700;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.auth-error {
  margin: 0 0 16px;
  color: #b91c1c;
  font-size: 14px;
}
</style>

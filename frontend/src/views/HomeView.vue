<script setup>
import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="setup-page">
    <section class="setup-panel">
      <p class="setup-kicker">Inventario Bodegas Web</p>
      <h1>Sesion iniciada</h1>
      <p>{{ auth.user?.nombre || 'Usuario autenticado' }}</p>
      <button type="button" @click="logout">Cerrar sesion</button>
    </section>
  </main>
</template>

<style scoped>
.setup-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
}

.setup-panel {
  width: min(100%, 480px);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(26, 60, 94, 0.06);
}

.setup-kicker {
  margin: 0 0 8px;
  color: #1a3c5e;
  font-size: 14px;
  font-weight: 700;
}

h1 {
  margin: 0;
  color: #0f172a;
  font-size: 26px;
  line-height: 1.2;
}

p {
  margin: 12px 0 0;
  color: #64748b;
}

button {
  margin-top: 20px;
  border: 0;
  border-radius: 8px;
  padding: 10px 14px;
  color: #ffffff;
  background: #1a3c5e;
  cursor: pointer;
  font-weight: 700;
}
</style>

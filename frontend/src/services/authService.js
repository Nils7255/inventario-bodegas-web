// Servicio de autenticación
// Comunica el frontend con los endpoints de auth del backend (API REST)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/**
 * Envía las credenciales al backend y retorna el usuario + token.
 * @param {{ email: string, password: string }} credentials
 */
export async function login(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.message || 'Credenciales inválidas')
  }

  return response.json() // { user, token }
}

/**
 * Cierra la sesión actual en el backend (invalida el token).
 */
export async function logout(token) {
  return fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}

export default { login, logout }

import { apiClient } from './client'

const TOKEN_KEY = 'accessToken'
const EMAIL_KEY = 'adminEmail'

export const login = async ({ email, password }) => {
  const result = await apiClient.post('/admin/auth/login', { email, password })
  localStorage.setItem(TOKEN_KEY, result.accessToken)
  localStorage.setItem(EMAIL_KEY, email)
  return result
}

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EMAIL_KEY)
}

export const isAuthenticated = () => Boolean(localStorage.getItem(TOKEN_KEY))

export const getAdminEmail = () => localStorage.getItem(EMAIL_KEY)

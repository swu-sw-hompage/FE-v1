import { apiClient } from './client'

const TOKEN_KEY = 'accessToken'
const EMAIL_KEY = 'adminEmail'

// API가 401을 주거나 토큰 만료 시각이 지나면 이 이벤트를 쏜다. RequireAdmin이 듣고 로그인 화면으로 보낸다.
export const SESSION_EXPIRED_EVENT = 'admin-session-expired'

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

export const expireSession = () => {
  logout()
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
}

// JWT payload의 exp(초)를 ms로 돌려준다. 형식이 이상하면 null.
export const getTokenExpiresAt = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(payload))
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

export const isAuthenticated = () => {
  if (!localStorage.getItem(TOKEN_KEY)) return false
  const expiresAt = getTokenExpiresAt()
  return expiresAt === null || Date.now() < expiresAt
}

export const getAdminEmail = () => localStorage.getItem(EMAIL_KEY)

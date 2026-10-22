import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { SESSION_EXPIRED_EVENT, expireSession, getTokenExpiresAt, isAuthenticated, logout } from '../api/auth'

// 관리자 화면 공통 가드: 토큰이 없거나 만료됐으면 로그인으로 보낸다.
// 화면을 켜 둔 채로 만료 시각이 지나거나 API가 401을 주면 그 즉시 로그인으로 넘어간다.
export default function RequireAdmin({ children }) {
  const location = useLocation()
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const onExpired = () => setExpired(true)
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)

    const expiresAt = getTokenExpiresAt()
    // setTimeout은 약 24.8일을 넘기면 바로 실행되므로 그 이상은 예약하지 않는다.
    const delay = expiresAt === null ? null : expiresAt - Date.now()
    const timer = delay !== null && delay < 2 ** 31 - 1 ? setTimeout(expireSession, Math.max(delay, 0)) : null

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
      if (timer) clearTimeout(timer)
    }
  }, [])

  if (expired || !isAuthenticated()) {
    const hadSession = expired || Boolean(localStorage.getItem('accessToken'))
    logout()
    return <Navigate to="/login" replace state={{ from: location.pathname, expired: hadSession }} />
  }
  return children
}

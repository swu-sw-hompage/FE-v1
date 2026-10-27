import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { login } from '../../api/auth'
import logoFull from '../../assets/images/brand/logo-full.svg'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  // RequireAdmin이 넘겨준 정보: 원래 가려던 관리자 화면, 세션 만료로 튕겨났는지 여부
  const redirectTo = location.state?.from?.startsWith('/admin') ? location.state.from : '/admin/notices'
  const sessionExpired = Boolean(location.state?.expired)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <header className="admin-login__topbar">
        <Link to="/" className="admin-login__logo">
          <img src={logoFull} alt="서울여자대학교 소프트웨어학과" />
        </Link>
        <Link to="/" className="admin-login__site-link">
          학과 홈페이지 바로가기 ↗
        </Link>
      </header>

      <div className="admin-login__content">
        <div className="admin-login__card">
          <div>
            <span className="admin-login__badge">ADMIN</span>
            <p className="admin-login__title">관리자 로그인</p>
            <p className="admin-login__subtitle">소프트웨어학과 홈페이지 운영진 전용 페이지입니다.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <label className="admin-login__field">
              <span>관리자 아이디</span>
              <input
                type="text"
                autoComplete="username"
                placeholder="아이디를 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="admin-login__field">
              <span>비밀번호</span>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {sessionExpired && !error && (
              <p className="admin-login__error" role="alert">
                로그인 시간이 만료되었습니다. 다시 로그인해 주세요.
              </p>
            )}

            {error && (
              <p className="admin-login__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="admin-login__submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>

            <p className="admin-login__help">
              <span>비밀번호를 잊으셨나요?</span>
              <span>관리자 계정 담당자에게 문의해주세요</span>
            </p>
          </form>
        </div>
      </div>

      <p className="admin-login__footer">© 2026 Seoul Women's University Department of Computer Science &amp; Engineering</p>
    </div>
  )
}
